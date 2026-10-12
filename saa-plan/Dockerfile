# Build: static Go binary (pure-Go SQLite driver, so no cgo and no libc needed at runtime).
FROM golang:1.27-alpine AS build
WORKDIR /src
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/saa-plan . \
 && mkdir -p /out/data

# Run: distroless (no shell, no package manager), non-root user 65532.
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/saa-plan /app/saa-plan
# Owned by the non-root user so the named volume mounted here starts writable.
COPY --from=build --chown=65532:65532 /out/data /data
COPY site/ /srv/site/
ENV ADDR=:8080 SITE_DIR=/srv/site DB_PATH=/data/saa.db
EXPOSE 8080
VOLUME /data
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD ["/app/saa-plan", "-healthcheck"]
ENTRYPOINT ["/app/saa-plan"]
