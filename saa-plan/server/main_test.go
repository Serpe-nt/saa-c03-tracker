package main

import (
	"compress/gzip"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func setup(t *testing.T) (http.Handler, string) {
	t.Helper()
	dir := t.TempDir()
	site := filepath.Join(dir, "site")
	os.MkdirAll(filepath.Join(site, "quiz"), 0o755)
	os.WriteFile(filepath.Join(site, "index.html"), []byte("<!doctype html><title>t</title>"), 0o644)
	os.WriteFile(filepath.Join(site, "quiz", "d01.js"), []byte("window.QUIZ.push();"), 0o644)
	db := filepath.Join(dir, "data", "saa.db")
	st, err := openStore(db)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { st.close() })
	cfg := loadConfig()
	cfg.site = site
	return newHandler(cfg, st, slog.New(slog.NewTextHandler(io.Discard, nil))), db
}

func do(h http.Handler, method, target, body string, hdr ...string) *httptest.ResponseRecorder {
	r := httptest.NewRequest(method, target, strings.NewReader(body))
	r.Host = "localhost:8080"
	if body != "" {
		r.Header.Set("Content-Type", "application/json")
	}
	for i := 0; i+1 < len(hdr); i += 2 {
		if hdr[i] == "Host" {
			r.Host = hdr[i+1]
		} else {
			r.Header.Set(hdr[i], hdr[i+1])
		}
	}
	w := httptest.NewRecorder()
	h.ServeHTTP(w, r)
	return w
}

func decode(t *testing.T, w *httptest.ResponseRecorder) state {
	t.Helper()
	var s state
	if err := json.Unmarshal(w.Body.Bytes(), &s); err != nil {
		t.Fatalf("decode %q: %v", w.Body.String(), err)
	}
	return s
}

func TestStateRoundTripAndConflict(t *testing.T) {
	h, _ := setup(t)

	w := do(h, "GET", "/api/state", "")
	if w.Code != 200 {
		t.Fatalf("empty GET = %d", w.Code)
	}
	if s := decode(t, w); s.Rev != 0 || string(s.Doc) != "null" {
		t.Fatalf("empty state = %+v", s)
	}

	w = do(h, "PUT", "/api/state", `{"rev":0,"doc":{"ticks":{"d1a1":true}}}`)
	if w.Code != 200 || decode(t, w).Rev != 1 {
		t.Fatalf("first PUT = %d %s", w.Code, w.Body)
	}

	w = do(h, "GET", "/api/state", "")
	s := decode(t, w)
	if s.Rev != 1 || !strings.Contains(string(s.Doc), `"d1a1":true`) || s.SavedAt == "" {
		t.Fatalf("after PUT = %+v", s)
	}
	if cc := w.Header().Get("Cache-Control"); cc != "no-store" {
		t.Errorf("API Cache-Control = %q", cc)
	}

	// A second browser still on rev 0 must not overwrite rev 1.
	w = do(h, "PUT", "/api/state", `{"rev":0,"doc":{"ticks":{}}}`)
	if w.Code != http.StatusConflict {
		t.Fatalf("stale PUT = %d", w.Code)
	}
	if s := decode(t, w); s.Rev != 1 || !strings.Contains(string(s.Doc), "d1a1") {
		t.Fatalf("conflict body = %+v", s)
	}

	w = do(h, "PUT", "/api/state", `{"rev":1,"doc":{"ticks":{}}}`)
	if w.Code != 200 || decode(t, w).Rev != 2 {
		t.Fatalf("second PUT = %d %s", w.Code, w.Body)
	}
}

// A device that already has the newest revision gets 304 and no document; a newer revision comes in full.
func TestStateNotModified(t *testing.T) {
	h, _ := setup(t)
	if w := do(h, "GET", "/api/state", "", "If-None-Match", `"0"`); w.Code != http.StatusNotModified || w.Body.Len() != 0 {
		t.Fatalf("empty store, rev 0 known = %d %q", w.Code, w.Body)
	}
	do(h, "PUT", "/api/state", `{"rev":0,"doc":{"a":1}}`)
	w := do(h, "GET", "/api/state", "")
	if w.Code != 200 || w.Header().Get("ETag") != `"1"` {
		t.Fatalf("GET = %d, ETag %q", w.Code, w.Header().Get("ETag"))
	}
	if w := do(h, "GET", "/api/state", "", "If-None-Match", `"0"`); w.Code != 200 || decode(t, w).Rev != 1 {
		t.Fatalf("stale rev = %d, want the document", w.Code)
	}
	for _, inm := range []string{`"1"`, `W/"1"`, `"7", "1"`} {
		w := do(h, "GET", "/api/state", "", "If-None-Match", inm)
		if w.Code != http.StatusNotModified || w.Header().Get("ETag") != `"1"` || w.Header().Get("Cache-Control") != "no-store" {
			t.Errorf("If-None-Match %s = %d %v", inm, w.Code, w.Header())
		}
	}
}

