// Key points per plan step for Day 5. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d5p1: {
    k: [
      "Auto-healing is the group holding its desired capacity: when an instance is terminated or fails a health check, the group launches a replacement. Scaling policies only move desired capacity between the minimum and the maximum.",
      "A launch lifecycle hook holds an instance in <code>Pending:Wait</code>, before it enters service, until <code>complete-lifecycle-action</code> is called or the hook times out. A termination hook holds it in <code>Terminating:Wait</code> so logs can be saved.",
      "Scale-in protection stops the group from choosing an instance during scale-in, but the instance is still replaced if it fails health checks. Standby takes it out of the load balancer and out of health checks until you return it to service.",
      "When an Availability Zone recovers, the group rebalances on its own. It launches instances in the emptier zone first and only then terminates the extras, so capacity is not reduced during the move.",
      "Slow boot has two fixes: bake the software into a custom AMI instead of installing it in user data, and keep a warm pool of pre-initialized instances, which in the Stopped state cost only their EBS volumes and any Elastic IPs."
    ],
    trap: "A termination lifecycle hook only delays the instance the group already picked; it does not make the group pick an idle one. To spare busy workers during scale-in, each worker turns on scale-in protection for itself while it has a job.",
    docs: [
      ["Amazon EC2 Auto Scaling lifecycle hooks", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html"],
      ["Design your applications to gracefully handle instance termination", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/gracefully-handle-instance-termination.html"],
      ["Decrease latency for applications with long boot times using warm pools", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html"]
    ]
  },

  d5p2: {
    k: [
      "The pattern to recognise: a load balancer with subnets in at least two Availability Zones, in front of an Auto Scaling group that spans the same zones with a minimum of two instances. It survives the loss of an instance or of a whole zone.",
      "An ALB routes only to targets in zones enabled on the load balancer itself. If the group launches into a third zone where the ALB has no subnet, those targets show as <code>unused</code> and get no requests until you add that zone's subnet to the ALB.",
      "Instances must be disposable. Sticky sessions pin a user to one target with a cookie and need no code change, but the session dies with the instance. The durable design keeps sessions in ElastiCache or DynamoDB and files in S3.",
      "Look for the last single point of failure outside the web tier. A zonal NAT gateway serves from one zone, so use one per zone with zone-local routes. A Single-AZ RDS instance needs Multi-AZ, which keeps a synchronous standby in another zone.",
      "Route 53 failover records give active-passive DNS failover. Its health checkers sit outside your VPC, so a private endpoint is covered by a health check that watches a CloudWatch alarm, for example on the target group's <code>HealthyHostCount</code>."
    ],
    trap: "Sticky sessions are a stopgap, not high availability. If the stem says any instance may be terminated without users noticing, the answer moves state out of the instance. And one zonal component (NAT gateway, database) undoes a multi-AZ web tier.",
    docs: [
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["NAT gateway basics", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html"],
      ["Configuring failover in a private hosted zone", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-private-hosted-zones.html"]
    ]
  },

  d5b1: {
    k: [
      "Two zones are not optional here: an Application Load Balancer must be given subnets in at least two Availability Zones. The nodes of an internet-facing load balancer have public IP addresses, so its VPC needs an internet gateway.",
      "The load balancer reaches targets on their private IP addresses, so in production the instances sit in private subnets. In this lab they are in public subnets only because a NAT gateway is charged for every hour it exists.",
      "With no NAT gateway, an instance reaches the internet only through the internet gateway, and for that it needs its own public IPv4 address. Check the subnet's auto-assign public IPv4 setting or enable a public IP in the launch template."
    ],
    docs: [
      ["Application Load Balancers", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["Enable internet access for a VPC using an internet gateway", "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html"]
    ]
  },

  d5b2: {
    k: [
      "Launch templates are versioned, so a bad change is a rollback to the previous version. Launch configurations cannot be edited, cannot mix instance types or Spot with On-Demand, and cannot be created at all in accounts opened on or after October 1, 2024.",
      "User data runs as root and, by default, only on the first boot. Every instance the group launches repeats the whole script, so a long install delays each scale-out. A custom AMI with the software baked in removes that wait.",
      "Changing the template does not touch instances that are already running. New launches use it, and an instance refresh replaces the old ones in batches while keeping a minimum healthy percentage."
    ],
    trap: "'Roll out a patched AMI' in an Auto Scaling group is answered by a new launch template version plus an instance refresh. Rebooting instances does not change their AMI, and a launch configuration cannot be edited.",
    docs: [
      ["Auto Scaling launch templates", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html"],
      ["Use an instance refresh to update instances in an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-instance-refresh.html"],
      ["Run commands when you launch an EC2 instance with user data input", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html"]
    ]
  },

  d5b3: {
    k: [
      "An ALB listener evaluates its rules in priority order. Conditions match host, path, HTTP header, method, query string or source IP; actions forward, redirect, return a fixed response or authenticate. That is how one ALB serves many services.",
      "One HTTPS listener can hold several certificates and picks the right one with SNI, so two domains do not need two load balancers. A redirect action on the HTTP listener sends visitors to HTTPS without touching the servers.",
      "The target group health check decides where traffic goes. A check on <code>/</code> can return 200 while the application is broken, so point it at a path that tests what the application depends on, such as its database connection.",
      "A forward action can split traffic across target groups by weight. That gives blue/green and canary releases that you reverse at once by changing the weights, with no DNS TTL to wait for. Slow start instead ramps a new target up linearly.",
      "Allow the application port on the instances only from the ALB's security group. A rule that names a security group as its source applies to everything in that group, whatever addresses the load balancer nodes use."
    ],
    trap: "A target group with no registered targets returns HTTP 503. A target group where every target is unhealthy fails open: the ALB sends requests to all of them anyway. Cross-zone settings and stickiness fix neither.",
    docs: [
      ["Listeners for your Application Load Balancers", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html"],
      ["Action types for listener rules", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/rule-action-types.html"],
      ["Health checks for Application Load Balancer target groups", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html"]
    ]
  },

  d5b4: {
    k: [
      "You attach the target group, not the load balancer, to the group. From then on instances are registered and deregistered automatically. Acting on the load balancer's health verdict is a separate switch: turn on Elastic Load Balancing health checks.",
      "The group always works back to its desired capacity, and policies move desired only between minimum and maximum. To shrink a group for good, lower desired (and minimum if it is in the way); terminating an instance just triggers a replacement.",
      "Target tracking needs a metric that moves in proportion to the load on each instance. Average CPU fits CPU-bound work; <code>ALBRequestCountPerTarget</code> fits request-driven or I/O-bound work where CPU stays low. AWS creates the alarms for you.",
      "On scale-in the target is deregistered first and the load balancer waits for the deregistration delay (300 seconds by default) so that requests in flight can finish. Set it above your longest request, or long downloads are cut off.",
      "A mixed instances policy can keep an On-Demand base and fill the rest with Spot across several instance types, all in one group. It requires a launch template."
    ],
    trap: "With ELB health checks on, a health check grace period shorter than the application's startup makes the group terminate and relaunch new instances in a loop. The grace period must cover the whole startup time.",
    docs: [
      ["Attach an Elastic Load Balancing load balancer to your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html"],
      ["Target tracking scaling policies for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html"],
      ["Set the health check grace period for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html"]
    ]
  },

  d5b5: {
    k: [
      "Clients use the ALB's DNS name, which resolves to the addresses of its nodes. Reloading the page and seeing different instance IDs is the ALB spreading requests across healthy targets in both zones.",
      "Terminating an instance starts two independent reactions. The ALB stops routing to the missing target, and the group sees that the instance is no longer running and launches a replacement straight away to restore desired capacity.",
      "By default this self-healing relies on EC2 health checks only. An instance that still runs but whose application has hung passes them, so to have it replaced, turn on Elastic Load Balancing health checks for the group."
    ],
    docs: [
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"]
    ]
  },

  d5b6: {
    k: [
      "Order matters. Delete the Auto Scaling group first: that sets its capacity to 0 and terminates the instances. Terminating instances by hand while the group exists only makes it launch new ones.",
      "An Application Load Balancer is billed for every hour or partial hour it exists, traffic or not, and the charge stops when you delete it. A target group can be deleted only once no listener rule forwards to it."
    ],
    docs: [
      ["Delete your Auto Scaling infrastructure", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-process-shutdown.html"],
      ["Delete an Application Load Balancer", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-delete.html"],
      ["Delete an Application Load Balancer target group", "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/delete-target-group.html"]
    ]
  },

  d5c1: {
    k: [
      "Cross-zone load balancing is on for an ALB (a target group can turn it off) but off by default for a Network or Gateway Load Balancer. With it off, each zone's node shares traffic among local targets only, so a target in a zone with fewer targets gets more.",
      "An ALB sits between client and server, so the server sees the load balancer's address and reads the client's from the <code>X-Forwarded-For</code> header. An NLB can preserve the client's source IP, or pass it in a proxy protocol v2 header.",
      "An HTTPS listener on an ALB or a TLS listener on an NLB decrypts on the load balancer. An NLB TCP listener on port 443 instead passes the encrypted stream through untouched, so the targets hold the keys and do the decryption.",
      "When fixed IP addresses and layer 7 routing are both required, put an NLB with static (Elastic) IP addresses in front and register the ALB as its target, using an ALB-type target group.",
      "An Application or Network Load Balancer is created as internet-facing or internal. The nodes of an internal one have only private IP addresses, which is how you balance an application tier that must not be reachable from the internet."
    ],
    trap: "The stem often describes a web application and then adds one requirement only an NLB meets: fixed IP addresses for an allowlist, UDP, or TLS that must not be decrypted on the load balancer. Path, host and header routing, redirects and Lambda targets are ALB-only.",
    docs: [
      ["Elastic Load Balancing features", "https://aws.amazon.com/elasticloadbalancing/features/"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["Use an Application Load Balancer as a target of a Network Load Balancer", "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/application-load-balancer-target.html"]
    ]
  },

  d5c2: {
    k: [
      "For workers that drain a queue, scale on backlog per instance: visible SQS messages divided by the number of InService instances, tracked against the backlog one instance can clear in the acceptable time. Queue length alone is not proportional to group size."
    ],
    trap: "Simple scaling waits out a cooldown after each adjustment; step scaling and target tracking can scale out again at once. Predictive scaling needs a repeating daily or weekly history, so a one-off event at a known time is scheduled scaling.",
    docs: [
      ["Step and simple scaling policies for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"],
      ["Predictive scaling for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html"],
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"]
    ]
  },

  d5c3: {
    k: [
      "A stopped instance counts as unhealthy: the group at once replaces any instance that is not in the running state, even inside the grace period. Put an instance in Standby first if you need to stop or reboot it."
    ],
    trap: "Three settings sound alike. The health check grace period delays health-based replacement of a new instance. Default instance warmup keeps its metrics out of scaling decisions. Cooldown is the pause after a scaling activity before simple scaling can act again.",
    docs: [
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"],
      ["Set the health check grace period for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html"],
      ["Set the default instance warmup for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html"]
    ]
  }
});
