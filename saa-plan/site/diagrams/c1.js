// DATA ONLY: the diagram for lecture course 1 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c1 = {
  title: "A highly available web application in one Region",
  why: "A server in one data center stops when that data center fails, and users far away wait longer for every answer. This picture puts the course's building blocks together: a Region with two Availability Zones, a VPC cut into public and private subnets, a load balancer in front of servers in both zones, a database with a standby, and CloudFront serving files from S3.",
  w: 20, h: 12.4,
  areas: [
    { id: "edge", label: "Edge location", x: 14.6, y: 0.1, w: 5.2, h: 1.85, kind: "edge" },
    { id: "region", label: "Region", x: 0.2, y: 2.1, w: 19.6, h: 10.1 },
    { id: "vpc", label: "VPC 10.0.0.0/16", x: 0.5, y: 2.8, w: 13.9, h: 9.2 },
    { id: "az-a", label: "Availability Zone A", x: 0.75, y: 3.55, w: 6.3, h: 8.2, dash: true },
    { id: "az-b", label: "Availability Zone B", x: 7.85, y: 3.55, w: 6.3, h: 8.2, dash: true },
    { id: "pub-a", label: "Public subnet", x: 0.95, y: 4.15, w: 5.9, h: 2.3, kind: "public" },
    { id: "pub-b", label: "Public subnet", x: 8.05, y: 4.15, w: 5.9, h: 2.3, kind: "public" },
    { id: "priv-a", label: "Private subnet", x: 0.95, y: 6.85, w: 5.9, h: 4.6, kind: "private" },
    { id: "priv-b", label: "Private subnet", x: 8.05, y: 6.85, w: 5.9, h: 4.6, kind: "private" }
  ],
  nodes: [
    { id: "users", label: "Users", x: 6.15, y: 0.25, w: 2.6, h: 0.95 },
    { id: "cf", label: "CloudFront", x: 15.0, y: 0.7, w: 4.4, h: 1.0 },
    { id: "s3", label: "S3 bucket", x: 15.0, y: 3.2, w: 4.4, h: 1.1 },
    { id: "igw", label: "Internet gateway", x: 5.85, y: 2.35, w: 3.2, h: 0.95 },
    { id: "nat-a", label: "NAT gateway", x: 1.2, y: 5.05, w: 2.8, h: 1.0 },
    { id: "elb", label: "Load balancer", x: 4.75, y: 5.05, w: 5.4, h: 1.0 },
    { id: "nat-b", label: "NAT gateway", x: 10.9, y: 5.05, w: 2.8, h: 1.0 },
    { id: "ec2-a", label: "EC2 instance", x: 3.6, y: 7.15, w: 3.0, h: 1.1 },
    { id: "ec2-b", label: "EC2 instance", x: 10.75, y: 7.15, w: 3.0, h: 1.1 },
    { id: "rds-a", label: "RDS primary", x: 3.6, y: 9.9, w: 3.0, h: 1.1 },
    { id: "rds-b", label: "RDS standby", x: 10.75, y: 9.9, w: 3.0, h: 1.1 }
  ],
  links: [
    ["users", "cf", "static files"],
    ["cf", "s3", "origin"],
    ["users", "igw"],
    ["igw", "elb"],
    ["elb", "ec2-a"],
    ["elb", "ec2-b"],
    ["ec2-a", "nat-a"],
    ["ec2-a", "rds-a"],
    ["ec2-b", "rds-a"],
    ["rds-a", "rds-b", "sync copy"]
  ],
  parts: {
    region: {
      name: "Region",
      why: "Users far away wait longer, and some data must stay in one country. You choose the Region your resources run in, so you pick it by where your users are and by the rules the data must follow.",
      k: [
        ["Isolated", "Regions are isolated from each other. AWS does not replicate your resources across Regions automatically."],
        ["Zones inside it", "Every Region has at least three Availability Zones. They are physically separate but within 100 km of each other."],
        ["Region-specific", "An AMI is Region-specific, so you copy it to another Region before launching there."]
      ],
      trap: "Two zones survive the loss of a zone, not of the whole Region. AWS copies nothing to another Region for you, so a second Region takes replication that you set up.",
      tags: ["Regions & AZs"]
    },
    "az-a": {
      name: "Availability Zone",
      why: "One data center can lose power or flood. An Availability Zone is one or more discrete data centers with redundant power, networking and connectivity. Running copies in two zones removes that single point of failure.",
      k: [
        ["A subnet picks the zone", "Each subnet sits entirely in one zone. You place a resource in a zone by placing it in a subnet, so two zones need at least two subnets."],
        ["Size for losing a zone", "The remaining zones must carry the whole load. Needing 4 instances means 4 in each of two zones, or 2 in each of three zones."],
        ["Close enough to sync", "The zones of a Region are linked well enough for synchronous replication. That is how the database standby in zone B keeps up."]
      ],
      trap: "A larger instance type or a cluster placement group stays inside one zone, and snapshots only help you rebuild afterwards. Only instances already running in a second zone keep serving.",
      tags: ["Regions & AZs", "High availability design"]
    },
    cf: {
      name: "CloudFront at an edge location",
      why: "Users far from the Region wait for every file to travel the whole way. Edge locations are a separate network for content delivery, and CloudFront serves each request from the edge location with the lowest latency.",
      k: [
        ["Origin", "CloudFront fetches from the origin, such as an S3 bucket, only when the content is not already at the edge location."],
        ["HTTPS", "An S3 website endpoint does not support HTTPS. CloudFront in front of the bucket gives the site HTTPS. AWS recommends Amplify Hosting first."],
        ["Certificate", "An ACM certificate for CloudFront must be requested in us-east-1."]
      ],
      trap: "An edge location delivers content. To run instances closer to users than a Region, the choices are a Local Zone, AWS Outposts or a Wavelength Zone.",
      tags: ["CloudFront", "Regions & AZs"]
    },
    s3: {
      name: "S3 bucket",
      why: "Files such as images and pages do not need a server that you patch and keep running. Amazon S3 stores them as objects and can serve a static website by itself.",
      k: [
        ["Durability", "S3 Standard stores each object redundantly across at least three zones. It is designed for 99.999999999% durability and 99.99% availability."],
        ["Website endpoint", "It serves static content, client-side scripts included, and supports only GET and HEAD requests. A form that saves data needs a backend of its own."],
        ["Public access", "A public website needs hosting enabled with an index document, Block Public Access turned off, and a bucket policy that grants public read access."]
      ],
      trap: "Making a bucket public is the customer's decision. If data leaks from it, that is the customer's side of the shared responsibility model.",
      tags: ["S3 features"]
    },
    vpc: {
      name: "VPC",
      why: "Some servers must be reachable from the internet and others must never be. A VPC is a logically isolated virtual network that you define yourself. Its subnets, route tables and firewalls draw those lines.",
      k: [
        ["Address range", "The IPv4 range is between /16 and /28. Pick one that overlaps no VPC you will peer with, because overlapping VPCs cannot be peered."],
        ["Plan it first", "The size of an existing CIDR block cannot be changed. You can only associate additional blocks."],
        ["Spans the zones", "A VPC can span the Availability Zones of its Region. Each subnet sits entirely in one zone."]
      ],
      trap: "AWS reserves the first four addresses and the last one in every subnet. A /24 therefore leaves 251 addresses for your resources and a /28 leaves 11.",
      tags: ["VPC & subnets"]
    },
    "pub-a": {
      name: "Public subnet",
      why: "Only a few parts, such as the load balancer, should face the internet. A subnet is public when its route table has a route to an internet gateway. That route is what lets traffic in and out.",
      k: [
        ["Internet gateway", "Connects the VPC to the internet. It is horizontally scaled, redundant and highly available, so it needs no standby."],
        ["Reaching an instance", "An instance also needs a public IPv4 address, and security group and network ACL rules that allow the traffic."],
        ["What goes here", "The load balancer and the NAT gateways. Servers go in private subnets."]
      ],
      trap: "A subnet is not public because of its name or because its instances have public IP addresses. Without a route to an internet gateway they cannot communicate with the internet.",
      tags: ["VPC & subnets", "Internet & NAT gateways"]
    },
    "priv-a": {
      name: "Private subnet",
      why: "Servers and databases should not be reachable from the internet. A private subnet has no route to the internet gateway. Inside the VPC, two firewalls then decide what may reach each instance.",
      k: [
        ["Security group", "The firewall of an instance. Stateful, with allow rules only. A rule can name another security group as its source, such as the load balancer's."],
        ["Network ACL", "The firewall of a subnet. Stateless, with numbered allow and deny rules that are checked in ascending order until one matches."],
        ["Defaults", "A new security group has no inbound rules and allows all outbound traffic. The VPC's default network ACL allows all traffic in and out."]
      ],
      trap: "To block one IP address range, use a network ACL deny rule. A security group cannot deny.",
      tags: ["Security groups & NACLs", "VPC & subnets"]
    },
    "nat-a": {
      name: "NAT gateway",
      why: "A server in a private subnet still has to reach out, for example to AWS services, while nothing outside may start a connection to it. A NAT gateway lets it connect out and keeps connections from outside away.",
      k: [
        ["Where it sits", "A zonal NAT gateway sits in a public subnet. The private subnet's route table sends <code>0.0.0.0/0</code> to it."],
        ["One per zone", "One zonal NAT gateway is a single point of failure for outbound traffic from every zone that routes to it. The resilient design is one per zone, each with its own private route table."],
        ["Regional mode", "The newer regional NAT gateway is one resource that expands across zones by itself and needs no public subnet."]
      ],
      trap: "A NAT gateway gives a private subnet outbound access only. Requests from users reach private servers through an internet-facing load balancer.",
      tags: ["Internet & NAT gateways"]
    },
    elb: {
      name: "Load balancer",
      why: "Servers in two zones become one application only when something spreads the traffic over them. Elastic Load Balancing distributes incoming traffic across targets in one or more zones and routes only to the healthy ones.",
      k: [
        ["One address", "Users reach the load balancer, not the servers. Its targets need no public IP addresses and can sit in private subnets."],
        ["Two zones at least", "An Application Load Balancer must be enabled in at least two Availability Zones."],
        ["Health checks", "Requests go only to the targets that pass the health check."]
      ],
      trap: "A load balancer only stops sending traffic to an unhealthy target. It never replaces it.",
      tags: ["Load balancing", "High availability design"]
    },
    "ec2-a": {
      name: "EC2 instance",
      why: "An application needs something to run on, and workloads differ in which resource runs short. You pick the instance type by that resource, and the purchasing option by how the workload runs over time.",
      k: [
        ["Instance family", "C is compute optimized, R memory optimized, I storage optimized and M general purpose. T is burstable, for low average CPU with spikes."],
        ["Paying for it", "Steady use for one or three years: Savings Plans or Reserved Instances. Short, irregular work that cannot be interrupted: On-Demand. Work that can be interrupted: Spot."],
        ["Its disk", "An EBS volume in the same zone. The volume persists independently of the instance, and a snapshot can be restored as a new volume in any zone of the Region."]
      ],
      trap: "A bigger instance type is vertical scaling. It means a stop and start, and it still leaves one instance to fail. The reliability pillar prefers several small resources to one large one.",
      tags: ["EC2 instance types", "EC2 purchase options", "EBS & instance store"]
    },
    "rds-a": {
      name: "RDS primary and standby",
      why: "The database is the part that hurts most to lose. A Multi-AZ DB instance keeps a synchronous standby in another zone. When the primary fails, RDS switches over to the standby automatically.",
      k: [
        ["Failover", "RDS repoints the instance's DNS record to the standby, typically in 60 to 120 seconds. The application keeps its endpoint name."],
        ["Standby or read replica", "The standby of a Multi-AZ DB instance serves no reads. To take read load off the primary, add a read replica and send queries to it."],
        ["Managed for you", "RDS does the backups, software patching and failure detection. Query tuning stays with you."]
      ],
      trap: "RDS copies every change to the standby, an accidental <code>DELETE</code> included. A failover does not bring the rows back. A point-in-time restore does, and it creates a new DB instance.",
      tags: ["RDS", "High availability design"]
    }
  }
};
