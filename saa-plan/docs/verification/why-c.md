# Purpose-first rewrite, session C: `keys/d06.js` – `keys/d14.js`

2026-10-13. 65 entries restructured: each gained a `why`, each `k` became labelled points, long trap sentences were split. No `docs` link or title changed. Facts were not looked up again; only what is listed below is new.

## New factual claims

| Entry | Claim (in `why`) | Page |
|---|---|---|
| `d6c2` | The framework has a pillar each for operational excellence, security, reliability, performance efficiency, cost optimization and sustainability. Only the six names were read on the page; the plain word for each concern ("hard to run", "fragile", "wasteful of resources"…) is my paraphrase of the name. | https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html |
| `d8c2` | A role's trust policy designates who can assume the role; the external ID is checked in that trust policy. | https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html |
| `d9c1` | "Unlike standard queues, FIFO queues don't introduce duplicate messages." | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html |
| `d9c1` | A dead-letter queue is for "messages that fail multiple processing attempts". | https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html |
| `d9c3` | Weighted: proportions that you specify. Latency: the Region that provides the best latency. Geolocation: the location of your users. Failover: active-passive failover. | https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html |
| `d9c2`, `d9e3` | The abbreviations stand for Recovery Time Objective (RTO) and Recovery Point Objective (RPO). The page gives the names only; that RTO limits downtime and RPO limits data loss is the standard meaning of the names, not a sentence I read there. | https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html |

`d9c1` used two pages (both already cited by the entry), one more than the limit of one page per entry. Five pages were fetched in total, each one already in an entry's `docs`.

Every other `why` restates facts that are already in the entry's own `k` or `trap`, in a neighbouring entry of these files, or in the step text in plan.js.

## Framing sentences I am less than sure of

- `d9c1`: "handled twice or out of order". The duplicate half is sourced above; that a FIFO queue keeps order rests on the queue type's name, not on a sentence I fetched.
- `d6c2`: "wasteful of resources" as the plain word for the sustainability pillar.
- `d8b1`: "A NAT gateway and a bastion host answer that with extra cost and an open port." Rests on `d2b5` (NAT gateway hourly and per-GB charge) and `d2b3` (a bastion keeps port 22 open) in `d02.js`.
- `d10c1`: Global Accelerator "carries traffic that cannot be cached". Paraphrase of the trap ("UDP or other non-HTTP traffic", "caches nothing").
- `d11c2`: Spot as capacity that "can be taken back". Paraphrase of "can be interrupted" in `d11e1` and `d11e3`.
- `d10e5`: "a link over the public internet behaves differently from hour to hour". Plain reasoning; the entry's own fact is that Direct Connect gives "a more consistent network experience".
- `d7h3`, `d11b1`: "the date you want may be gone". No source; plain reasoning.
- Study-technique framing with no AWS source by nature: recognising against recalling (`d8e6`, `d10e8`), facts fading (`d13e1`), "often one you have only read about" (`d12e3`), cramming on exam morning (`d14e1`), the badge and a job search (`d14e3`).

## Sentences added to points

- `d8e6` "Answer aloud first": "Only then do you know whether you could recall it." (reason, not an AWS fact)
- `d7h2` "Stopped EC2 instance": "Stopping does not end the cost." (restates the sentence after it)
- `d10e2` "S3 Express One Zone": "For S3 data that must be read very fast." (lead-in to the entry's own figure)

## Facts left out of a domain-review entry

None. Thirteen entries are at the six-point limit (`d8e2`–`d8e4`, `d9e2`, `d10e2`–`d10e6`, `d11e2`–`d11e5`). To stay inside it, these points still hold two ideas each:

- `d8e3` "Managed security services": Firewall Manager, and GuardDuty, Macie, Inspector
- `d9e2` "Lambda concurrency, API limits"
- `d10e2` "io2, st1, sc1, instance store"
- `d11e2` "EBS cost": gp3 against gp2, and detached volumes with Data Lifecycle Manager
- `d11e4` "Steady or idle-heavy"
- `d11e5` "Connecting many VPCs" (peering, Transit Gateway, shared interface endpoints) and "CloudFront and Requester Pays"

## Not done

- RPO and RTO are spelled out in the `why` of `d9e3` and `d9c2` only. `d9e4` uses the abbreviations bare.
- Sentences of 23 to 26 words remain where splitting would have broken a list of examples.

## Found elsewhere (not fixed)

- `saa-plan/CLAUDE.md`, "Layout" and "Rules": still describe the old entry shape (`{k: [...], trap, docs}`, "k = 1–5 takeaways"). The format is now `why` first and up to six `[label, text]` points.
- The header comment of each `keys/dNN.js` says "for Day N". Since the 21-day plan the number is only the id prefix: `d8…` to `d11…` steps sit on Days 17 to 20, and `d6c…` self-checks on other days.
