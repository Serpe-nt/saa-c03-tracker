// Key points per plan step for Day 12. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d12e1: {
    k: [
      "For each miss, write three things: the requirement in the stem that decides, why the keyed option meets it, and the single fact that rules out each of the other options.",
      "The exam guide describes distractors as plausible options that a candidate with incomplete knowledge might choose. A wrong option is usually a real service used for the wrong requirement, so name that requirement.",
      "Mark each miss as a knowledge gap or a misread stem. Misreads are fixed by slowing down on qualifiers such as 'most cost-effective' or 'least operational overhead', not by more study."
    ],
    docs: [["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]]
  },

  d12e2: {
    k: [
      "Choose the domain by points at risk, not by the lowest percentage: multiply each domain's weight (30, 26, 24 and 20%) by your miss rate in it.",
      "Before you re-watch a review, write down the decision rules you remember for that task statement. Then watch for what is missing from your list, not for what you already know."
    ]
  },

  d12e3: {
    k: [
      "Build the smallest version that shows the mechanism, predict the result before each apply, then break it once on purpose and read the error. Set a time limit and finish with <code>terraform destroy</code>."
    ]
  },

  d12e4: {
    k: [
      "Work in timed blocks at exam pace, two minutes per question, and review each block right away while you still remember why you chose each answer."
    ]
  }
});
