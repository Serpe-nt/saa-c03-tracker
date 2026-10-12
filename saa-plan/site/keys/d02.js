// Key points per plan step for Day 2. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d2w1: {
    k: [
      "An internet gateway is horizontally scaled, redundant and highly available, and a VPC has only one. It gives two-way access to resources with a public address; a NAT gateway (IPv4) and an egress-only internet gateway (IPv6) are outbound-only.",
      "Site-to-Site VPN is an IPsec connection with two tunnels; configure both so one can take over during maintenance. Direct Connect is a dedicated physical link that bypasses the internet for a more consistent network experience.",
      "Direct Connect does not encrypt traffic by default: run an IPsec VPN over it or use MACsec. A Direct Connect gateway lets one connection reach VPCs in multiple Regions, but as a rule it does not let those VPCs send traffic to each other.",
      "In Route 53, failover routing is active-passive and switches when the primary is unhealthy, weighted routing splits traffic by proportion, latency routing picks the Region with the lowest latency, and geolocation follows the user's location.",
      "An alias record can sit at the zone apex and tracks the changing IP addresses of a load balancer or CloudFront distribution; a CNAME cannot exist at the apex. A private hosted zone answers only for its associated VPCs."
    ],
    trap: "Hybrid questions turn on one phrase. 'Low cost' or 'over the internet is acceptable' means Site-to-Site VPN; 'consistent' or 'not over the internet' means Direct Connect; 'survive a location failure' means Direct Connect at two locations.",
    docs: [
      ["Choosing a routing policy", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"],
      ["Choosing between alias and non-alias records", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html"],
      ["Direct Connect resiliency recommendations", "https://aws.amazon.com/directconnect/resiliency-recommendation/"]
    ]
  },

  d2p1: {
    k: [
      "A subnet is public for one reason only: its route table has a route to an internet gateway. Auto-assigned public IP addresses, NACL rules or the subnet's name do not make it public.",
      "Reaching an instance from the internet over IPv4 takes both a route to the internet gateway and a public IPv4 address (auto-assigned or Elastic IP) on the instance. Without either one it fails.",
      "A subnet with no explicit association uses the main route table. Keep the main table local-only and give public subnets their own custom table, so that every new subnet starts out private.",
      "Routing picks the most specific matching route (longest prefix), not the first one listed. A /16 route to a peering connection beats <code>0.0.0.0/0</code>, and every table has a local route for the VPC's own CIDR.",
      "A VPC's IPv4 CIDR block is between /16 and /28 and cannot be resized later; you add secondary blocks instead. AWS reserves the first four addresses and the last one in every subnet, so a /27 has 27 usable."
    ],
    trap: "Plan address ranges before building: pick a CIDR that overlaps no VPC you will peer with and no on-premises network. Peering is refused when CIDR blocks overlap, and 'change the VPC's existing CIDR block' is never a valid option.",
    docs: [
      ["Internet gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html"],
      ["How route priority works", "https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html"],
      ["VPC CIDR blocks", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html"]
    ]
  },

  d2p2: {
    k: [
      "A peering connection carries nothing until the owner of the accepter VPC accepts it and each side adds a route to the other VPC's CIDR in its own route tables. No route is created for you.",
      "Security groups still decide what gets through. When both VPCs are in the same Region, a rule can reference a security group in the peer VPC as its source or destination.",
      "Peering works across accounts and across Regions. Inter-Region traffic is encrypted and stays on the AWS backbone; it never crosses the public internet.",
      "Creating a peering connection costs nothing and traffic that stays within one AZ is free. You pay data transfer only when it crosses AZs or Regions, which makes peering the cheapest way to join a few VPCs."
    ],
    trap: "Pointing a route for VPC C's CIDR at the A-to-B peering connection achieves nothing, because B will not forward it. Nor can VPC A borrow B's NAT gateway, internet gateway, VPN or Direct Connect through the peering.",
    docs: [
      ["What is VPC peering?", "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"],
      ["VPC peering (multi-VPC network whitepaper)", "https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/vpc-peering.html"]
    ]
  },

  d2b1: {
    k: [
      "Trace the chain on the VPC's Resource map tab: private route tables send <code>0.0.0.0/0</code> to the NAT gateway, which sits in a public subnet with an Elastic IP, and the public route table sends <code>0.0.0.0/0</code> to the internet gateway.",
      "One zonal NAT gateway is a single point of failure for outbound traffic from every AZ that routes to it. The resilient zonal design is a NAT gateway per AZ and a private route table per AZ pointing to its own gateway.",
      "A regional NAT gateway is the newer mode: one resource that expands across AZs by itself and needs no public subnet. Zonal NAT gateways remain, and a zonal public one works only from a public subnet.",
      "A NAT gateway is managed by AWS, scales its bandwidth automatically and is redundant inside its AZ; a NAT instance is an EC2 instance you patch, size and fail over. NAT gateways take no security group and do no port forwarding.",
      "A NAT gateway serves only connections started from inside the VPC. Inbound requests for private instances come through an internet-facing load balancer, whose targets need no public IP addresses."
    ],
    trap: "Three designs look private but are not isolated: a subnet that still routes to the NAT gateway, a public subnet whose instances lack public IPs, and a NACL that blocks one port. No internet path at all means a route table with only the local route.",
    docs: [
      ["NAT gateway basics", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html"],
      ["Regional NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html"],
      ["Compare NAT gateways and NAT instances", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-comparison.html"]
    ]
  },

  d2b2: {
    k: [
      "A managed instance needs three things: SSM Agent (already installed on Amazon Linux 2023 AMIs), IAM permissions, and outbound HTTPS to the Systems Manager endpoints. If one is missing, the instance never appears in Systems Manager.",
      "By default Systems Manager has no permission to act on your instances. The instance profile's role with <code>AmazonSSMManagedInstanceCore</code> grants it; Default Host Management Configuration is the account-level alternative.",
      "The security group needs no inbound rule at all, not even port 22, because SSM Agent starts every connection itself, outbound on port 443."
    ],
    trap: "A public IP address, a key pair or an inbound SSH rule is never the missing piece for Session Manager. When a private instance does not show up as managed, check the instance profile and the outbound path to Systems Manager.",
    docs: [
      ["Configure instance permissions for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-permissions.html"],
      ["Troubleshooting managed node availability", "https://docs.aws.amazon.com/systems-manager/latest/userguide/fleet-manager-troubleshooting-managed-nodes.html"],
      ["AMIs with SSM Agent preinstalled", "https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html"]
    ]
  },

  d2b3: {
    k: [
      "Session Manager replaces the bastion host: no open inbound ports, no SSH keys to manage, access granted through IAM policies, and the API calls recorded by CloudTrail.",
      "The content of a session can be logged to an S3 bucket or a CloudWatch Logs log group, optionally encrypted with a KMS key. That is the feature behind 'keep a record of every session'.",
      "Without a NAT gateway or internet gateway, the agent reaches Systems Manager through interface endpoints for <code>ssm</code> and <code>ssmmessages</code> (older agents also use <code>ec2messages</code>). Gateway endpoints exist only for S3 and DynamoDB.",
      "Those interface endpoints have their own security group, and it must allow inbound port 443 from the subnets of the managed instances."
    ],
    trap: "Hardening a bastion (moving it behind a VPN, narrowing the source range, rotating keys in Secrets Manager) still leaves port 22 open and keys to manage. No inbound ports, no keys, IAM control and session logs together mean Session Manager.",
    docs: [
      ["AWS Systems Manager Session Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"],
      ["VPC endpoints for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html"]
    ]
  },

  d2b4: {
    k: [
      "The session fails because the agent's outbound HTTPS now matches no numbered rule and falls to the NACL's final deny (the * rule). The security group still allows it, which shows that both layers must pass the traffic.",
      "A NACL rule matches the port a packet is going to. A web server's replies go to the client's ephemeral port, so serving HTTPS needs inbound 443 plus outbound to the ephemeral range (1024-65535 covers the different client types), not outbound 443.",
      "NACL rules are evaluated only when traffic enters or leaves the subnet, never for traffic between instances inside the same subnet.",
      "VPC Flow Logs show blocked traffic without any agent: each record carries an <code>ACCEPT</code> or <code>REJECT</code> action. They publish to CloudWatch Logs, Amazon S3 or Data Firehose, and logs in S3 can be queried with Athena."
    ],
    trap: "CloudTrail records API activity and AWS Config records how a resource's configuration changed; neither shows dropped packets. When the security group allows the traffic and it still fails, check the NACL rule for the reply direction.",
    docs: [
      ["Network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"],
      ["Custom network ACLs and ephemeral ports", "https://docs.aws.amazon.com/vpc/latest/userguide/custom-network-acl.html"],
      ["VPC Flow Logs", "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html"]
    ]
  },

  d2b5: {
    k: [
      "A NAT gateway is billed for every hour it is provisioned, with a partial hour counted as a full one, plus a charge for each GB it processes, on top of normal data transfer.",
      "Deleting the NAT gateway only disassociates its Elastic IP. The address stays allocated to your account, and keeps being charged, until you release it; that is why release is its own step.",
      "AWS charges for every public IPv4 address it provides, in use or idle. Use an Elastic IP when an address must stay fixed and move to a replacement instance; otherwise keep instances private behind a load balancer.",
      "After deletion, routes that pointed at the NAT gateway stay in the route table with a blackhole status until you delete or update them."
    ],
    trap: "Cost questions hide idle resources: unattached Elastic IPs and a forgotten NAT gateway bill by the hour with no traffic. Replacing auto-assigned public IPs with Elastic IPs saves nothing, because AWS charges for both.",
    docs: [
      ["Work with NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-working-with.html"],
      ["Elastic IP addresses", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html"],
      ["Amazon VPC pricing", "https://aws.amazon.com/vpc/pricing/"]
    ]
  },

  d2c1: {
    trap: "Deleting a security group's outbound rules does not break replies to allowed inbound requests; the same change on a NACL does. A NACL deny works only with a lower rule number than the allow it must beat, and a NACL cannot reference a security group.",
    docs: [
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"],
      ["Network ACL rules", "https://docs.aws.amazon.com/vpc/latest/userguide/nacl-rules.html"]
    ]
  },

  d2c2: {
    trap: "Two look-alike hubs are not hubs: a virtual private gateway attaches to a single VPC, and a Direct Connect gateway as a rule does not let the VPCs associated with it send traffic to each other. Many VPCs sharing one VPN, or routing through each other, need a transit gateway.",
    docs: [
      ["What is AWS Transit Gateway?", "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"],
      ["Direct Connect gateways", "https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html"]
    ]
  },

  d2c3: {
    k: [
      "The two policies point in opposite directions. An endpoint policy limits what the VPC may reach through the endpoint (only our buckets); a bucket policy with <code>aws:sourceVpce</code> limits who may reach the bucket (only this endpoint).",
      "Your own service behind a Network Load Balancer can be published as a PrivateLink endpoint service. Only consumers initiate connections, through an interface endpoint in their VPC, and overlapping CIDR blocks are not a problem."
    ],
    trap: "A timeout to an interface endpoint usually means its security group does not allow inbound 443 from the client, not a missing route: the endpoint is a network interface in your own subnet. A gateway endpoint, by contrast, is a target in the subnet's route table.",
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["AWS PrivateLink (multi-VPC network whitepaper)", "https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/aws-privatelink.html"]
    ]
  }
});
