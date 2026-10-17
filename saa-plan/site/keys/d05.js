// Key points for the plan steps whose id starts with d5 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d5c1: {
    head: "Application, Network or Gateway Load Balancer",
    why: "A partner will let only two fixed IP addresses through its firewall, and your load balancer can't promise any. Another team must send every packet through a third-party firewall first. Spreading traffic means different things at different layers, and each load balancer type answers one need.",
    idea: "An Application Load Balancer routes HTTP requests by their content. A Network Load Balancer passes connections through at high speed and can have fixed IP addresses. A Gateway Load Balancer sends traffic through security appliances.",
    k: [
      ["Where TLS ends", "An HTTPS listener on an ALB or a TLS listener on an NLB decrypts on the load balancer. An NLB TCP listener on port 443 instead passes the encrypted stream through untouched, and the targets hold the keys."],
      ["Seeing the client's address", "An ALB sits between client and server, so the server sees the load balancer's address and reads the client's from the <code>X-Forwarded-For</code> header. An NLB can preserve the client's source IP, or pass it in a proxy protocol v2 header."],
      ["Fixed IPs and layer 7 routing", "When both are required, put an NLB with static (Elastic) IP addresses in front. Register the ALB as its target, using an ALB-type target group."],
      ["Cross-zone load balancing", "On for an ALB (a target group can turn it off), off by default for a Network or Gateway Load Balancer. With it off, each zone's node shares traffic among its local targets only."],
      ["Internet-facing or internal", "An Application or Network Load Balancer is created as one or the other. An internal one's nodes have only private IP addresses: that is how you balance a tier that must not be reachable from the internet."]
    ],
    trap: "The stem often describes a web application and then adds one requirement only an NLB meets. Examples: fixed IP addresses for an allowlist, UDP, or TLS that must not be decrypted on the load balancer. Path, host and header routing, redirects and Lambda targets are ALB-only.",
    q: {
      q: "In a three-tier app, the web servers call the application servers through a load balancer. The application tier must never be reachable from the internet. What should balance it?",
      o: [
        "An internal Application Load Balancer, whose nodes have only private IP addresses",
        "An internet-facing Application Load Balancer with a security group that allows only the web servers",
        "A Gateway Load Balancer in front of the application servers",
        "An internet-facing Network Load Balancer with Elastic IP addresses"
      ],
      a: [0],
      x: [
        "Right. A load balancer is created internet-facing or internal. An internal one has only private addresses, so the tier can't be reached from the internet at all.",
        "A security group narrows who gets through, but an internet-facing load balancer still has public addresses. An internal one has none.",
        "A Gateway Load Balancer sends traffic through security appliances. It isn't the way to balance an application tier.",
        "Elastic IP addresses make the load balancer reachable at fixed public addresses, the opposite of what the tier needs."
      ],
      dom: 3, tags: ["Load balancing"], doc: "elb"
    },
    docs: [
      ["Elastic Load Balancing features", "https://aws.amazon.com/elasticloadbalancing/features/"],
      ["How Elastic Load Balancing works", "https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html"],
      ["Use an Application Load Balancer as a target of a Network Load Balancer", "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/application-load-balancer-target.html"]
    ]
  },

  d5c2: {
    head: "Which scaling policy: target tracking, step, scheduled or predictive",
    why: "A shop scales on CPU and still struggles every Monday at nine, because the new servers arrive minutes after the rush has begun. A fixed rule doesn't fit every kind of load. The pattern of the load must pick the rule for adding and removing servers.",
    idea: "Target tracking holds a metric at a target value. Step scaling reacts by the size of a breach. Scheduled scaling acts at set times. Predictive scaling forecasts a repeating pattern and launches capacity before it arrives.",
    k: [
      ["Backlog per instance", "For workers that drain a queue. Divide the visible SQS messages by the number of InService instances, and track that against the backlog one instance can clear in the acceptable time. Queue length alone is not proportional to group size."]
    ],
    trap: "Simple scaling waits out a cooldown after each adjustment. Step scaling and target tracking can scale out again at once. Predictive scaling needs a repeating daily or weekly history, so a one-off event at a known time is scheduled scaling.",
    q: {
      q: "Every Monday at about nine, a booking site's load jumps, and new instances started by target tracking arrive only after the rush has begun. The pattern has repeated for months. What should the team add?",
      o: [
        "Predictive scaling, which forecasts the weekly pattern and launches capacity before it arrives",
        "Simple scaling with a longer cooldown",
        "A scheduled action for one specific Monday",
        "Step scaling with larger steps at higher CPU"
      ],
      a: [0],
      x: [
        "Right. Predictive scaling uses the repeating daily or weekly history to launch capacity ahead of demand. Paired with target tracking, it still handles the unexpected.",
        "A cooldown makes simple scaling wait after each change, so it reacts later, not sooner.",
        "A scheduled action fits a one-off event at a known time. This rush repeats every week, which is what predictive scaling learns from.",
        "Bigger steps still react to a breach that has already happened, after the rush has begun."
      ],
      dom: 3, tags: ["Auto Scaling", "SQS"], doc: "autoscaling"
    },
    docs: [
      ["Step and simple scaling policies for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html"],
      ["Predictive scaling for Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-predictive-scaling.html"],
      ["Scaling policy based on Amazon SQS", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html"]
    ]
  },

  d5c3: {
    head: "EC2 or ELB health checks in an Auto Scaling group",
    why: "The web app on one instance crashes. The instance keeps running, the load balancer stops sending it requests, and the Auto Scaling group never replaces it. What the group counts as unhealthy decides what it replaces.",
    idea: "EC2 health checks ask whether the instance is running and free of hardware or software problems. ELB health checks ask whether it is available to handle requests. Only the second one sees an application that has stopped answering.",
    k: [
      ["A stopped instance counts as unhealthy", "The group at once replaces any instance that is not in the running state, even inside the grace period. Put an instance in Standby first if you need to stop or reboot it."]
    ],
    trap: "Three settings sound alike. The health check grace period delays health-based replacement of a new instance. Default instance warmup keeps its metrics out of scaling decisions. Cooldown is the pause after a scaling activity before simple scaling can act again.",
    q: {
      q: "You stop an instance in an Auto Scaling group to change a setting, and within minutes the group terminates it and launches a new one. How do you avoid that next time?",
      o: [
        "Put the instance in Standby first, then stop it",
        "Lengthen the health check grace period before stopping it",
        "Turn on ELB health checks for the group",
        "Raise the group's cooldown period"
      ],
      a: [0],
      x: [
        "Right. The group replaces any instance that is not running. Standby takes the instance out of that while you work on it.",
        "The grace period doesn't protect a stopped instance: it is replaced even inside the grace period.",
        "ELB health checks add a second reason to replace instances. They don't spare a stopped one.",
        "Cooldown pauses simple scaling after an activity. It doesn't stop health-based replacement."
      ],
      dom: 2, tags: ["Auto Scaling"], doc: "autoscaling"
    },
    docs: [
      ["About the health checks for your Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html"],
      ["Set the health check grace period for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html"],
      ["Set the default instance warmup for an Auto Scaling group", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html"]
    ]
  }
});
