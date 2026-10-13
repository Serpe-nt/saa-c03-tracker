// Key points per plan step for the course "Summary and Resources" (c9a). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c9a: {
    why: "Nearly every exam question describes a system and one thing it must do better: survive a failure, answer faster, cost less or stay secure. A handful of design ideas answer most of these needs. Knowing which need each idea answers lets you match the stem to the option.",
    k: [
      ["Decoupling", "For when one component fails or slows down because of another. Put a queue, a stream, a workflow or a load balancer between them. Loose coupling isolates the behavior of a component from the components that depend on it."],
      ["High availability", "About the components of a workload. Spread them over several Availability Zones with automatic failover."],
      ["Disaster recovery", "About a separate copy of the entire workload, usually in another Region. It is measured by recovery time objective (RTO) and recovery point objective (RPO)."],
      ["Disaster recovery strategies", "Four, in rising cost and falling RTO and RPO. Backup and restore: RPO in hours. Pilot light: data replicated, servers not deployed. Warm standby: a scaled-down but fully functional copy always running. Multi-site active/active."],
      ["Caching", "Answers 'the same data is read again and again'. A cache improves read latency and read throughput for frequently accessed data. Do not cache data that changes frequently, and never treat a cache as durable storage."],
      ["Cost and encryption", "Cost follows the usage pattern. Components that run for extended periods take commitment discounts (Savings Plans, Reserved Instances). Dynamic or short-running ones take On-Demand or Spot. Encrypt data at rest by default and in transit."]
    ],
    trap: "Most wrong options work but miss one stated requirement. Find the qualifier in the stem: least operational overhead, most cost-effective, RTO and RPO. Then strike options that add servers, manual steps or a second Region nobody asked for.",
    docs: [
      ["REL04-BP02 Implement loosely coupled dependencies", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_loosely_coupled_system.html"],
      ["High availability is not disaster recovery", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/high-availability-is-not-disaster-recovery.html"],
      ["REL13-BP02 Use defined recovery strategies to meet the recovery objectives", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html"]
    ]
  }
});
