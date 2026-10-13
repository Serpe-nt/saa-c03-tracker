// Key points per plan step for Day 5. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {








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
