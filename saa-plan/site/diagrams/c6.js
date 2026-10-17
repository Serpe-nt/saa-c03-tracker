// DATA ONLY: the diagram for lecture course 6 and its labs (format: site/diagram.js, rules: docs/diagrams.md).
window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.c6 = {
  title: "A data center joined to several VPCs through a transit gateway",
  why: "A company's own data center and its VPCs are separate networks, yet servers, files and DNS names must work across them. Here an encrypted VPN over the internet and a Direct Connect link both reach one transit gateway, the hub for the VPCs. Endpoints and gateways then give the data center S3, private DNS names and file storage in AWS.",
  w: 22, h: 13.6,
  areas: [
    { id: "onprem", label: "Corporate data center", x: 0.3, y: 0.5, w: 5.6, h: 12.8, kind: "onprem" },
    { id: "region", label: "AWS Region", x: 9.6, y: 0.3, w: 12.1, h: 10.7 },
    { id: "vpc-shared", label: "Shared services VPC", x: 10.0, y: 0.9, w: 8.3, h: 3.4 },
    { id: "vpc-app", label: "Application VPC", x: 14.2, y: 4.9, w: 7.2, h: 2.5 },
    { id: "vpc-peer", label: "Peered VPC", x: 14.2, y: 8.2, w: 7.2, h: 2.4 }
  ],
  nodes: [
    { id: "dns", label: "DNS server", x: 0.8, y: 1.3, w: 4.6, h: 1.2 },
    { id: "router", label: "On-premises router", x: 0.8, y: 5.4, w: 4.6, h: 1.3 },
    { id: "filegw", label: "S3 File Gateway", x: 0.8, y: 8.6, w: 3.8, h: 1.2 },
    { id: "datasync", label: "DataSync agent", x: 0.8, y: 11.0, w: 3.8, h: 1.2 },
    { id: "dxloc", label: "Direct Connect location", x: 6.3, y: 11.6, w: 2.9, h: 1.3 },
    { id: "dxgw", label: "Direct Connect gateway", x: 10.9, y: 11.6, w: 3.2, h: 1.3 },
    { id: "tgw", label: "Transit gateway", x: 10.1, y: 5.4, w: 3.2, h: 1.6 },
    { id: "resolver", label: "Resolver endpoints", x: 10.4, y: 1.6, w: 3.6, h: 1.3 },
    { id: "s3ep", label: "S3 interface endpoint", x: 14.5, y: 1.6, w: 3.4, h: 1.3 },
    { id: "s3", label: "Amazon S3", x: 18.8, y: 1.6, w: 2.6, h: 1.3 },
    { id: "pcx", label: "VPC peering connection", x: 17.0, y: 6.9, w: 3.6, h: 1.8 }
  ],
  links: [
    ["dns", "resolver", "DNS queries"],
    ["router", "tgw", "Site-to-Site VPN"],
    ["router", "dxloc"],
    ["dxloc", "dxgw", "transit VIF"],
    ["dxgw", "tgw", "association"],
    ["tgw", "vpc-shared"],
    ["tgw", "vpc-app"],
    ["s3ep", "s3"]
  ],
  parts: {
    router: {
      name: "Site-to-Site VPN",
      why: "A data center already has an internet connection, and joining it to AWS should not wait for a new line. A Site-to-Site VPN connection uses that internet connection for encrypted IPsec tunnels between this router and AWS.",
      k: [
        ["Two tunnels", "Each connection has two tunnels. Configure both, because traffic moves to the other tunnel when one is down for maintenance."],
        ["Where it ends on AWS", "On a virtual private gateway for a single VPC, or on a transit gateway to reach many VPCs."],
        ["Customer gateway", "AWS calls the device on your side, hardware or software, the customer gateway device. A customer gateway resource in AWS describes it."]
      ],
      trap: "A VPN travels over the internet. A link that must bypass the internet is Direct Connect, and a VPN is a common backup path for it.",
      tags: ["Hybrid connectivity"]
    },
    dxloc: {
      name: "AWS Direct Connect",
      why: "Some traffic must not cross the public internet at all. Direct Connect is an Ethernet fiber link from your network to a Direct Connect location, bypassing internet service providers.",
      k: [
        ["Dedicated or hosted", "A dedicated connection is a port for one customer at 1, 10, 100 or 400 Gbps. A hosted connection comes from a partner, from 50 Mbps to 25 Gbps."],
        ["Not encrypted by default", "Run a Site-to-Site VPN over it for IPsec. Or use MACsec, on 10, 100 and 400 Gbps dedicated connections, not on hosted ones."],
        ["Virtual interfaces", "They decide what the link reaches: private for a VPC, public for public AWS services such as S3, transit for transit gateways."]
      ],
      trap: "Two connections at one Direct Connect location survive a device failure but not the loss of the location. Maximum resiliency means separate connections on separate devices in more than one location.",
      tags: ["Hybrid connectivity"]
    },
    dxgw: {
      name: "Direct Connect gateway",
      why: "One Direct Connect link should reach VPCs in more than one Region without a new link each time. A Direct Connect gateway is a global resource: one connection reaches any Region except the China Regions.",
      k: [
        ["To a transit gateway", "A transit virtual interface attaches to the Direct Connect gateway, and the gateway is associated with the transit gateway. One connection then serves many VPCs."],
        ["Private or transit", "A private virtual interface reaches a VPC. A transit virtual interface reaches transit gateways."]
      ],
      tags: ["Hybrid connectivity"]
    },
    tgw: {
      name: "AWS Transit Gateway",
      why: "Peering every VPC with every other one, plus a link to the data center for each, becomes a tangle. A transit gateway is the hub that interconnects VPCs and on-premises networks.",
      k: [
        ["Attachments", "VPCs, VPN connections and Direct Connect gateways attach to it once and reach each other through it."],
        ["Route tables", "Additional route tables isolate subsets of attachments. Transit gateways in different Regions can be peered."],
        ["Cost", "Each attachment is billed by the hour, plus a data processing charge per gigabyte."]
      ],
      trap: "VPC peering has no transitive routing, so many VPCs that must all reach each other call for a transit gateway. A single peering connection, by contrast, costs nothing to create.",
      tags: ["VPC peering & Transit Gateway", "Hybrid connectivity"]
    },
    pcx: {
      name: "VPC peering connection",
      why: "Two VPCs are isolated networks until you connect them. A peering connection is a one-to-one link that lets them route traffic to each other, also across accounts and Regions.",
      k: [
        ["Before a packet passes", "The owner of the accepter VPC accepts the request, and each VPC gets a route to the other's CIDR block. Security groups still decide what gets through."],
        ["No overlap", "A peering connection cannot be created when the CIDR blocks overlap."],
        ["Cost", "Creating one is free, and so is data that stays within one Availability Zone. Data that crosses zones or Regions is charged."]
      ],
      trap: "Peering is not transitive. If one VPC has a VPN or Direct Connect connection to the data center, a VPC peered with it cannot use that connection to reach the data center.",
      tags: ["VPC peering & Transit Gateway"]
    },
    resolver: {
      name: "Route 53 VPC Resolver endpoints",
      why: "Names in a private hosted zone are answered only inside the VPCs associated with it, and the data center has its own DNS. Resolver endpoints carry DNS queries between the two networks.",
      k: [
        ["Inbound endpoint", "Allows DNS queries to your VPC from the on-premises network, so names that resolve only inside the VPC can be resolved from the data center."],
        ["Outbound endpoint", "Works with forwarding rules, one per domain name. It forwards queries for that domain from the VPC to the on-premises DNS server."],
        ["New name", "Route 53 Resolver is now called Route 53 VPC Resolver. The endpoints are still called Resolver endpoints."]
      ],
      trap: "A private hosted zone does not answer clients outside its VPCs. A data center gets those answers only through an inbound Resolver endpoint.",
      tags: ["Route 53", "Hybrid connectivity"]
    },
    s3ep: {
      name: "S3 interface endpoint",
      why: "Servers in the data center need S3 without a path over the public internet. An interface endpoint is a network interface with private IP addresses in your VPC, so they reach it over the VPN or Direct Connect.",
      k: [
        ["Gateway endpoint", "Also reaches S3 privately and has no additional charge. But it works only from inside its VPC: not from on premises, from a peered VPC in another Region or through a transit gateway."],
        ["Endpoint policy", "Controls which principals can use the endpoint to reach the service. It does not replace identity-based or resource-based policies, so a bucket policy still applies."],
        ["Security group", "An interface endpoint has a security group of its own, which decides who may connect to it."]
      ],
      trap: "For private access to S3 from outside the VPC, the gateway endpoint is the cheap but wrong answer. The interface endpoint is the one with private addresses to connect to.",
      tags: ["VPC endpoints & PrivateLink", "Hybrid connectivity"]
    },
    filegw: {
      name: "Amazon S3 File Gateway",
      why: "Applications in the data center still read and write files over NFS or SMB, and rewriting them all is not realistic. S3 File Gateway keeps those file shares on site and stores the files as objects in S3.",
      k: [
        ["Runs on site", "A virtual machine on VMware ESXi, Hyper-V, KVM or Nutanix AHV, or a hardware appliance. Writes land in a local cache first and go to S3 asynchronously."],
        ["Other gateways", "Volume Gateway offers iSCSI volumes, cached or stored on site. Tape Gateway offers virtual tapes archived to S3 Glacier storage classes."],
        ["FSx File Gateway", "No longer available to new customers. SMB shares in AWS now mean FSx for Windows File Server itself."]
      ],
      trap: "Ongoing file access from the data center is a gateway. A one-time or scheduled copy is DataSync. A database is AWS DMS.",
      tags: ["Storage Gateway", "Hybrid connectivity"]
    },
    datasync: {
      name: "AWS DataSync agent",
      why: "Copying many files to AWS by script is slow, and nobody checks that every file arrived intact. DataSync copies files and objects for you, and its agent runs next to the storage in the data center.",
      k: [
        ["Agent", "Deploy it as a VMware, KVM or Hyper-V virtual machine in your data center, as close to the storage as possible. It reads from NFS, SMB, HDFS or object storage."],
        ["Transfers", "To S3, EFS or FSx. Data is encrypted in transit and checked for integrity, and later runs transfer only what changed."],
        ["Bandwidth limit", "Can be set, so that a transfer leaves room on the link for other traffic."]
      ],
      trap: "DataSync moves data, it does not serve it. Users who keep working on the files from the data center need a file gateway.",
      tags: ["Migration & transfer"]
    }
  }
};
