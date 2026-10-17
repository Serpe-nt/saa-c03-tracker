// Key points per plan step for the course "Summary and Resources" (c9a). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c9a: {
    head: "The handful of design ideas behind most exam answers",
    why: "A stem describes a shop that slows down on every sale day and loses orders whenever its payment service hiccups. All four options look reasonable. Nearly every question describes a system and one thing it must do better: survive a failure, answer faster, cost less or stay secure.",
    idea: "A handful of design ideas answer most of these needs: decoupling, high availability, disaster recovery, caching, and paying by usage pattern with encryption by default. Match the stem's need to the idea, then the idea to the option.",
    k: [
      ["Decoupling", "For when one component fails or slows down because of another. Put a queue, a stream, a workflow or a load balancer between them. Loose coupling isolates the behavior of a component from the components that depend on it."],
      ["High availability or disaster recovery", "High availability is about the components of a workload: spread them over several Availability Zones with automatic failover. Disaster recovery is a separate copy of the entire workload, usually in another Region."],
      ["Four recovery strategies", "Measured by RTO and RPO, and the cost rises as they fall. Backup and restore: RPO in hours. Pilot light: data replicated, servers not deployed. Warm standby: a scaled-down but fully working copy always running. Multi-site active/active."],
      ["Caching", "It answers 'the same data is read again and again', improving read latency and throughput for frequently accessed data. Do not cache data that changes frequently, and never treat a cache as durable storage."],
      ["Cost and encryption", "Components that run for extended periods take commitment discounts (Savings Plans, Reserved Instances). Dynamic or short-running ones take On-Demand or Spot. Encrypt data at rest by default, and in transit."]
    ],
    trap: "Most wrong options work but miss one stated requirement. Find the qualifier in the stem: least operational overhead, most cost-effective, RTO and RPO. Then strike options that add servers, manual steps or a second Region nobody asked for.",
    q: {
      q: "An application already runs across three Availability Zones with automatic failover. The board now asks that it can be recovered if the whole Region is lost. What does that call for?",
      o: [
        "A separate copy of the workload in another Region",
        "A fourth Availability Zone added in the same Region",
        "Larger instances in each of the three zones it uses",
        "A cache in front of the database to absorb the load"
      ],
      a: [0],
      x: [
        "Right. Spreading over zones is high availability. Surviving the loss of a Region is disaster recovery: a separate copy of the entire workload in another Region, with a strategy chosen by its RTO and RPO.",
        "Every zone is still inside the one Region, so the loss of the Region takes them all.",
        "Bigger instances add capacity, not a place to recover into when the Region is gone.",
        "A cache speeds up repeated reads. It is never durable storage, let alone a second Region."
      ],
      dom: 2, tags: ["Disaster recovery"], doc: "dr"
    },
    docs: [
      ["REL04-BP02 Implement loosely coupled dependencies", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_loosely_coupled_system.html"],
      ["High availability is not disaster recovery", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/high-availability-is-not-disaster-recovery.html"],
      ["REL13-BP02 Use defined recovery strategies to meet the recovery objectives", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html"]
    ]
  }
});
