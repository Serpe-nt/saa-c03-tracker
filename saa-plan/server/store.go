package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite" // pure-Go SQLite driver: static binary, no cgo
)

// store keeps the tracker's whole progress document in one SQLite row.
// rev increases on every write so two browsers can't silently overwrite each other.
type store struct{ db *sql.DB }

type state struct {
	Rev     int64           `json:"rev"`
	Doc     json.RawMessage `json:"doc,omitempty"` // JSON null when nothing is saved yet
	SavedAt string          `json:"savedAt,omitempty"`
}

const schema = `
CREATE TABLE IF NOT EXISTS state (
  id       INTEGER PRIMARY KEY CHECK (id = 1),
  rev      INTEGER NOT NULL,
  doc      TEXT    NOT NULL,
  saved_at TEXT    NOT NULL
);`

func openStore(path string) (*store, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return nil, err
	}
	dsn := "file:" + path + "?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)&_pragma=temp_store(MEMORY)"
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1) // one writer; also serialises the read-check-write in put
	if _, err := db.Exec(schema); err != nil {
		db.Close()
		return nil, fmt.Errorf("create schema: %w", err)
	}
	return &store{db: db}, nil
}

func (s *store) close() error { return s.db.Close() }

func (s *store) ping(ctx context.Context) error { return s.db.PingContext(ctx) }

// get returns the stored document, or rev 0 and a JSON null when nothing is saved yet.
func (s *store) get(ctx context.Context) (state, error) {
	var st state
	var doc string
	err := s.db.QueryRowContext(ctx, `SELECT rev, doc, saved_at FROM state WHERE id = 1`).Scan(&st.Rev, &doc, &st.SavedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return state{Doc: json.RawMessage("null")}, nil
	}
	if err != nil {
		return state{}, err
	}
	st.Doc = json.RawMessage(doc)
	return st, nil
}

// rev returns the current revision without reading the document (0 when nothing is saved yet),
// so a browser asking "anything new?" every few seconds costs one tiny query.
func (s *store) rev(ctx context.Context) (int64, error) {
	var rev int64
	err := s.db.QueryRowContext(ctx, `SELECT rev FROM state WHERE id = 1`).Scan(&rev)
	if errors.Is(err, sql.ErrNoRows) {
		return 0, nil
	}
	return rev, err
}

// put stores doc if rev matches the current revision. On a mismatch it returns the current
// state and ok=false, so the caller can answer 409 with what the other browser saved.
func (s *store) put(ctx context.Context, rev int64, doc []byte) (st state, ok bool, err error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return state{}, false, err
	}
	defer tx.Rollback()

	var cur int64
	var curDoc, curAt string
	err = tx.QueryRowContext(ctx, `SELECT rev, doc, saved_at FROM state WHERE id = 1`).Scan(&cur, &curDoc, &curAt)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return state{}, false, err
	}
	if cur != rev {
		return state{Rev: cur, Doc: json.RawMessage(curDoc), SavedAt: curAt}, false, nil
	}
	now := time.Now().UTC().Format(time.RFC3339)
	_, err = tx.ExecContext(ctx,
		`INSERT INTO state (id, rev, doc, saved_at) VALUES (1, ?, ?, ?)
		 ON CONFLICT(id) DO UPDATE SET rev = excluded.rev, doc = excluded.doc, saved_at = excluded.saved_at`,
		cur+1, string(doc), now)
	if err != nil {
		return state{}, false, err
	}
	if err := tx.Commit(); err != nil {
		return state{}, false, err
	}
	return state{Rev: cur + 1, SavedAt: now}, true, nil
}
