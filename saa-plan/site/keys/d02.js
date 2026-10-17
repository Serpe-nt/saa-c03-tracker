// Key points for the plan steps whose id starts with d2 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d2b1: {
    head: "Build a VPC with public and private subnets",
    why: "Your database server must never be reachable from the internet, yet it still has to download its security updates. In one flat network, every server that can reach out can also be reached. You need a network where some servers face the internet and others can only reach out.",
    idea: "The \"VPC and more\" wizard builds that in one go, across two Availability Zones. Public subnets route to an internet gateway. Private subnets reach out through a NAT gateway that sits in a public subnet.",
    do: [
      "VPC → <b>Create VPC</b> → <b>VPC and more</b>. Keep name tag auto-generation on and give it a name, for example <code>lab</code>.",
      "<b>Number of Availability Zones</b>: 2. <b>Number of public subnets</b>: 2. <b>Number of private subnets</b>: 2.",
      "<b>NAT gateways</b>: <b>In 1 AZ</b>. Leave the rest as it is, look at the <b>Preview</b>, then <b>Create VPC</b>.",
      "Open each item it created (subnets, route tables, internet gateway, NAT gateway) and work out why it exists. The VPC's <b>Resource map</b> tab draws them together."
    ],
    done: "The Resource map shows your four subnets, the route tables, the internet gateway and the NAT gateway, with the traffic between them drawn as lines.",
    k: [
      ["Two kinds of route table", "The public route table sends <code>0.0.0.0/0</code> to the internet gateway. The private ones send it to the NAT gateway, which sits in a public subnet with an Elastic IP address."],
      ["NAT only lets traffic out", "A NAT gateway serves only connections started from inside the VPC. Users reach private instances through an internet-facing load balancer, whose targets need no public addresses."],
      ["One NAT gateway can fail them all", "One zonal NAT gateway is a single point of failure for every AZ that routes to it. The resilient zonal design is a NAT gateway per AZ, each with its own private route table."],
      ["The regional NAT gateway", "The newer mode: one resource that expands across AZs by itself and needs no public subnet. Zonal NAT gateways remain, and a zonal public one works only from a public subnet."],
      ["NAT gateway or NAT instance", "A NAT gateway is managed by AWS, scales its bandwidth by itself and is redundant inside its AZ. A NAT instance is an EC2 instance you patch, size and fail over yourself. NAT gateways take no security group."]
    ],
    trap: "Three designs look private but are not isolated: a subnet that still routes to the NAT gateway, a public subnet whose instances lack public IPs, and a NACL that blocks one port. No internet path at all means a route table with no route to an internet gateway or a NAT gateway.",
    q: {
      q: "A team moves its web servers into private subnets that reach out through a NAT gateway. Now customers can't open the site at all. What lets customers in while the servers stay private?",
      o: [
        "An internet-facing load balancer in the public subnets, with the private servers as its targets",
        "A second NAT gateway, so that traffic can come in through one of them",
        "A route from the private subnets straight to the internet gateway",
        "Public IP addresses on the servers, while they stay in the private subnets"
      ],
      a: [0],
      x: [
        "Right. A NAT gateway only lets connections out. Customers come in through an internet-facing load balancer, whose targets need no public addresses.",
        "A NAT gateway serves only connections started from inside the VPC, however many there are.",
        "A route to the internet gateway makes those subnets public, which is what the team wanted to avoid.",
        "Without a route to an internet gateway, a public address can't be reached. Adding that route makes the subnet public."
      ],
      dom: 1, tags: ["Internet & NAT gateways", "Load balancing"], doc: "nat"
    },
    docs: [
      ["Create a VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html"],
      ["NAT gateway basics", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html"],
      ["Regional NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html"]
    ]
  },

  d2b2: {
    head: "Launch a server that nothing outside can reach",
    why: "A server with a public address and an open SSH port is found by scanners within hours of starting. Yet you still have to log in to manage it. You need a server with no public address and no key that you can still manage.",
    idea: "AWS Systems Manager manages an instance through an agent that connects out to the service. Give the instance a role that allows it and a path out, and it needs no inbound connection at all.",
    do: [
      "IAM → <b>Roles</b> → <b>Create role</b> → <b>AWS service</b>, use case <b>EC2</b> → attach <code>AmazonSSMManagedInstanceCore</code> → name it, for example <code>lab-ssm</code>.",
      "EC2 → <b>Launch instance</b>: Amazon Linux, <b>t3.micro</b>. Key pair: <b>Proceed without a key pair</b>.",
      "<b>Network settings</b>: your new VPC, a <b>private</b> subnet, <b>Auto-assign public IP</b>: Disable. Let it create a security group, and remove the SSH rule it adds.",
      "<b>Advanced details</b> → <b>IAM instance profile</b>: your role → <b>Launch instance</b>."
    ],
    done: "The instance runs with a private IP address and no public one. Once its agent has reached the service, it appears as a managed node in Systems Manager.",
    k: [
      ["Three things the instance needs", "SSM Agent, already installed on Amazon Linux 2023. IAM permissions. And outbound HTTPS to the Systems Manager endpoints. If one is missing, the instance never appears in Systems Manager."],
      ["The role gives the permission", "By default Systems Manager may not act on your instances. The role with <code>AmazonSSMManagedInstanceCore</code>, attached through the instance profile, grants it. Default Host Management Configuration is the account-wide alternative."],
      ["No inbound rule at all", "The security group needs no inbound rule, not even port 22. SSM Agent starts every connection itself, outbound on port 443."]
    ],
    trap: "A public IP address, a key pair or an inbound SSH rule is never the missing piece for Session Manager. When a private instance does not show up as managed, check the instance profile and the outbound path to Systems Manager.",
    q: {
      q: "A private instance will be managed only through Systems Manager. Which inbound rules does its security group need?",
      o: [
        "None: SSM Agent starts every connection itself, outbound on port 443",
        "Port 22 from the Systems Manager service",
        "Port 443 from anywhere, so the service can reach the agent",
        "Port 22 from the subnet of the NAT gateway"
      ],
      a: [0],
      x: [
        "Right. The agent connects out to Systems Manager, so the instance needs no inbound rule, not even port 22.",
        "Systems Manager doesn't use SSH, and nothing connects in to the instance.",
        "Port 443 matters outbound, from the agent to the service. No inbound rule is needed.",
        "The NAT gateway only carries the agent's outbound traffic. Nothing comes in through port 22."
      ],
      dom: 1, tags: ["Instance access"], doc: "session-manager"
    },
    docs: [
      ["Configure instance permissions for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-permissions.html"],
      ["Launch an EC2 instance: configuration parameters", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-launch-parameters.html"],
      ["AMIs with SSM Agent preinstalled", "https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html"]
    ]
  },

  d2b3: {
    head: "Open a shell with no SSH, no key and no open port",
    why: "To reach private servers, companies used to run a bastion host: a machine open to the internet on port 22, with SSH keys someone had to guard. Each of those is one more thing to attack or to lose. You need a shell on a private server without any of them.",
    idea: "Session Manager gives you that shell over the agent's own outbound connection. IAM decides who may start a session, and CloudTrail records the calls.",
    do: [
      "EC2 → select the instance → <b>Connect</b> → <b>Session Manager</b> → <b>Connect</b>.",
      "Run <code>whoami</code>. It works with no SSH and no public IP, because the instance reaches AWS through the NAT gateway."
    ],
    done: "A shell opens and <code>whoami</code> answers <code>ssm-user</code>, the user a Session Manager session starts as.",
    k: [
      ["It replaces the bastion host", "Session Manager needs no open inbound ports and no SSH keys to manage. Access is granted through IAM policies, and the API calls are recorded by CloudTrail."],
      ["Session logging", "The feature behind 'keep a record of every session'. A session's content can be logged to an S3 bucket or a CloudWatch Logs log group, optionally encrypted with a KMS key."],
      ["Without a NAT or internet gateway", "The agent can reach Systems Manager through interface endpoints for <code>ssm</code> and <code>ssmmessages</code> (older agents also use <code>ec2messages</code>). Gateway endpoints exist only for S3 and DynamoDB."],
      ["The endpoints' own security group", "Those interface endpoints have a security group of their own. It must allow inbound port 443 from the subnets of the managed instances."]
    ],
    trap: "Hardening a bastion still leaves port 22 open and keys to manage. That holds for moving it behind a VPN, narrowing the source range and rotating keys in Secrets Manager. No inbound ports, no keys, IAM control and session logs together mean Session Manager.",
    q: {
      q: "Auditors want a record of every command typed on a fleet of private instances. The security team refuses to open port 22 anywhere. What meets both?",
      o: [
        "Session Manager, with session logging to an S3 bucket or CloudWatch Logs",
        "A bastion host in a public subnet, with its SSH keys rotated through Secrets Manager",
        "SSH over a VPN, with the source range narrowed to the office",
        "AWS Config rules that record each instance's settings"
      ],
      a: [0],
      x: [
        "Right. Session Manager needs no inbound port, and session logging keeps the content of every session.",
        "A bastion still needs port 22 open and keys to manage, however well the keys are rotated.",
        "A VPN narrows who can reach port 22, but the port is still open.",
        "Config records how resources are configured, not what someone typed in a shell."
      ],
      dom: 1, tags: ["Instance access"], doc: "session-manager"
    },
    docs: [
      ["AWS Systems Manager Session Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html"],
      ["Start a session", "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html"],
      ["VPC endpoints for Systems Manager", "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc.html"]
    ]
  },

  d2b4: {
    head: "Break the network ACL and watch the session fail",
    why: "A connection fails, and from the outside it looks the same whichever firewall stopped it. You check the security group, see that it allows the traffic, and are stuck. You need to see for yourself that the subnet's firewall works apart from the instance's, and forgets every connection.",
    idea: "A network ACL filters every packet that enters or leaves the subnet, and it is stateless. Take away its outbound allow rule, and the agent's traffic can't leave the subnet, whatever the security group allows.",
    do: [
      "VPC → <b>Subnets</b> → your private subnet → <b>Network ACL</b> tab → open its network ACL. Note which subnets use it: the change hits all of them.",
      "<b>Outbound rules</b>: remove the allow rule (on a default network ACL, rule 100, All traffic) and save. Only the final <code>*</code> rule, which denies, is left.",
      "Start a new Session Manager session and watch it fail. Security groups remember connections (stateful); network ACLs don't (stateless).",
      "Restore the rule: rule 100, All traffic, destination <code>0.0.0.0/0</code>, Allow. Start a session again."
    ],
    done: "Without the outbound rule, Session Manager can't connect. With the rule back, a new session works again.",
    k: [
      ["Why the session fails", "The agent's outbound HTTPS now matches no numbered rule and falls to the final deny. The security group still allows it, which shows that both layers must pass the traffic."],
      ["Replies go to ephemeral ports", "A rule matches the port a packet goes to. A web server's replies go to the client's ephemeral port, so serving HTTPS needs inbound 443 plus outbound 1024-65535, not outbound 443."],
      ["Only at the subnet's edge", "Network ACL rules are checked only when traffic enters or leaves the subnet, never between instances inside the same subnet."],
      ["VPC Flow Logs show the drops", "Each record carries an <code>ACCEPT</code> or <code>REJECT</code> action, with no agent needed. Flow logs go to CloudWatch Logs, Amazon S3 or Data Firehose, and logs in S3 can be queried with Athena."]
    ],
    trap: "CloudTrail records API activity, and AWS Config records how a resource's configuration changed. Neither shows dropped packets. When the security group allows the traffic and it still fails, check the network ACL rule for the reply direction.",
    q: {
      q: "Connections to a private instance fail, and you suspect that a firewall dropped them. Which AWS feature shows, with no agent on the instance, whether the packets were accepted or rejected?",
      o: [
        "VPC Flow Logs, whose records carry an ACCEPT or REJECT action",
        "AWS CloudTrail, which records every API call in the account",
        "AWS Config, which records how each resource's configuration changed",
        "Session Manager's session logs in an S3 bucket"
      ],
      a: [0],
      x: [
        "Right. Flow logs record the traffic itself, with the action taken on it, and need no agent.",
        "CloudTrail records API activity, such as someone changing a rule. It doesn't show packets.",
        "Config shows how a network ACL or security group was configured, not which packets were dropped.",
        "Session logs keep what was typed in a session. A dropped connection never opens one."
      ],
      dom: 1, tags: ["Security groups & NACLs"], doc: "vpc"
    },
    docs: [
      ["Network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html"],
      ["Default network ACL", "https://docs.aws.amazon.com/vpc/latest/userguide/default-network-acl.html"],
      ["VPC Flow Logs", "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html"]
    ]
  },

  d2b5: {
    head: "Clean up the VPC build in the right order",
    why: "The build is done and you close the console. The NAT gateway keeps billing every hour it exists, and the Elastic IP address beside it keeps billing too. You need to remove everything that costs money, in an order that lets each delete succeed.",
    idea: "Delete from the top down: the instance, then the NAT gateway, then the Elastic IP it leaves behind, then the VPC. The console deletes the VPC's subnets, route tables and gateways along with it.",
    do: [
      "EC2 → <b>Instances</b> → your instance → terminate it.",
      "VPC → <b>NAT gateways</b> → select it → <b>Actions</b> → <b>Delete NAT gateway</b> → type <code>delete</code>. Wait until it shows as deleted.",
      "EC2 → <b>Elastic IPs</b> → select the address → <b>Actions</b> → <b>Release Elastic IP addresses</b> → <b>Release</b>. It can be released only once nothing uses it.",
      "VPC → <b>Your VPCs</b> → select your VPC → <b>Actions</b> → <b>Delete VPC</b> → type <code>delete</code>. Its subnets, route tables, internet gateway and security groups go with it.",
      "IAM → <b>Roles</b> → tick the role from the launch, for example <code>lab-ssm</code> → <b>Delete</b> → type its name → <b>Delete</b>. The console removes its instance profile with it."
    ],
    done: "Your VPCs no longer lists your VPC, Elastic IPs is empty, and Roles no longer lists the role. The deleted NAT gateway stays visible for about an hour, then disappears by itself.",
    k: [
      ["NAT gateway billing", "A NAT gateway is billed for every hour it is provisioned, and a partial hour counts as a full one. On top comes a charge for each GB it processes, besides normal data transfer."],
      ["Why release is its own step", "Deleting the NAT gateway only disassociates its Elastic IP. The address stays allocated to your account, and keeps being charged, until you release it."],
      ["Every public IPv4 address costs", "AWS charges for each public IPv4 address, in use or idle. Use an Elastic IP when an address must stay fixed. Otherwise keep instances private behind a load balancer."],
      ["Blackhole routes", "Routes that pointed at a deleted NAT gateway stay in their route table with a blackhole status until you delete or update them."]
    ],
    trap: "Cost questions hide idle resources: unattached Elastic IPs and a forgotten NAT gateway bill by the hour with no traffic. Replacing auto-assigned public IPs with Elastic IPs saves nothing, because AWS charges for both.",
    q: {
      q: "You deleted a NAT gateway last week, but the bill still shows an hourly charge for a public IPv4 address. Why?",
      o: [
        "Deleting the NAT gateway only disassociated its Elastic IP, which stays allocated and billed until you release it",
        "A deleted NAT gateway is billed for one more week",
        "The route that pointed at the NAT gateway is billed while it shows as blackhole",
        "AWS charges for public IPv4 addresses only once they are released"
      ],
      a: [0],
      x: [
        "Right. Release the Elastic IP in the EC2 console. Until then it stays in your account and is charged like any public IPv4 address.",
        "A NAT gateway is billed for the hours it is provisioned. Once deleted, it stops billing.",
        "A blackhole route is an entry in a route table. It costs nothing, though it should be cleaned up.",
        "It is the other way round: an address you hold is charged, in use or idle, until you release it."
      ],
      dom: 4, tags: ["Internet & NAT gateways", "Data transfer costs"], doc: "eip"
    },
    docs: [
      ["Work with NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-working-with.html"],
      ["Release an Elastic IP address", "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing-eips-releasing.html"],
      ["Delete your VPC", "https://docs.aws.amazon.com/vpc/latest/userguide/delete-vpc.html"]
    ]
  },

  d2c1: {
    head: "Security group or network ACL",
    why: "One IP address is flooding your site with requests. You open the security group to block it and find there is no way to write a deny rule. A network needs two kinds of control, and you must know which one can do what.",
    idea: "A security group guards an instance: allow rules only, and it remembers connections. A network ACL guards a whole subnet as an extra layer: numbered allow and deny rules, and no memory of connections. Traffic must pass both, as today's build showed.",
    trap: "Deleting a security group's outbound rules does not break replies to allowed inbound requests. The same change on a network ACL does. A network ACL deny works only with a lower rule number than the allow it must beat, and a network ACL cannot reference a security group.",
    q: {
      q: "To block an attacker, you add rule 200 to a subnet's network ACL: deny all traffic from 198.51.100.7. Rule 100 allows inbound HTTP from <code>0.0.0.0/0</code>. The attacker's HTTP requests still get through. Why?",
      o: [
        "Rules are checked in number order and the first match wins, so rule 100 allows the requests before rule 200 is reached",
        "Network ACLs cannot deny traffic, only allow it",
        "The deny must be added to the instance's security group as well",
        "Network ACL changes take effect only for new subnets"
      ],
      a: [0],
      x: [
        "Right. Give the deny a lower number than the allow it must beat, for example 90.",
        "Network ACLs have both allow and deny rules. It is security groups that have allow rules only.",
        "Security groups can't deny at all. The network ACL is the right place, with the right rule number.",
        "A network ACL's rules apply to every subnet associated with it, old or new."
      ],
      dom: 1, tags: ["Security groups & NACLs"], doc: "vpc"
    },
    docs: [
      ["Compare security groups and network ACLs", "https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html"],
      ["Security group rules", "https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html"],
      ["Network ACL rules", "https://docs.aws.amazon.com/vpc/latest/userguide/nacl-rules.html"]
    ]
  },

  d2c2: {
    head: "VPC peering or a transit gateway",
    why: "A company joins its VPCs one pair at a time. At 15 VPCs that is over a hundred connections, each with its own routes, and still no VPC can reach the office VPN through another. A few VPCs need a direct link, and many need a hub.",
    idea: "VPC peering joins two VPCs directly, and routes nothing onward to a third. A transit gateway is a Regional hub that routes between many VPCs and on-premises connections.",
    trap: "Two look-alike hubs are not hubs. A virtual private gateway attaches to a single VPC. A Direct Connect gateway as a rule does not let the VPCs associated with it send traffic to each other. Many VPCs sharing one VPN, or routing through each other, need a transit gateway.",
    q: {
      q: "A company associates five VPCs with one Direct Connect gateway and expects them to reach each other through it. They can't. What should connect the five VPCs to each other?",
      o: [
        "A transit gateway, because a Direct Connect gateway as a rule doesn't route between its VPCs",
        "A virtual private gateway shared by the five VPCs",
        "A second Direct Connect gateway, one for each direction",
        "Routes in each VPC that point the others' ranges at the Direct Connect gateway"
      ],
      a: [0],
      x: [
        "Right. A transit gateway is the Regional hub that routes between many VPCs. A Direct Connect gateway joins VPCs to the on-premises link, not to each other.",
        "A virtual private gateway attaches to a single VPC, so it can't be a hub for five.",
        "More Direct Connect gateways don't change what they do: they don't pass traffic between their VPCs.",
        "Routes can't make the Direct Connect gateway forward traffic it doesn't carry between VPCs."
      ],
      dom: 2, tags: ["VPC peering & Transit Gateway"], doc: "tgw"
    },
    docs: [
      ["What is AWS Transit Gateway?", "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html"],
      ["How VPC peering connections work", "https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html"],
      ["Direct Connect gateways", "https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html"]
    ]
  },

  d2c3: {
    head: "Gateway endpoint or interface endpoint",
    why: "Private instances upload terabytes to S3 through a NAT gateway, and the NAT gateway charges for every gigabyte it processes. They don't need the internet at all, only S3. Private resources need a private door to AWS services, with no internet gateway or NAT device in the path.",
    idea: "A VPC endpoint is that door. A gateway endpoint serves S3 and DynamoDB as a target in your route table. An interface endpoint is a network interface in your subnet, for most services, and it can be reached from outside the VPC too.",
    k: [
      ["Two policies, two directions", "An endpoint policy limits what the VPC may reach through the endpoint (only our buckets). A bucket policy with <code>aws:sourceVpce</code> limits who may reach the bucket (only this endpoint)."],
      ["Your own service on PrivateLink", "Your own service behind a Network Load Balancer can be published as a PrivateLink endpoint service. Only consumers start connections, through an interface endpoint in their VPC, and overlapping CIDR blocks are no problem."]
    ],
    trap: "A timeout to an interface endpoint usually means its security group does not allow inbound 443 from the client, not a missing route. The endpoint is a network interface in your own subnet. A gateway endpoint, by contrast, is a target in the subnet's route table.",
    q: {
      q: "Instances call an AWS service through a new interface endpoint in their subnet, and every call times out. The route tables have not changed. What is the most likely cause?",
      o: [
        "The endpoint's security group does not allow inbound 443 from the instances",
        "The route table lacks a route to the endpoint's prefix list",
        "Interface endpoints work only for S3 and DynamoDB",
        "The instances need public IP addresses to use the endpoint"
      ],
      a: [0],
      x: [
        "Right. An interface endpoint is a network interface in your subnet, guarded by its own security group, which must allow inbound 443 from the callers.",
        "A prefix list in the route table is how a gateway endpoint works. An interface endpoint needs no route of its own.",
        "That describes gateway endpoints. Interface endpoints cover most AWS services.",
        "The point of an endpoint is private access. The instances reach it on their private addresses."
      ],
      dom: 1, tags: ["VPC endpoints & PrivateLink"], doc: "endpoints"
    },
    docs: [
      ["Gateway endpoints for Amazon S3", "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"],
      ["AWS PrivateLink for Amazon S3", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/privatelink-interface-endpoints.html"],
      ["AWS PrivateLink (multi-VPC network whitepaper)", "https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/aws-privatelink.html"]
    ]
  }
});
