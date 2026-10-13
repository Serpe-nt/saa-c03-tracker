// Key points per plan step for the course "Summary and Resources" (c9a). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  c9a: {
    k: [
      "Decoupling: when one component fails or slows down because of another, put a queue, a stream, a workflow or a load balancer between them. Loose coupling isolates the behavior of a component from the components that depend on it.",
      "High availability is about the components of a workload: spread them over several Availability Zones with automatic failover. Disaster recovery is about a separate copy of the entire workload, usually in another Region, measured by RTO and RPO.",
      "DR strategies in rising cost and falling RTO and RPO: backup and restore (RPO in hours), pilot light (data replicated, servers not deployed), warm standby (a scaled-down but fully functional copy always running), multi-site active/active.",
      "Caching answers 'the same data is read again and again': a cache improves read latency and read throughput for frequently accessed data. Do not cache data that changes frequently, and never treat a cache as durable storage.",
      "Cost follows the usage pattern: components that run for extended periods take commitment discounts (Savings Plans, Reserved Instances), dynamic or short-running ones take On-Demand or Spot. Encrypt data at rest by default and in transit."
    ],
    trap: "Most wrong options work but miss one stated requirement. Find the qualifier in the stem (least operational overhead, most cost-effective, RTO and RPO) and strike options that add servers, manual steps or a second Region nobody asked for.",
    docs: [
      ["REL04-BP02 Implement loosely coupled dependencies", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_loosely_coupled_system.html"],
      ["High availability is not disaster recovery", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/high-availability-is-not-disaster-recovery.html"],
      ["REL13-BP02 Use defined recovery strategies to meet the recovery objectives", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_disaster_recovery.html"]
    ]
  }
});
