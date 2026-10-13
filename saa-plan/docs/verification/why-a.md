# Purpose-first rewrite, part A (2026-10-13)

Scope: `site/keys/c1.js`, `c2.js`, `c3.js`, `c4.js`, `c5.js`, `r1.js` (44 entries; `c1d` was already done) and `window.CARDS` in `site/extras.js` (31 model answers; `d2c1` was already done). Restructuring only: a `why` on every entry, labelled points, shorter sentences, and the Why / one paragraph per thing / Pick form for the model answers. Entries that were only restructured are not listed.

## New factual claims

None that needed a page. No AWS page was fetched. Every `why` and every Pick line uses only facts that the entry itself, or another entry in these same files, already states. The places where a fact was carried from one entry to another:

- `c3b` "Compute Savings Plan" is called the flexible commitment: from model answer `d11c2` ("the most flexible option").
- `c3e` "Scheduled actions" says the group changes its capacity at the times you set: from model answer `d5c2`.
- `d1c7` Pick line (steady use: Savings Plans or Reserved Instances; interruptible: Spot; short or unpredictable: On-Demand): from `c1e` "Purchasing option" and the card's own paragraphs.
- `d6c2` Pick line (match a practice to its pillar by the stated goal): from the trap of `c1b`.
- `d2c2` Why line (VPCs are isolated from each other): from `c1d` ("a logically isolated virtual network").
- `d8c3` Why line (one kind of encryption does not replace the other): from the trap of `c5e`.

## Framing sentences I am less than sure of

- `c4a` why: "A virtual machine per application solves that, but each one carries a whole operating system." Plain reasoning from the point that a container virtualizes the operating system, not the hardware. No page cited.
- `c4c` "Versioning": "Keeps what an overwrite or a delete would destroy." True for a plain delete (it adds a delete marker). Deleting a specific version still removes that version; the "Replication" point mentions version deletes.
- `r1a` why: understanding speech, text or pictures "normally means building and training a machine learning model". General statement, not from a page.
- `r1d` why: "Rewriting them is costly, so it is easier to run what they already speak." General statement.
- `d3c3` Why line: "data is usually read less often as it ages". General statement; the card itself only says lifecycle rules move objects down the classes as they age.
- `c5a` why: in one account "it is hard to tell whose costs are whose". The entry only says separate accounts split costs.
- `c4e` why: Aurora "has an answer for each size of failure: one instance, one Availability Zone, a whole Region". A summary of the entry's own points (replicas, cluster volume across three zones, global database).
- `d10c1` Why line: Global Accelerator described as carrying traffic "over the AWS network". The traffic still reaches the nearest edge location over the internet first; the paragraph below says so.

## Wording choices worth a look at merge time

- `c5c`: the point about `Encrypt` (4,096 bytes) and `GenerateDataKey` is labelled "Data keys". The usual name, envelope encryption, appears only in model answer `d8c3`; I did not add it to the entry because the entry never used the term.
- Model answers `d4c2`, `d5c3`, `d8c2`, `d8c3`, `d9c1`: API names, condition keys and paths that were plain text are now in `<code>` (`aws:RequestedRegion`, `/health`, `sts:AssumeRole`, `sts:ExternalId`, `aws:PrincipalOrgID`, `aws:SecureTransport`, `maxReceiveCount`, `.fifo`).
- Several model answers got a Pick line that the old text did not have as one sentence (`d3c1`, `d3c2`, `d4c3`, `d5c2`, `d8c3`, `d9c1`, `d9c3`, `d10c3`, `d11c1`, `d11c3`). Each is built from the paragraphs above it.

## Found elsewhere (not fixed)

- `CLAUDE.md` (saa-plan), "Layout" and "Rules": still describes key points as `{k: [...], trap, docs}` with "`k` = 1–5 takeaways". The format is now `why` plus up to 6 `[label, text]` points.
- `docs/keypoints.md`, "By step type": "Watch … 3–5 points and a trap" predates the 6-point limit.
- `site/keys/c1.js`, sample entry `c1d`, point "VPC and subnets": one semicolon ("between /16 and /28; pick one that …"), against the "no chains held together by semicolons" rule. Left as it is, because the sample was not mine to change.
