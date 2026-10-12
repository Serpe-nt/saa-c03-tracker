# SAA-C03 two-week plan

Static tracker page (HTML/CSS/JS, no dependencies) served by nginx in Docker.

```
site/
  index.html   page layout, dialogs
  style.css    styles (light/dark)
  plan.js      the plan: days, steps, links, time estimates, glossary, cleanup list
  fx.js        confetti, fireworks, sounds
  app.js       logic: ticks, today mode, next up, scores, notes, timer, settings
Dockerfile
compose.yaml
```

## Run

```
docker compose up -d --build
```

Open http://localhost:8080

## Keep it up after reboots

`restart: unless-stopped` restarts the container whenever the Docker daemon starts, so the daemon itself must start at boot:

```
sudo systemctl enable --now docker
```

## Update after editing files

```
docker compose up -d --build
```

## Where progress is stored

In your browser's localStorage for `http://localhost:8080`. Rebuilding or removing the container does not touch it. A different browser, or a different port/host, starts empty — use ⚙ Settings → Export / Import to move or back up progress.
