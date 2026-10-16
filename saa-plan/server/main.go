// Command saa-plan serves the study tracker's static site and keeps its progress in SQLite.
//
// Endpoints:
//
//	GET  /api/state  → {"rev": n, "doc": {...} | null, "savedAt": "..."}
//	PUT  /api/state  ← {"rev": n, "doc": {...}}   200 {"rev": n+1} or 409 with the current state
//	GET  /healthz    → 200 "ok" when the database answers
//	GET  /*          → files from SITE_DIR
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log/slog"
	"mime"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path"
	"strings"
	"syscall"
	"time"
)

const maxDoc = 4 << 20 // progress documents are a few hundred KB at most

type config struct {
	addr  string
	site  string
	db    string
	hosts map[string]bool // host names (no port) the server answers to
}

func loadConfig() config {
	c := config{
		addr:  env("ADDR", ":8080"),
		site:  env("SITE_DIR", "../site"),
		db:    env("DB_PATH", "data/saa.db"),
		hosts: map[string]bool{},
	}
	for _, h := range strings.Split(env("ALLOWED_HOSTS", "localhost,127.0.0.1,::1"), ",") {
		if h = strings.ToLower(strings.TrimSpace(h)); h != "" {
			c.hosts[h] = true
		}
	}
	return c
}

func env(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}

func main() {
	healthcheck := flag.Bool("healthcheck", false, "probe /healthz on the local server and exit 0/1 (for Docker HEALTHCHECK)")
	flag.Parse()
	cfg := loadConfig()
	log := slog.New(slog.NewTextHandler(os.Stderr, nil))

	if *healthcheck {
		os.Exit(probe(cfg.addr))
	}

	st, err := openStore(cfg.db)
	if err != nil {
		log.Error("open database", "path", cfg.db, "err", err)
		os.Exit(1)
	}
	defer st.close()

	srv := &http.Server{
		Addr:              cfg.addr,
		Handler:           newHandler(cfg, st, log),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    16 << 10,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	drained := make(chan struct{})
	go func() {
		defer close(drained)
		<-ctx.Done()
		shut, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		srv.Shutdown(shut)
	}()

	log.Info("listening", "addr", cfg.addr, "site", cfg.site, "db", cfg.db)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Error("serve", "err", err)
		os.Exit(1)
	}
	<-drained // let in-flight saves finish before the deferred database close
}

func probe(addr string) int {
	_, port, err := net.SplitHostPort(addr)
	if err != nil {
		return 1
	}
	c := http.Client{Timeout: 2 * time.Second}
	resp, err := c.Get("http://127.0.0.1:" + port + "/healthz")
	if err != nil {
		return 1
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return 1
	}
	return 0
}

func newHandler(cfg config, st *store, log *slog.Logger) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		if err := st.ping(r.Context()); err != nil {
			http.Error(w, "database unavailable", http.StatusServiceUnavailable)
			return
		}
		fmt.Fprintln(w, "ok")
	})

	mux.HandleFunc("GET /api/state", func(w http.ResponseWriter, r *http.Request) {
		s, err := st.get(r.Context())
		if err != nil {
			log.Error("get state", "err", err)
			http.Error(w, "storage error", http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, s)
	})

	mux.HandleFunc("PUT /api/state", func(w http.ResponseWriter, r *http.Request) {
		// A JSON content type forces a CORS preflight for cross-origin callers, which we never approve.
		if mt, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type")); mt != "application/json" {
			http.Error(w, "content type must be application/json", http.StatusUnsupportedMediaType)
			return
		}
		var in struct {
			Rev *int64          `json:"rev"`
			Doc json.RawMessage `json:"doc"`
		}
		dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxDoc))
		if err := dec.Decode(&in); err != nil {
			var tooBig *http.MaxBytesError
			if errors.As(err, &tooBig) {
				http.Error(w, "document too large", http.StatusRequestEntityTooLarge)
				return
			}
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}
		doc := bytes.TrimSpace(in.Doc)
		if in.Rev == nil || *in.Rev < 0 || len(doc) == 0 || doc[0] != '{' {
			http.Error(w, `body must be {"rev": <number>, "doc": {...}}`, http.StatusBadRequest)
			return
		}
		s, ok, err := st.put(r.Context(), *in.Rev, doc)
		if err != nil {
			log.Error("put state", "err", err)
			http.Error(w, "storage error", http.StatusInternalServerError)
			return
		}
		if !ok {
			writeJSON(w, http.StatusConflict, s)
			return
		}
		writeJSON(w, http.StatusOK, s)
	})

	mux.Handle("GET /", static(cfg.site))
	return guard(cfg, mux)
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(v)
}

const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
	"font-src https://fonts.gstatic.com; img-src 'self' data: https://media.giphy.com; connect-src 'self'; object-src 'none'; " +
	"base-uri 'none'; form-action 'self'; frame-ancestors 'none'"

// guard adds security headers and rejects requests that could come from another site:
// unknown Host names (DNS rebinding) and cross-site writes (CSRF).
func guard(cfg config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h := w.Header()
		h.Set("Content-Security-Policy", csp)
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("X-Frame-Options", "DENY")
		h.Set("Referrer-Policy", "no-referrer")
		h.Set("Cross-Origin-Opener-Policy", "same-origin")
		h.Set("Cross-Origin-Resource-Policy", "same-origin")
		h.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

		if r.URL.Path != "/healthz" && !cfg.hosts[hostOnly(r.Host)] {
			http.Error(w, "unknown host; add it to ALLOWED_HOSTS", http.StatusMisdirectedRequest)
			return
		}
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			if sfs := r.Header.Get("Sec-Fetch-Site"); sfs != "" && sfs != "same-origin" {
				http.Error(w, "cross-site request refused", http.StatusForbidden)
				return
			}
			if o := r.Header.Get("Origin"); o != "" && o != "http://"+r.Host && o != "https://"+r.Host {
				http.Error(w, "cross-origin request refused", http.StatusForbidden)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}

func hostOnly(hostport string) string {
	if h, _, err := net.SplitHostPort(hostport); err == nil {
		return strings.ToLower(h)
	}
	return strings.ToLower(strings.Trim(hostport, "[]"))
}

// static serves the site directory. Files revalidate on every load (cheap 304s via
// Last-Modified) so a rebuilt image is picked up immediately. No directory listings.
func static(dir string) http.Handler {
	files := http.FileServer(http.FS(noListing{os.DirFS(dir)}))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache")
		files.ServeHTTP(w, r)
	})
}

type noListing struct{ fs.FS }

// Open refuses directories that have no index.html, so http.FileServer can't list them.
func (n noListing) Open(name string) (fs.File, error) {
	f, err := n.FS.Open(name)
	if err != nil {
		return nil, err
	}
	if info, err := f.Stat(); err == nil && info.IsDir() {
		idx, err := n.FS.Open(path.Join(name, "index.html"))
		if err != nil {
			f.Close()
			return nil, fs.ErrNotExist
		}
		idx.Close()
	}
	return f, nil
}
