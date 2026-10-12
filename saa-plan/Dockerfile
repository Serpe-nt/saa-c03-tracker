# Static site served by nginx running as a non-root user (listens on 8080).
FROM nginxinc/nginx-unprivileged:stable-alpine

COPY site/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