// Text answers are compressed for a browser that asks; a 304, a Range request and other browsers get them as they are.
func TestGzip(t *testing.T) {
	h, _ := setup(t)
	do(h, "PUT", "/api/state", `{"rev":0,"doc":{"notes":{"d1":"`+strings.Repeat("compress me ", 200)+`"}}}`)
	for _, p := range []string{"/", "/quiz/d01.js", "/api/state"} {
		w := do(h, "GET", p, "", "Accept-Encoding", "br, gzip;q=0.8")
		if w.Code != 200 || w.Header().Get("Content-Encoding") != "gzip" || w.Header().Get("Content-Length") != "" || !strings.Contains(w.Header().Get("Vary"), "Accept-Encoding") {
			t.Fatalf("GET %s = %d %v", p, w.Code, w.Header())
		}
		zr, err := gzip.NewReader(w.Body)
		if err != nil {
			t.Fatalf("GET %s: %v", p, err)
		}
		b, _ := io.ReadAll(zr)
		if p == "/" && !strings.Contains(string(b), "<title>t</title>") || p == "/api/state" && !strings.Contains(string(b), "compress me") {
			t.Errorf("GET %s decompressed to %q", p, b)
		}
	}
	if w := do(h, "GET", "/", ""); w.Header().Get("Content-Encoding") != "" {
		t.Errorf("no Accept-Encoding, still compressed")
	}
	if w := do(h, "GET", "/", "", "Accept-Encoding", "gzip;q=0"); w.Header().Get("Content-Encoding") != "" {
		t.Errorf("gzip;q=0, still compressed")
	}
	if w := do(h, "GET", "/", "", "Accept-Encoding", "gzip", "Range", "bytes=0-4"); w.Code != http.StatusPartialContent || w.Header().Get("Content-Encoding") != "" {
		t.Errorf("Range = %d %v", w.Code, w.Header())
	}
	lm := do(h, "GET", "/", "").Header().Get("Last-Modified")
	if w := do(h, "GET", "/", "", "Accept-Encoding", "gzip", "If-Modified-Since", lm); w.Code != http.StatusNotModified || w.Body.Len() != 0 {
		t.Errorf("revalidation = %d, %d bytes", w.Code, w.Body.Len())
	}
}

func TestStatePersistsAcrossRestart(t *testing.T) {
	h, db := setup(t)
	if w := do(h, "PUT", "/api/state", `{"rev":0,"doc":{"notes":{"d1":"hi"}}}`); w.Code != 200 {
		t.Fatalf("PUT = %d", w.Code)
	}
	st, err := openStore(db)
	if err != nil {
		t.Fatal(err)
	}
	defer st.close()
	s, err := st.get(t.Context())
	if err != nil || s.Rev != 1 || !strings.Contains(string(s.Doc), `"hi"`) {
		t.Fatalf("reopened = %+v, %v", s, err)
	}
}

func TestPutValidation(t *testing.T) {
	h, _ := setup(t)
	cases := []struct {
		name, body, ctype string
		want              int
	}{
		{"wrong content type", `{"rev":0,"doc":{}}`, "text/plain", http.StatusUnsupportedMediaType},
		{"invalid JSON", `{"rev":0,"doc":{`, "application/json", http.StatusBadRequest},
		{"doc not an object", `{"rev":0,"doc":[1,2]}`, "application/json", http.StatusBadRequest},
		{"missing rev", `{"doc":{}}`, "application/json", http.StatusBadRequest},
		{"negative rev", `{"rev":-1,"doc":{}}`, "application/json", http.StatusBadRequest},
		{"too large", `{"rev":0,"doc":{"x":"` + strings.Repeat("a", maxDoc) + `"}}`, "application/json", http.StatusRequestEntityTooLarge},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			w := do(h, "PUT", "/api/state", c.body, "Content-Type", c.ctype)
			if w.Code != c.want {
				t.Fatalf("got %d, want %d (%s)", w.Code, c.want, w.Body)
			}
		})
	}
	if w := do(h, "DELETE", "/api/state", ""); w.Code != http.StatusMethodNotAllowed {
		t.Errorf("DELETE = %d", w.Code)
	}
}

