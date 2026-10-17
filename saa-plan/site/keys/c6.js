// Key points per plan step for the course "Designing a Hybrid Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c6a: {
    head: "Bringing on-premises storage and data into AWS",
    why: "A hospital's imaging system writes scans to a file share in the basement. The share is full, and the system cannot be rewritten to use S3. Meanwhile years of old scans have to move to AWS. Old applications need their file, disk or tape protocol to keep working while the data lives in AWS, and existing data has to be moved across.",
    idea: "The hybrid storage services do one or the other. AWS Storage Gateway keeps the old protocol and stores the data in AWS. AWS DataSync and AWS Transfer Family move data across. AWS Backup protects it all from one place.",
    k: [
      ["Storage Gateway keeps the protocol", "S3 File Gateway offers NFS or SMB shares whose files are stored as S3 objects. Volume Gateway offers iSCSI volumes. Tape Gateway offers virtual tapes archived to S3 Glacier storage classes."],
      ["Cached or stored volumes", "The Volume Gateway modes differ in where the primary copy lives. Cached volumes keep it in S3 and only frequently accessed data on site. Stored volumes keep the whole dataset on site for low latency and back it up to AWS asynchronously."],
      ["DataSync moves data", "It copies files and objects from NFS, SMB, HDFS or object storage to S3, EFS or FSx. Data is encrypted in transit (TLS to AWS) and checked for integrity. Later runs transfer only what changed, and a bandwidth limit can be set."],
      ["Transfer Family keeps old file protocols", "For partners and applications that keep SFTP, FTPS, FTP or AS2. A managed endpoint transfers directly into and out of S3 or EFS, and the existing client-side configuration stays as it is."],
      ["AWS Backup in one place", "It manages backup plans centrally, across the accounts of an organization, and copies backups to other Regions and accounts. In a vault locked in compliance mode, no user can delete a backup, not even the root user."]
    ],
    trap: "Ongoing file access from the data center is a gateway. A one-time or scheduled copy is DataSync. A database is DMS. Amazon FSx File Gateway is no longer available to new customers: SMB shares in AWS mean FSx for Windows File Server itself.",
    q: {
      q: "A factory's control system reads every block of its iSCSI volume all day and needs local speed for all of it. The company also wants a copy of the volume in AWS. Which Storage Gateway setup fits?",
      o: [
        "Volume Gateway with stored volumes",
        "Volume Gateway with cached volumes",
        "S3 File Gateway with an NFS share",
        "Tape Gateway with virtual tapes"
      ],
      a: [0],
      x: [
        "Right. Stored volumes keep the whole dataset on site for low latency and back it up to AWS asynchronously.",
        "Cached volumes keep the primary copy in S3 and only frequently accessed data on site, so some blocks would come from AWS.",
        "A file gateway offers NFS or SMB file shares. The control system uses an iSCSI volume.",
        "Tape Gateway offers virtual tapes for archives, not a volume read all day."
      ],
      dom: 3, tags: ["Storage Gateway"], doc: "storagegateway"
    },
    docs: [
      ["What is Amazon S3 File Gateway?", "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html"],
      ["How Volume Gateway works", "https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html"],
      ["What is AWS DataSync?", "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"]
    ]
  },

  c6b: {
    head: "Private doors from a VPC to AWS services and to other VPCs",
    why: "Servers in a private subnet upload their logs to S3 every night through a NAT gateway. The bill for it grows each month, and the security team asks why the traffic heads for the internet at all. Private resources need to reach AWS services and other VPCs without an internet gateway or a NAT device in the path.",
    idea: "A VPC endpoint is a private door from a VPC to a service. A gateway endpoint serves S3 and DynamoDB, an interface endpoint many others (Day 4). A peering connection lets two VPCs route traffic to each other directly.",
    k: [
      ["A gateway endpoint is a route", "For reaching S3 or DynamoDB from inside one VPC. It is a route in the subnet's route table and has no additional charge. It does not work from on premises, from a peered VPC in another Region, or through a transit gateway."],
      ["An interface endpoint has addresses", "It is a network interface in your subnet with its own security group. Because it has private IP addresses in the VPC, on-premises applications can reach it over VPN or Direct Connect. That is how they reach S3 privately."],
      ["Endpoint policy adds a limit", "It controls which principals can use the endpoint to reach the service. It does not override or replace identity-based or resource-based policies, so a bucket policy still applies."],
      ["VPC peering joins two networks", "A one-to-one link between two VPCs that works across accounts and Regions. It costs nothing to create and needs routes in the route tables of both VPCs. It has no transitive routing, and it cannot be created when the CIDR blocks overlap."],
      ["Peering or PrivateLink", "Two networks talking in both directions: peering. One service offered to many VPCs: a PrivateLink endpoint service behind a Network Load Balancer. There only consumers initiate connections, and IP ranges may overlap."]
    ],
    trap: "Peering gives no edge-to-edge routing: resources in VPC B cannot use VPC A's internet gateway or NAT device. A security group rule can reference a peer VPC's security group only in the same Region. For another Region use the peer's CIDR block.",
    q: {
      q: "Servers in private subnets upload large files to an S3 bucket in the same Region every night, through a NAT gateway. How do you take the NAT gateway out of that path at no additional charge?",
      o: [
        "Add an S3 gateway endpoint and its route to the private route tables",
        "Add an S3 interface endpoint in each of the private subnets",
        "Give the servers public IP addresses and a route to the internet gateway",
        "Peer the servers' VPC with the VPC that hosts Amazon S3"
      ],
      a: [0],
      x: [
        "Right. A gateway endpoint for S3 is a route in the subnet's route table and has no additional charge.",
        "An interface endpoint also keeps the traffic private, but for S3 from inside the VPC the gateway endpoint is the one with no additional charge.",
        "That makes the subnets public and still sends the traffic toward the internet.",
        "S3 is not a VPC you can peer with. A VPC endpoint is the private door to it."
      ],
      dom: 4, tags: ["VPC endpoints & PrivateLink"], doc: "endpoints"
    },
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"]
    ]
  },

  c6c: {
    head: "Joining your data center to AWS: VPN, Direct Connect and a hub",
    why: "A bank's branch servers call an application in a VPC over the public internet. The calls slow down whenever the internet is busy, and the auditors want the traffic encrypted. Separate networks must be joined so that their servers can work together, cheaply over the internet or on a private line. And many networks need one place to meet.",
    idea: "AWS Site-to-Site VPN is an encrypted tunnel over the internet. AWS Direct Connect is a dedicated line that bypasses it. A transit gateway is the hub where many VPCs and on-premises networks meet.",
    k: [
      ["Site-to-Site VPN has two tunnels", "It is IPsec over the internet, with two tunnels. Configure both, because traffic moves to the other tunnel when one is down for maintenance. On the AWS side it ends on a virtual private gateway (a single VPC) or a transit gateway."],
      ["Direct Connect bypasses the internet", "An Ethernet fiber link to a Direct Connect location that bypasses internet service providers. A dedicated connection is a port for one customer (1, 10, 100 or 400 Gbps). A hosted connection comes from a partner (50 Mbps to 25 Gbps)."],
      ["Virtual interfaces and the gateway", "A private virtual interface reaches a VPC, a public one all public AWS services such as S3, a transit one transit gateways. A Direct Connect gateway is global: one connection reaches any Region except the China Regions."],
      ["Direct Connect is not encrypted", "It does not encrypt traffic in transit by default. Combine it with a Site-to-Site VPN for an IPsec-encrypted private connection. Or use MACsec, layer 2 encryption on 10, 100 and 400 Gbps dedicated connections, not on hosted ones."],
      ["A transit gateway is the hub", "A network transit hub that interconnects VPCs and on-premises networks. Additional route tables isolate subsets of attachments, and transit gateways in different Regions can be peered."]
    ],
    trap: "Two connections at one Direct Connect location survive a device failure but not the loss of the location. Maximum resiliency is separate connections on separate devices in more than one location. A VPN is the cheap backup path.",
    q: {
      q: "A company has one Direct Connect connection at a location near Frankfurt. Its VPCs now run in two Regions, Frankfurt and Ireland. How can the one connection reach the VPCs in both?",
      o: [
        "Through a Direct Connect gateway, which is a global resource",
        "Only by ordering a second connection at a location in Ireland",
        "Through a public virtual interface to each of the VPCs",
        "Through a peering connection from the Frankfurt VPC to the Irish one"
      ],
      a: [0],
      x: [
        "Right. A Direct Connect gateway is a global resource: one connection reaches any Region except the China Regions.",
        "A second location adds resiliency, but it is not needed to reach a second Region.",
        "A public virtual interface reaches public AWS services such as S3. VPCs are reached through a private or transit virtual interface.",
        "Peering gives no edge-to-edge routing, so traffic from the data center cannot pass through the Frankfurt VPC into the Irish one."
      ],
      dom: 2, tags: ["Hybrid connectivity"], doc: "dx"
    },
    docs: [
      ["Direct Connect dedicated and hosted connections", "https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithConnections.html"],
      ["Site-to-Site VPN tunnel options", "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNTunnels.html"],
      ["Direct Connect resiliency recommendations", "https://aws.amazon.com/directconnect/resiliency-recommendation/"]
    ]
  },

  c6d: {
    head: "Moving databases and bulk data, and AWS that stays on site",
    why: "A retailer must move its order database to AWS, but the shop cannot close for a weekend. It also keeps a warehouse of archived video that would take months to upload, and a factory line that must keep running on site. Each needs a different answer: a live database move, a way around a slow network, and AWS capacity on premises.",
    idea: "AWS DMS moves a database while it stays in use. Shipped storage devices moved bulk data faster than a network could, though AWS no longer offers them to new customers. AWS Outposts brings AWS compute and storage to your own site.",
    k: [
      ["DMS keeps the source running", "A full load copies the existing data, then change data capture (CDC) replicates ongoing changes until you switch over (Day 4). A different target engine, such as Oracle to Aurora PostgreSQL, first needs DMS Schema Conversion or the Schema Conversion Tool."],
      ["Instead of Snowball", "AWS points to DataSync for online transfer and to Data Transfer Terminal for physical transfer. For the exam, keep the idea: a rugged device shipped by carrier moves data faster than the internet could. For edge computing AWS now names Outposts."],
      ["AWS Outposts on your site", "For low latency to on-premises systems, local data processing or data residency. It is AWS compute and storage capacity at your site, operated by AWS as part of a Region and used through the same APIs."]
    ],
    trap: "An Outpost is not AWS without the network. It is designed for a constant connection to its Region and is homed to one Availability Zone there. AWS has discontinued sales of the 1U and 2U Outposts servers. The offering is Outposts racks.",
    q: {
      q: "A team must move an Oracle database to Aurora PostgreSQL while the shop keeps taking orders. Which approach fits?",
      o: [
        "Convert the schema with DMS Schema Conversion, then migrate with a DMS full load and CDC",
        "Run a DMS full load and CDC straight away, with no schema conversion needed",
        "Copy the database files to S3 with DataSync and attach them to Aurora",
        "Stop the shop, export the data, and import it into Aurora over a weekend"
      ],
      a: [0],
      x: [
        "Right. A different target engine first needs its schema and code objects converted. DMS then copies the data and replicates ongoing changes until you switch over.",
        "Only the same engine on both sides needs no conversion. Oracle to Aurora PostgreSQL changes the engine.",
        "DataSync copies files and objects. Database files from one engine cannot simply be attached to another.",
        "DMS keeps the source fully operational during the move, so the shop does not have to close."
      ],
      dom: 2, tags: ["Migration & transfer"], doc: "dms"
    },
    docs: [
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"],
      ["AWS Snowball Edge availability change", "https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html"],
      ["What is AWS Outposts?", "https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html"]
    ]
  },

  c6e: {
    head: "Many accounts, one bill, shared networks and costs you can see",
    why: "Each of a company's AWS accounts buys its own discounts and builds its own VPC with its own NAT gateways. Finance gets a pile of bills and cannot see which team drives the costs. Accounts should share discounts and network resources, and someone needs to see and control the whole bill.",
    idea: "AWS Organizations gives one bill with discounts shared across accounts. AWS Resource Access Manager (RAM) shares network resources instead of building them twice. The cost tools show, forecast and cap the spending.",
    k: [
      ["Consolidated billing", "One bill for all accounts in AWS Organizations. Usage is combined across accounts, which shares volume pricing discounts, Reserved Instance discounts and Savings Plans. It is offered at no additional cost."],
      ["Share the network once", "AWS RAM shares a resource with other accounts or a whole organization. With VPC subnet sharing, participant accounts create their resources in a centrally managed VPC."],
      ["A cost tool for each question", "Cost Explorer shows up to the last 13 months and forecasts spend. Budgets alerts on actual and forecasted spend and can apply an IAM policy or SCP. Cost and Usage Reports (now CUR 2.0 in Data Exports) are the most detailed data, in S3."],
      ["Transit gateway or peering cost", "A transit gateway bills each attachment by the hour plus a data processing charge per gigabyte. A VPC peering connection costs nothing to create, and data that stays within one Availability Zone over it is free."],
      ["Hybrid design by requirement", "Encrypted and over the internet: a VPN. A dedicated link that bypasses the internet: Direct Connect. Many VPCs behind one hub: a transit gateway. NFS or SMB onto S3: a file gateway. Bulk copy: DataSync."]
    ],
    trap: "A managed service gives up control for less operational work. 'Least operational overhead' points to the managed option. The exception is a stem that demands what only the lower-level option gives: an on-premises protocol, or data that must stay on site.",
    q: {
      q: "Finance wants a warning before a sandbox account's spending passes the month's plan, and new launches in that account blocked automatically once it does. Which tool does both?",
      o: [
        "AWS Budgets, with a forecasted alert and an action that applies an SCP",
        "Cost Explorer, with its forecast of the coming months",
        "Cost and Usage Reports in Data Exports, delivered to S3",
        "Consolidated billing in AWS Organizations"
      ],
      a: [0],
      x: [
        "Right. Budgets alerts on actual and forecasted spend and can apply an IAM policy or an SCP when a threshold is reached.",
        "Cost Explorer shows and forecasts spend. Blocking launches once a threshold is passed is a Budgets action.",
        "Cost and Usage Reports are the most detailed cost data. They report spending, they do not stop it.",
        "Consolidated billing combines the bills and shares discounts. It sets no limits."
      ],
      dom: 4, tags: ["Cost management tools"], doc: "budgets"
    },
    docs: [
      ["Consolidated billing for AWS Organizations", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html"],
      ["What is AWS Resource Access Manager?", "https://docs.aws.amazon.com/ram/latest/userguide/what-is.html"],
      ["AWS Transit Gateway pricing", "https://aws.amazon.com/transit-gateway/pricing/"]
    ]
  },

  l6a: {
    head: "Connect two VPCs with peering, piece by piece",
    why: "A team creates a peering connection between two VPCs and expects the servers to talk. Nothing gets through: the request was never accepted, and no route points across. Two VPCs are isolated networks until every piece of the connection is in place.",
    idea: "Setting up a peering connection by hand shows each of those pieces: the accepted request, the routes on both sides, and the security group rules.",
    k: [
      ["Accept, then route", "A peering connection carries nothing until two things are done. The owner of the accepter VPC accepts the request. And each VPC has a route to the other's CIDR block in its route tables."],
      ["Route to part of the peer", "A route does not have to cover the whole peer VPC. Routing only to a subnet's CIDR block restricts access to that subnet, which is what a subnet-specific peering configuration means."],
      ["Security groups still decide", "In the same Region a rule can reference a security group of the peer VPC. For a peer VPC in a different Region you use its CIDR block instead."],
      ["What peering costs", "Creating a peering connection is free. So is data that stays within one Availability Zone, even between accounts. Data transfer is charged when it crosses Availability Zones or Regions."]
    ],
    trap: "Transitive peering is not supported. With A peered to B and to C, VPC A cannot act as a transit point between B and C. B and C need their own peering connection. Many VPCs that must all reach each other call for a transit gateway.",
    q: {
      q: "Your dev VPC is peered with your shared-services VPC. Servers in the dev VPC may reach only the shared VPC's build subnet, nothing else in it. How do you set up the dev VPC's routes?",
      o: [
        "Route only the build subnet's CIDR block to the peering connection",
        "Route the shared VPC's whole CIDR block to the peering connection",
        "Route the build subnet's CIDR block to the dev VPC's internet gateway",
        "Create a second peering connection just for the build subnet"
      ],
      a: [0],
      x: [
        "Right. A route does not have to cover the whole peer VPC. Routing only to the build subnet's CIDR block restricts the dev servers to that subnet.",
        "A route to the whole CIDR block lets the dev servers reach every subnet of the shared VPC.",
        "Traffic between the two VPCs has to use the peering connection. A route to the internet gateway sends it toward the internet.",
        "One peering connection is enough. A subnet-specific route on it limits what is reachable."
      ],
      dom: 1, tags: ["VPC peering & Transit Gateway"], doc: "vpc"
    },
    docs: [
      ["What is VPC peering?", "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"],
      ["VPC peering configurations with specific routes", "https://docs.aws.amazon.com/vpc/latest/peering/peering-configurations-partial-access.html"]
    ]
  },

  l6b: {
    head: "Private access to S3, and to private names, from outside the VPC",
    why: "A partner's data center connects to your VPC over a VPN. It needs to reach S3 privately and to look up names that exist only inside your VPC, and neither works. From outside the VPC you need an address to connect to, and DNS that resolves the private names.",
    idea: "An S3 interface endpoint gives private addresses to connect to. Route 53 Resolver endpoints carry DNS queries into and out of the VPC. Building both by hand shows why these are the pieces.",
    k: [
      ["S3 from on premises", "A partner arriving over Site-to-Site VPN cannot use an S3 gateway endpoint, because endpoint connections cannot be extended out of a VPC. An S3 interface endpoint is reachable from on premises over VPN and Direct Connect."],
      ["Inbound Resolver endpoint", "It allows DNS queries to your VPC from an on-premises network. Names that resolve only inside the VPC can then be resolved from outside AWS."],
      ["Outbound Resolver endpoint", "The opposite direction, used with forwarding rules. There is one rule per domain name. It forwards queries for that domain from the VPC to an on-premises DNS resolver."],
      ["Private hosted zone from outside", "It answers DNS queries for a domain only within the VPCs you associate with it (Day 10). A client outside those VPCs, such as on premises, gets the answer only through an inbound Resolver endpoint."]
    ],
    trap: "For private access to S3 from outside the VPC, the gateway endpoint is the cheap but wrong answer. It has no additional charge, yet it serves only resources inside the VPC. The interface endpoint is the one with private addresses to connect to.",
    q: {
      q: "Servers in a data center, connected to a VPC over Site-to-Site VPN, must resolve names from a private hosted zone associated with that VPC. What do you add?",
      o: [
        "An inbound Resolver endpoint in the VPC, for the data center's DNS servers to forward to",
        "An outbound Resolver endpoint with a forwarding rule for the zone's domain",
        "A public hosted zone with the same records",
        "An S3 interface endpoint in the VPC"
      ],
      a: [0],
      x: [
        "Right. An inbound Resolver endpoint allows DNS queries to the VPC from an on-premises network, so names that resolve only inside the VPC can be resolved there.",
        "An outbound endpoint goes the other way: it forwards queries from the VPC to an on-premises resolver.",
        "A public zone would publish internal names on the internet, which a private zone exists to avoid.",
        "An interface endpoint gives private access to S3. It does not answer DNS queries for your private names."
      ],
      dom: 3, tags: ["Route 53"], doc: "route53"
    },
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["What is Route 53 VPC Resolver?", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html"]
    ]
  }
});
