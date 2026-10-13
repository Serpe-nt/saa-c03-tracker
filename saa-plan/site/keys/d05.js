// Key points for the plan steps whose id starts with d5 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {








  d5c1: {
    why: "An application that runs on several servers needs one entry point that spreads the traffic over them. A load balancer is that entry point, and the three types answer different needs. An Application Load Balancer routes HTTP requests by their content. A Network Load Balancer passes connections through and can have fixed IP addresses. A Gateway Load Balancer distributes traffic to appliances.",
    k: [
      ["Cross-zone load balancing", "On for an ALB (a target group can turn it off), off by default for a Network or Gateway Load Balancer. With it off, each zone's node shares traffic among local targets only. A target in a zone with fewer targets then gets more."],
      ["Client IP address", "An ALB sits between client and server, so the server sees the load balancer's address. It reads the client's address from the <code>X-Forwarded-For</code> header. An NLB can preserve the client's source IP, or pass it in a proxy protocol v2 header."],
      ["Where TLS ends", "An HTTPS listener on an ALB or a TLS listener on an NLB decrypts on the load balancer. An NLB TCP listener on port 443 instead passes the encrypted stream through untouched. Then the targets hold the keys and do the decryption."],
      ["Fixed IPs plus layer 7 routing", "When both are required, put an NLB with static (Elastic) IP addresses in front. Register the ALB as its target, using an ALB-type target group."],
      ["Internet-facing or internal", "An Application or Network Load Balancer is created as one or the other. The nodes of an internal one have only private IP addresses. That is how you balance an application tier that must not be reachable from the internet."]
    ],
    trap: "The stem often describes a web application and then adds one requirement only an NLB meets. Examples: fixed IP addresses for an allowlist, UDP, or TLS that must not be decrypted on the load balancer. Path, host and header routing, redirects and Lambda targets are ALB-only.",
    docs: [
      ["Elastic Load Balancing features", "https://aws.amazon.com/elasticloadbalancing/features/"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["Use an Application Load Balancer as a target of a Network Load Balancer", "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/application-load-balancer-target.html"]
    ]
  },

  d5c2: {
    why: "Load changes, and a fixed number of servers is either too few at the peak or paid for while idle. Auto Scaling changes the number for you. The policies differ in what triggers the change: a metric, the clock, or a forecast from past load. The pattern of the load in the stem picks the policy.",
    k: [
      ["Backlog per instance", "For workers that drain a queue. Divide the visible SQS messages by the number of InService instances. Track that against the backlog one instance can clear in the acceptable time. Queue length alone is not proportional to group size."]
    ],
    trap: "Simple scaling waits out a cooldown after each adjustment. Step scaling and target tracking can scale out again at once. Predictive scaling needs a repeating daily or weekly history, so a one-off event at a known time is scheduled scaling.",
    docs: [
      ["Step and simple scaling policies for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"],
      ["Predictive scaling for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html"],
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"]
    ]
  },

  d5c3: {
    why: "An Auto Scaling group replaces instances it considers unhealthy, so everything depends on what counts as unhealthy. The EC2 check asks whether the instance is running and free of hardware or software problems. The load balancer's check asks whether the instance is available to handle requests. An instance can be running and still not answer, and only the second check sees that.",
    k: [
      ["A stopped instance", "Counts as unhealthy. The group at once replaces any instance that is not in the running state, even inside the grace period. Put an instance in Standby first if you need to stop or reboot it."]
    ],
    trap: "Three settings sound alike. The health check grace period delays health-based replacement of a new instance. Default instance warmup keeps its metrics out of scaling decisions. Cooldown is the pause after a scaling activity before simple scaling can act again.",
    docs: [
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"],
      ["Set the health check grace period for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html"],
      ["Set the default instance warmup for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html"]
    ]
  }
});