func TestGuard(t *testing.T) {
	h, _ := setup(t)
	body := `{"rev":0,"doc":{}}`

	if w := do(h, "GET", "/api/state", "", "Host", "evil.example:8080"); w.Code != http.StatusMisdirectedRequest {
		t.Errorf("unknown host = %d", w.Code)
	}
	if w := do(h, "GET", "/api/state", "", "Host", "127.0.0.1:9999"); w.Code != 200 {
		t.Errorf("allowed host on another port = %d", w.Code)
	}
	if w := do(h, "GET", "/healthz", "", "Host", "anything:1"); w.Code != 200 {
		t.Errorf("healthz should skip the host check, got %d", w.Code)
	}
	if w := do(h, "PUT", "/api/state", body, "Sec-Fetch-Site", "cross-site"); w.Code != http.StatusForbidden {
		t.Errorf("cross-site PUT = %d", w.Code)
	}
	if w := do(h, "PUT", "/api/state", body, "Origin", "https://evil.example"); w.Code != http.StatusForbidden {
		t.Errorf("foreign Origin PUT = %d", w.Code)
	}
	if w := do(h, "PUT", "/api/state", body, "Sec-Fetch-Site", "same-origin", "Origin", "http://localhost:8080"); w.Code != 200 {
		t.Errorf("same-origin PUT = %d %s", w.Code, w.Body)
	}
}

func TestStaticFiles(t *testing.T) {
	h, _ := setup(t)
	w := do(h, "GET", "/", "")
	if w.Code != 200 || !strings.Contains(w.Body.String(), "<title>t</title>") {
		t.Fatalf("index = %d %q", w.Code, w.Body)
	}
	for _, k := range []string{"Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy"} {
		if w.Header().Get(k) == "" {
			t.Errorf("missing header %s", k)
		}
	}
	if cc := w.Header().Get("Cache-Control"); cc != "no-cache" {
		t.Errorf("static Cache-Control = %q", cc)
	}
	if w := do(h, "GET", "/quiz/d01.js", ""); w.Code != 200 {
		t.Errorf("quiz file = %d", w.Code)
	}
	if w := do(h, "GET", "/quiz/", ""); w.Code != http.StatusNotFound {
		t.Errorf("directory listing = %d, want 404", w.Code)
	}
	if w := do(h, "GET", "/../go.mod", ""); w.Code == 200 {
		t.Errorf("path traversal served a file")
	}
}

func TestProbeFailsWithoutServer(t *testing.T) {
	if probe("127.0.0.1:1") == 0 {
		t.Fatal("probe should fail when nothing listens")
	}
}

func TestBasePath(t *testing.T) {
	t.Setenv("BASE_PATH", "h1/") // normalised to /h1
	h, _ := setup(t)
	if w := do(h, "GET", "/h1/", ""); w.Code != 200 || !strings.Contains(w.Body.String(), "<title>t</title>") {
		t.Fatalf("index under prefix = %d %q", w.Code, w.Body)
	}
	if w := do(h, "GET", "/h1/quiz/d01.js", ""); w.Code != 200 {
		t.Errorf("file under prefix = %d", w.Code)
	}
	w := do(h, "PUT", "/h1/api/state", `{"rev":0,"doc":{"a":1}}`)
	if w.Code != 200 {
		t.Fatalf("PUT under prefix = %d %q", w.Code, w.Body)
	}
	if s := decode(t, do(h, "GET", "/h1/api/state", "")); s.Rev != 1 {
		t.Errorf("GET under prefix rev = %d, want 1", s.Rev)
	}
	if w := do(h, "GET", "/h1?x=1", ""); w.Code != http.StatusMovedPermanently || w.Header().Get("Location") != "/h1/?x=1" {
		t.Errorf("bare prefix = %d %q, want 301 /h1/?x=1", w.Code, w.Header().Get("Location"))
	}
	for _, p := range []string{"/", "/api/state", "/quiz/d01.js", "/h10/", "/h1x"} {
		if w := do(h, "GET", p, ""); w.Code != http.StatusNotFound {
			t.Errorf("GET %s outside prefix = %d, want 404", p, w.Code)
		}
	}
	if w := do(h, "GET", "/healthz", ""); w.Code != 200 {
		t.Errorf("healthz at root = %d", w.Code)
	}
	if w := do(h, "PUT", "/h1/api/state", `{"rev":1,"doc":{}}`, "Origin", "https://evil.example"); w.Code != http.StatusForbidden {
		t.Errorf("cross-origin PUT under prefix = %d, want 403", w.Code)
	}
}

func TestBasePathRoot(t *testing.T) {
	for _, v := range []string{"", "/", "//"} {
		t.Setenv("BASE_PATH", v)
		if b := loadConfig().base; b != "" {
			t.Errorf("BASE_PATH=%q → %q, want root", v, b)
		}
	}
}

func TestValidBase(t *testing.T) {
	for _, b := range []string{"", "/h1", "/study/h1", "/a-b_c.d~e"} {
		if !validBase(b) {
			t.Errorf("validBase(%q) = false", b)
		}
	}
	for _, b := range []string{"/C:/Program Files/Git/h1", "/h{x}", "/a//b", "/a/../b", "/..", "/h1?x"} {
		if validBase(b) {
			t.Errorf("validBase(%q) = true", b)
		}
	}
}
