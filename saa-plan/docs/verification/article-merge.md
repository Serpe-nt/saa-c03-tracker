# The article rewrite: fixes at the merge (2026-10-17)

The three rewrite sessions (`article-a.md`, `article-b.md`, `article-c.md`) each checked their own files. Merged, four things needed the whole set.

## Card questions too close to another group's

`node tools/similar.mjs 0.30` paired three card questions across groups, which no single session could see. The later card's question was rewritten, from an angle only that card teaches:

- `d5c1` (0.60 with `c3f`, both "an internal load balancer for the app tier"): now fixed IP addresses for a partner's allowlist together with path routing, so an NLB with Elastic IPs in front of the ALB. Every option's explanation rests on the card's own point "Fixed IPs and layer 7 routing", its trap ("fixed IP addresses for an allowlist … Path, host and header routing … are ALB-only") and its idea (a Gateway Load Balancer sends traffic through security appliances).
- `d4c2` (0.31 with `c5a`, both "the management account isn't restricted"): now an SCP that allows `s3:*` and a user with no IAM policy, so nothing. Rests on the card's idea ("It only limits and never grants") and trap ("An Allow in an SCP gives nobody access: the principal still needs an IAM Allow, so the result is the overlap of both"), and `c2b`'s implicit deny.
- `d13l2` (0.32 with `t1b`, both "a stopped instance still pays for its volumes and Elastic IP"): now deleting a practice KMS key. Rests on the card's point "KMS key deletion" and on https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html: "AWS KMS requires you to set a waiting period of 7 – 30 days" and "After a KMS key is deleted, you can no longer decrypt the data that was encrypted under that KMS key, which means that data becomes unrecoverable."

After the rewrite no card question pairs with any question at 0.30.

## Questions with no exam topic

Card questions about exam technique, study habits, the plan or the exam's logistics carry no `tags` and no `dom` (the rule is in `questions.md`), so a miss gives no false weakness in an exam topic or domain: `d7e1`, `d7e3`, `d7e6`, `d7h3`, `d8e6`, `d8s1`, `d11b1`, `d11p1`, `d11p2`, `d12e2`, `d12e4`, `d13e2`, `d13e4`, `d13l1`, `d13l3`, `d14e1`, `d14e2`, `d14e3`, `s0a`, `s0b`, `d1e3`. Questions on AWS's own billing (budgets, credits, Support plans, a stopped RDS database starting again) keep their topic: those are exam material.

## The reading block

`r1a`–`r1d` and the Identity Center reading (`d1c1`–`d1c5`) sit in Watch groups labelled "Read: …", so their cards now say "To read:" over the step text instead of "In this lecture:".

## Day 4's role

`d2b2` creates a role (for example `lab-ssm`) that the cleanup `d2b5` did not delete. `d2b5`'s `do` now ends with deleting it, after the instance is terminated. From https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_manage_delete.html: "choose Roles, and then select the check box next to the role name that you want to delete. At the top of the page, choose Delete … enter the name of the role in the text input field and choose Delete"; "If you use the AWS Management Console to delete a role, IAM … automatically deletes … any Amazon EC2 instance profile that contains the role"; and the warning not to delete a role that a running instance uses.
