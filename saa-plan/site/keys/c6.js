// Key points per plan step for the course "Designing a Hybrid Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c6a: {
    why: "A company with its own data center has applications that still speak file, disk and tape protocols, and data that must get to AWS. Rewriting them all at once is not realistic. The hybrid storage services either keep the old protocol and put the data in AWS, or move the data across for you.",
    k: [
      ["Storage Gateway", "Keeps the on-premises protocol and puts the data in AWS. S3 File Gateway offers NFS or SMB shares whose files are stored as S3 objects. Volume Gateway offers iSCSI volumes. Tape Gateway offers virtual tapes archived to S3 Glacier storage classes."],
      ["Volume Gateway modes", "The modes differ in where the primary copy lives. Cached volumes keep it in S3 and only frequently accessed data on site. Stored volumes keep the whole dataset on site for low latency and back it up to AWS asynchronously."],
      ["DataSync", "Moves data instead of serving it. It copies files and objects from NFS, SMB, HDFS or object storage to S3, EFS or FSx. Data is encrypted in transit (TLS to AWS) and checked for integrity. Later runs transfer only what changed, and a bandwidth limit can be set."],
      ["Transfer Family", "For partners and applications that keep SFTP, FTPS, FTP or AS2. A managed endpoint transfers directly into and out of S3 or EFS, and the existing client-side configuration stays as it is."],
      ["AWS Backup", "Manages backup plans centrally, across the accounts of an organization, and copies backups to other Regions and accounts. In a vault locked in compliance mode, no user can delete a backup, not even the root user."]
    ],
    trap: "Ongoing file access from the data center is a gateway. A one-time or scheduled copy is DataSync. A database is DMS. Amazon FSx File Gateway is no longer available to new customers: SMB shares in AWS mean FSx for Windows File Server itself.",
    docs: [
      ["What is Amazon S3 File Gateway?", "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html"],
      ["How Volume Gateway works", "https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html"],
      ["What is AWS DataSync?", "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"]
    ]
  },

  c6b: {
    why: "Resources in a private subnet need an AWS service such as S3, or resources in another VPC. You do not want an internet gateway or a NAT device in the path. A VPC endpoint is the private door from a VPC to a service. A peering connection lets two VPCs route traffic to each other.",
    k: [
      ["Gateway endpoint", "For reaching S3 or DynamoDB from inside one VPC. It is a route in the subnet's route table and has no additional charge. It does not work from on premises, from a peered VPC in another Region, or through a transit gateway."],
      ["Interface endpoint", "The endpoint that on-premises applications can reach. It is a network interface in your subnet with its own security group. Because it has private IP addresses in the VPC, they reach it over VPN or Direct Connect. That is how they reach S3 privately."],
      ["Endpoint policy", "Controls which principals can use the endpoint to reach the service. It does not override or replace identity-based or resource-based policies, so a bucket policy still applies."],
      ["VPC peering", "A one-to-one link between two VPCs that works across accounts and Regions. It costs nothing to create and needs routes in the route tables of both VPCs. It has no transitive routing, and it cannot be created when the CIDR blocks overlap."],
      ["Peering or PrivateLink", "Choose by what must be shared. Two networks talking in both directions: peering. One service offered to many VPCs: a PrivateLink endpoint service behind a Network Load Balancer. There only consumers initiate connections, and IP ranges may overlap."]
    ],
    trap: "Peering gives no edge-to-edge routing: resources in VPC B cannot use VPC A's internet gateway or NAT device. A security group rule can reference a peer VPC's security group only in the same Region. For another Region use the peer's CIDR block.",
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"]
    ]
  },

  c6c: {
    why: "A data center and a VPC are separate networks, yet the servers in them must work together. One way to join them is an encrypted tunnel over the internet. The other is a dedicated line that avoids the internet. Site-to-Site VPN and Direct Connect are those two, and a transit gateway is the hub when many networks must meet.",
    k: [
      ["Site-to-Site VPN", "The encrypted connection over the internet: IPsec with two tunnels. Configure both, because traffic moves to the other tunnel when one is down for maintenance. On the AWS side it ends on a virtual private gateway (a single VPC) or a transit gateway."],
      ["Direct Connect", "An Ethernet fiber link to a Direct Connect location that bypasses internet service providers. A dedicated connection is a port for one customer (1, 10, 100 or 400 Gbps). A hosted connection comes from a partner (50 Mbps to 25 Gbps)."],
      ["Virtual interface", "Decides what the Direct Connect link reaches: private for a VPC, public for all public AWS services such as S3, transit for transit gateways."],
      ["Direct Connect gateway", "Lets one connection reach more than one Region. It is a global resource: one connection reaches any Region except the China Regions."],
      ["Encryption on Direct Connect", "Direct Connect does not encrypt traffic in transit by default. Combine it with a Site-to-Site VPN for an IPsec-encrypted private connection. Or use MACsec, layer 2 encryption on 10, 100 and 400 Gbps dedicated connections, not on hosted ones."],
      ["Transit gateway", "A network transit hub that interconnects VPCs and on-premises networks. Additional route tables isolate subsets of attachments, and transit gateways in different Regions can be peered."]
    ],
    trap: "Two connections at one Direct Connect location survive a device failure but not the loss of the location. Maximum resiliency is separate connections on separate devices in more than one location. A VPN is the cheap backup path.",
    docs: [
      ["Direct Connect dedicated and hosted connections", "https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithConnections.html"],
      ["Site-to-Site VPN tunnel options", "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNTunnels.html"],
      ["Direct Connect resiliency recommendations", "https://aws.amazon.com/directconnect/resiliency-recommendation/"]
    ]
  },

  c6d: {
    why: "Moving to AWS raises three practical questions. How do you move a database that must stay in use? How do you move more data than the network can carry in time? And what about systems that must stay on site? AWS DMS, shipped storage devices and AWS Outposts are the answers.",
    k: [
      ["AWS DMS", "Migrates a database while the source stays fully operational. A full load copies the existing data. Then change data capture (CDC) replicates ongoing changes until you switch over to the target."],
      ["Schema conversion", "Needed when the target is a different database engine, for example Oracle to Aurora PostgreSQL. DMS Schema Conversion or the AWS Schema Conversion Tool first converts the schema and code objects. The same engine on both sides needs no conversion."],
      ["Snowball Edge today", "AWS Snowball Edge is no longer available to new customers (since 7 November 2025). Support for Snowball devices ends in all commercial Regions on 31 December 2026. AWS points to DataSync for online and Data Transfer Terminal for physical transfer."],
      ["Snow Family on the exam", "The exam guide still lists AWS Snow Family, although the devices are no longer offered to new customers. The idea to keep: a rugged device shipped by carrier moves data faster than the internet could. For edge computing AWS now names Outposts."],
      ["AWS Outposts", "For low latency to on-premises systems, local data processing or data residency. It is AWS compute and storage capacity at your site, operated by AWS as part of a Region and used through the same APIs."]
    ],
    trap: "An Outpost is not AWS without the network. It is designed for a constant connection to its Region and is homed to one Availability Zone there. AWS has discontinued sales of the 1U and 2U Outposts servers. The offering is Outposts racks.",
    docs: [
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"],
      ["AWS Snowball Edge availability change", "https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html"],
      ["What is AWS Outposts?", "https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html"]
    ]
  },

  c6e: {
    why: "A company ends up with many AWS accounts, and a hybrid network has many parts that each cost money. Without central control, accounts cannot share discounts, each builds its own network and nobody sees the whole bill. AWS Organizations, resource sharing and the cost tools solve that.",
    k: [
      ["Consolidated billing", "One bill for all accounts in AWS Organizations. Usage is combined across accounts, which shares volume pricing discounts, Reserved Instance discounts and Savings Plans. It is offered at no additional cost."],
      ["AWS RAM and shared subnets", "Share network resources across accounts instead of building them twice. AWS RAM shares a resource with other accounts or a whole organization. With VPC subnet sharing, participant accounts create their resources in a centrally managed VPC."],
      ["Cost tool by question", "Cost Explorer shows up to the last 13 months and forecasts spend. Budgets alerts on actual and forecasted spend and can apply an IAM policy or SCP. Cost and Usage Reports (now CUR 2.0 in Data Exports) are the most detailed data, in S3."],
      ["Transit gateway or peering cost", "A transit gateway bills each attachment by the hour plus a data processing charge per gigabyte. A VPC peering connection costs nothing to create, and data that stays within one Availability Zone over it is free."],
      ["Hybrid design by requirement", "Encrypted and over the internet: a VPN. A dedicated link that bypasses the internet: Direct Connect. Many VPCs behind one hub: a transit gateway. NFS or SMB onto S3: a file gateway. Bulk copy: DataSync."]
    ],
    trap: "A managed service gives up control for less operational work. 'Least operational overhead' points to the managed option. The exception is a stem that demands what only the lower-level option gives: an on-premises protocol, or data that must stay on site.",
    docs: [
      ["Consolidated billing for AWS Organizations", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html"],
      ["What is AWS Resource Access Manager?", "https://docs.aws.amazon.com/ram/latest/userguide/what-is.html"],
      ["AWS Transit Gateway pricing", "https://aws.amazon.com/transit-gateway/pricing/"]
    ]
  },

  l6a: {
    why: "Two VPCs are isolated networks, even inside one account, so nothing passes between them until you connect them. Setting up a peering connection by hand shows every piece that must be in place before a packet gets through. They are the accepted request, the routes on both sides and the security group rules.",
    k: [
      ["Request and routes", "A peering connection carries nothing until two things are done. The owner of the accepter VPC accepts the request. And each VPC has a route to the other's CIDR block in its route tables."],
      ["Subnet-specific routes", "For giving access to only part of the peer VPC. A route does not have to cover the whole peer VPC. Routing only to a subnet's CIDR block restricts access to that subnet, which is what a subnet-specific peering configuration means."],
      ["Security groups", "They still decide what gets through. In the same Region a rule can reference a security group of the peer VPC. For a peer VPC in a different Region you use its CIDR block instead."],
      ["Cost", "Creating a peering connection is free. So is data that stays within one Availability Zone, even between accounts. Data transfer is charged when it crosses Availability Zones or Regions."]
    ],
    trap: "Transitive peering is not supported. With A peered to B and to C, VPC A cannot act as a transit point between B and C. B and C need their own peering connection. Many VPCs that must all reach each other call for a transit gateway.",
    docs: [
      ["What is VPC peering?", "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"],
      ["VPC peering configurations with specific routes", "https://docs.aws.amazon.com/vpc/latest/peering/peering-configurations-partial-access.html"]
    ]
  },

  l6b: {
    why: "A partner or a data center outside AWS needs private access to S3 and to names that exist only inside your VPC. Two things must then work from outside the VPC: an address to connect to, and DNS that resolves the private names. Building both by hand shows why an interface endpoint and Resolver endpoints are the pieces.",
    k: [
      ["S3 from on premises", "A partner arriving over Site-to-Site VPN cannot use an S3 gateway endpoint, because endpoint connections cannot be extended out of a VPC. An S3 interface endpoint is reachable from on premises over VPN and Direct Connect."],
      ["Inbound Resolver endpoint", "The other half is DNS. An inbound Resolver endpoint allows DNS queries to your VPC from an on-premises network. Names that resolve only inside the VPC can then be resolved from outside AWS."],
      ["Outbound Resolver endpoint", "The opposite direction, used with forwarding rules. There is one rule per domain name. It forwards queries for that domain from the VPC to an on-premises DNS resolver."],
      ["Private hosted zone", "Answers DNS queries for a domain only within the VPCs you associate with it. A client outside those VPCs, such as on premises, gets the answer only through an inbound Resolver endpoint."]
    ],
    trap: "For private access to S3 from outside the VPC, the gateway endpoint is the cheap but wrong answer. It has no additional charge, yet it serves only resources inside the VPC. The interface endpoint is the one with private addresses to connect to.",
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["What is Route 53 VPC Resolver?", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html"]
    ]
  }
});
