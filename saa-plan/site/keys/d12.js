// Key points for the plan steps whose id starts with d12 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d12e1: {
    why: "A practice exam by itself only gives you a score. The points for the real exam are in the wrong answers. Each one marks a knowledge gap or a reading mistake, and it will cost you again unless you find out which of the two it was.",
    k: [
      ["Three things per miss", "Write the requirement in the stem that decides, why the keyed option meets it, and the single fact that rules out each of the other options."],
      ["What a distractor is", "The exam guide describes distractors as plausible options that a candidate with incomplete knowledge might choose. A wrong option is usually a real service used for the wrong requirement, so name that requirement."],
      ["Knowledge gap or misread", "Mark each miss as one or the other. Misreads are fixed by slowing down on qualifiers such as 'most cost-effective' or 'least operational overhead', not by more study."]
    ],
    docs: [["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]]
  },

  d12e2: {
    why: "With little time left, re-watching everything spreads the effort too thin. The useful question is where one more hour of study wins the most points. That depends on how weak a domain is and on how much it weighs.",
    k: [
      ["Choose by points at risk", "Do not choose the domain by the lowest percentage. Multiply each domain's weight (30, 26, 24 and 20%) by your miss rate in it."],
      ["Recall before you re-watch", "First write down the decision rules you remember for that task statement. Then watch for what is missing from your list, not for what you already know."]
    ]
  },

  d12e3: {
    why: "A topic you keep getting wrong is often one you have only read about. Building it once, and watching it fail, shows how the parts depend on each other in a way a description does not. A time limit and a cleanup keep this from eating the day or leaving a bill.",
    k: [
      ["Build to see the mechanism", "Build the smallest version that shows the mechanism. Predict the result before each apply. Then break it once on purpose and read the error."],
      ["Limit and clean up", "Set a time limit and finish with <code>terraform destroy</code>."]
    ]
  },

  d12e4: {
    why: "The practice questions you have not done yet are exam-like material you can still use. Doing them at exam pace also trains the one thing reading cannot: deciding within the time a real question allows.",
    k: [
      ["Timed blocks, reviewed at once", "Work in timed blocks at exam pace, two minutes per question. Review each block right away, while you still remember why you chose each answer."]
    ]
  }
});
