# Course diagrams and look-alikes

Two kinds of reference content, both DATA ONLY files checked by `tests/data.test.mjs`. The same fact-check rules as the key points apply (`docs/keypoints.md`): every statement must be backed by an AWS page, and the page goes into the log in `docs/verification/`.

## Course diagrams (`site/diagrams/cN.js`)

**Why they exist:** many exam questions describe an architecture in words (a VPC with public and private subnets in two Availability Zones, a load balancer in front, a database with a standby). A picture of the course's reference architecture, where each part explains itself when clicked, makes those words concrete. One diagram per lecture course (`c1`–`c8`); it shows on the cards of that course and of its labs (`lN`).

```js
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c3 = {
  title: "A three-tier web application across two Availability Zones",   // sentence case, ≤ 80 characters
  why: "…",            // purpose first: the problem this architecture solves, 80–420 characters
  w: 20, h: 12,        // canvas in grid units (1 unit = 40 px), w ≤ 24, h ≤ 16; the card shows it about 760 px wide
  areas: [             // containers, drawn back to front: Region, VPC, Availability Zone, subnet, on-premises…
    { id: "vpc", label: "VPC 10.0.0.0/16", x: 1, y: 1, w: 18, h: 10 },
    { id: "pub-a", label: "Public subnet", x: 1.5, y: 2.5, w: 8, h: 2.5, kind: "public" },   // kind: public | private | onprem | edge
    { id: "az-a", label: "Availability Zone A", x: 1.2, y: 1.8, w: 8.6, h: 9, dash: true }    // dash: a logical boundary
  ],
  nodes: [             // services: a box with a short label (≤ 28 characters; it wraps inside the box)
    { id: "alb", label: "Application Load Balancer", x: 8, y: 3, w: 4, h: 1.3 }
  ],
  links: [["users", "alb"], ["alb", "web-a", "HTTP"]],   // arrows [from, to, optional label ≤ 18 characters]
  parts: {             // what a click explains, keyed by any area or node id: at least 6
    alb: { name: "Application Load Balancer", why: "…", k: [["Label", "Text"]], trap: "…", tags: ["Load balancing"] }
  }
};
```

Rules:
- Ids: lower case, digits and `-`; unique across areas and nodes. Every id in `links` and `parts` exists.
- Everything stays inside the canvas; nodes don't overlap each other (areas may contain nodes and other areas).
- A part: `name` (≤ 40), `why` (the need it answers, 60–320 characters, shown first), `k` = up to 3 `[label, text]` points (text ≤ 220), optional `trap` (≤ 260), `tags` from `QTAGS`. Only `<b>` and `<code>` markup. Short plain sentences, purpose first, as on the cards.
- Draw what the course teaches, at exam level; don't invent numbers (prices, limits) the pages don't state.
- Preview: `node tools/diagram-preview.mjs c3 out.png` (Playwright on `NODE_PATH`) renders the diagram and its parts as the card shows them. Look at the picture.

## Look-alikes (`site/lookalikes.js`)

**Why they exist:** many misses come from services that sound alike (SQS, SNS and EventBridge; EBS, EFS and S3; ALB and NLB). A table that puts them side by side, row by row, shows the one difference the exam keys on. A miss whose right and wrong options name two services of one table links to it.

```js
window.LOOKALIKES = window.LOOKALIKES || [];
window.LOOKALIKES.push({
  id: "queue-topic-bus",                        // lower case, digits and -
  title: "SQS, SNS or EventBridge",             // ≤ 60
  why: "…",                                     // the confusion it clears up, 60–360 characters
  cols: ["SQS", "SNS", "EventBridge"],          // 2–4 services, each ≤ 24
  match: [["SQS", "Simple Queue Service"], ["SNS", "Simple Notification Service"], ["EventBridge"]],   // words that name each column's service in option text
  rows: [                                       // 3–6 rows of [label, one cell per column]; cells ≤ 220
    ["What it's for", "…", "…", "…"],           // first row
    ["Exam cue", "…", "…", "…"]                 // last row: the requirement wording that points to it
  ],
  tags: ["SQS", "SNS", "EventBridge"],          // from QTAGS
  docs: [["Title", "https://docs.aws.amazon.com/…"]]   // up to 3, on aws.amazon.com or docs.aws.amazon.com
});
```
