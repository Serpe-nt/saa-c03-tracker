// Key points per plan step for the course "Designing a Hybrid Architecture" and its labs. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c6a: {
    k: [
      "Storage Gateway keeps the on-premises protocol and puts the data in AWS. S3 File Gateway: NFS or SMB shares whose files are stored as S3 objects. Volume Gateway: iSCSI volumes. Tape Gateway: virtual tapes archived to S3 Glacier storage classes.",
      "Volume Gateway modes differ in where the primary copy lives. Cached volumes keep it in S3 and only frequently accessed data on site. Stored volumes keep the whole dataset on site for low latency and back it up to AWS asynchronously.",
      "DataSync moves data instead of serving it: it copies files and objects from NFS, SMB, HDFS or object storage to S3, EFS or FSx, encrypted in transit (TLS to AWS), with integrity checks, transferring only what changed on later runs, and with a bandwidth limit.",
      "Transfer Family is for partners and applications that keep SFTP, FTPS, FTP or AS2: a managed endpoint that transfers directly into and out of S3 or EFS, while the existing client-side configuration stays as it is.",
      "AWS Backup manages backup plans centrally, across the accounts of an organization, and copies backups to other Regions and accounts. In a vault locked in compliance mode, no user, the root user included, can delete a backup."
    ],
    trap: "Ongoing file access from the data center is a gateway, a one-time or scheduled copy is DataSync, a database is DMS. Amazon FSx File Gateway is no longer available to new customers: SMB shares in AWS mean FSx for Windows File Server itself.",
    docs: [
      ["What is Amazon S3 File Gateway?", "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html"],
      ["How Volume Gateway works", "https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html"],
      ["What is AWS DataSync?", "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"]
    ]
  },

  c6b: {
    k: [
      "A gateway endpoint (Amazon S3 and DynamoDB) is a route in the subnet's route table and has no additional charge. It works only from inside its VPC: not from on premises, not from a peered VPC in another Region, not through a transit gateway.",
      "An interface endpoint is a network interface in your subnet with its own security group. Because it has private IP addresses in the VPC, on-premises applications can reach it over VPN or Direct Connect; that is how they reach S3 privately.",
      "An endpoint policy controls which principals can use the endpoint to reach the service; it does not override or replace identity-based or resource-based policies, so a bucket policy still applies.",
      "VPC peering is a one-to-one link with no transitive routing, and it cannot be created when the CIDR blocks overlap. It works across accounts and Regions, costs nothing to create, and needs routes in the route tables of both VPCs.",
      "Choose by what must be shared. Two networks talking in both directions: peering. One service offered to many VPCs, where only consumers initiate connections and IP ranges may overlap: a PrivateLink endpoint service behind a Network Load Balancer."
    ],
    trap: "Peering gives no edge-to-edge routing: resources in VPC B cannot use VPC A's internet gateway or NAT device. A security group rule can reference a peer VPC's security group only in the same Region; for another Region use the peer's CIDR block.",
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"]
    ]
  },

  c6c: {
    k: [
      "A Site-to-Site VPN connection is IPsec with two tunnels; configure both, because traffic moves to the other tunnel when one is down for maintenance. On the AWS side it ends on a virtual private gateway (a single VPC) or a transit gateway.",
      "Direct Connect is an Ethernet fiber link to a Direct Connect location that bypasses internet service providers. A dedicated connection is a port for one customer (1, 10, 100 or 400 Gbps); a hosted connection comes from a partner (50 Mbps to 25 Gbps).",
      "The virtual interface decides what the link reaches: private for a VPC, public for all public AWS services such as S3, transit for transit gateways. A Direct Connect gateway is a global resource: one connection reaches any Region except the China Regions.",
      "Direct Connect does not encrypt traffic in transit by default. Combine it with a Site-to-Site VPN for an IPsec-encrypted private connection, or use MACsec, layer 2 encryption on 10, 100 and 400 Gbps dedicated connections, not on hosted ones.",
      "A transit gateway is a network transit hub that interconnects VPCs and on-premises networks. Additional route tables isolate subsets of attachments, and transit gateways in different Regions can be peered."
    ],
    trap: "Two connections at one Direct Connect location survive a device failure but not the loss of the location. Maximum resiliency is separate connections on separate devices in more than one location. A VPN is the cheap backup path.",
    docs: [
      ["Direct Connect dedicated and hosted connections", "https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithConnections.html"],
      ["Site-to-Site VPN tunnel options", "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPNTunnels.html"],
      ["Direct Connect resiliency recommendations", "https://aws.amazon.com/directconnect/resiliency-recommendation/"]
    ]
  },

  c6d: {
    k: [
      "AWS DMS migrates a database while the source stays fully operational: a full load copies the existing data, then change data capture (CDC) replicates ongoing changes until you switch over to the target.",
      "Moving to a different database engine (for example Oracle to Aurora PostgreSQL) first needs the schema and code objects converted, with DMS Schema Conversion or the AWS Schema Conversion Tool. The same engine on both sides needs no conversion.",
      "AWS Snowball Edge is no longer available to new customers (since 7 November 2025), and support for Snowball devices ends in all commercial Regions on 31 December 2026. AWS points to DataSync for online and Data Transfer Terminal for physical transfer.",
      "The exam guide still lists AWS Snow Family, although the devices are no longer offered to new customers. The idea to keep: a rugged device shipped by carrier moves data faster than the internet could; for edge computing AWS now names Outposts.",
      "AWS Outposts is AWS compute and storage capacity at your site, operated by AWS as part of a Region and used through the same APIs. Choose it for low latency to on-premises systems, local data processing or data residency."
    ],
    trap: "An Outpost is not AWS without the network: it is designed for a constant connection to its Region and is homed to one Availability Zone there. AWS has discontinued sales of the 1U and 2U Outposts servers; the offering is Outposts racks.",
    docs: [
      ["What is AWS Database Migration Service?", "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html"],
      ["AWS Snowball Edge availability change", "https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html"],
      ["What is AWS Outposts?", "https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html"]
    ]
  },

  c6e: {
    k: [
      "Consolidated billing in AWS Organizations gives one bill and combines usage across accounts, which shares volume pricing discounts, Reserved Instance discounts and Savings Plans. It is offered at no additional cost.",
      "Share network resources across accounts instead of building them twice. AWS RAM shares a resource with other accounts or a whole organization; with VPC subnet sharing, participant accounts create their resources in a centrally managed VPC.",
      "Cost tool by question: Cost Explorer shows up to the last 13 months and forecasts spend. Budgets alerts on actual and forecasted spend and can apply an IAM policy or SCP. Cost and Usage Reports (now CUR 2.0 in Data Exports) are the most detailed data, in S3.",
      "A transit gateway bills each attachment by the hour plus a data processing charge per gigabyte. A VPC peering connection costs nothing to create, and data that stays within one Availability Zone over it is free.",
      "The hybrid design by requirement: encrypted and over the internet, a VPN; a dedicated link that bypasses the internet, Direct Connect; many VPCs behind one hub, a transit gateway; NFS or SMB onto S3, a file gateway; bulk copy, DataSync."
    ],
    trap: "A managed service gives up control for less operational work. 'Least operational overhead' points to the managed option unless the stem demands something only the lower-level option gives, such as an on-premises protocol or data that must stay on site.",
    docs: [
      ["Consolidated billing for AWS Organizations", "https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html"],
      ["What is AWS Resource Access Manager?", "https://docs.aws.amazon.com/ram/latest/userguide/what-is.html"],
      ["AWS Transit Gateway pricing", "https://aws.amazon.com/transit-gateway/pricing/"]
    ]
  },

  l6a: {
    k: [
      "A peering connection carries nothing until the owner of the accepter VPC accepts the request and each VPC has a route to the other's CIDR block in its route tables.",
      "A route does not have to cover the whole peer VPC. Routing only to a subnet's CIDR block restricts access to that subnet of the peer, which is what a subnet-specific peering configuration means.",
      "Security groups still decide what gets through. In the same Region a rule can reference a security group of the peer VPC; for a peer VPC in a different Region you use its CIDR block instead.",
      "Creating a peering connection is free, and so is data that stays within one Availability Zone, even between accounts. Data transfer is charged when it crosses Availability Zones or Regions."
    ],
    trap: "Transitive peering is not supported: with A peered to B and to C, VPC A cannot act as a transit point between B and C. B and C need their own peering connection, and many VPCs that must all reach each other call for a transit gateway.",
    docs: [
      ["What is VPC peering?", "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"],
      ["VPC peering configurations with specific routes", "https://docs.aws.amazon.com/vpc/latest/peering/peering-configurations-partial-access.html"]
    ]
  },

  l6b: {
    k: [
      "A partner arriving over Site-to-Site VPN cannot use an S3 gateway endpoint, because endpoint connections cannot be extended out of a VPC. An S3 interface endpoint is reachable from on premises over VPN and Direct Connect.",
      "The other half is DNS. An inbound Resolver endpoint allows DNS queries to your VPC from an on-premises network, so names that resolve only inside the VPC can be resolved from outside AWS.",
      "The opposite direction is an outbound Resolver endpoint with forwarding rules: one rule per domain name, forwarding queries for that domain from the VPC to an on-premises DNS resolver.",
      "A private hosted zone answers DNS queries for a domain only within the VPCs you associate with it; a client outside those VPCs, such as on premises, gets the answer only through an inbound Resolver endpoint."
    ],
    trap: "For private access to S3 from outside the VPC, the gateway endpoint is the cheap but wrong answer: it has no additional charge, yet it serves only resources inside the VPC. The interface endpoint is the one with private addresses to connect to.",
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["What is Route 53 VPC Resolver?", "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html"]
    ]
  }
});
