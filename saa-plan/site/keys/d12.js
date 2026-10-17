// Key points for the plan steps whose id starts with d12 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d12e1: {
    head: "Turn every wrong practice-exam answer into a rule",
    why: "The practice exam left you a score and a list of misses. Left alone, each miss will cost you again in the real exam, as the same gap in knowledge or the same misreading of a stem. You need to find out which of the two each one was.",
    idea: "Going through every wrong answer and writing why each wrong option is wrong turns a score into a list of exactly what to fix in the last two days.",
    do: [
      "Go through every question you got wrong in the Official Practice Exam.",
      "For each, write the requirement in the stem that decides, why the keyed option meets it, and the single fact that rules out each other option.",
      "Mark each miss as a knowledge gap or a misread."
    ],
    k: [
      ["What a distractor is", "The exam guide describes distractors as plausible options that a candidate with incomplete knowledge might choose. A wrong option is usually a real service used for the wrong requirement, so name that requirement."],
      ["Gap or misread", "Misreads are fixed by slowing down on qualifiers such as \"most cost-effective\" or \"least operational overhead\", not by more study."]
    ],
    q: {
      q: "Reviewing a miss, you see that you know Amazon MSK well. You skipped \"least operational overhead\" in the stem and chose Kafka on your own EC2 instances. How do you mark the miss, and what fixes it?",
      o: [
        "A misread: slow down on the qualifiers in the stem's last sentence",
        "A knowledge gap: re-watch the lecture on streaming services",
        "Bad luck: the two options were equally good",
        "A knowledge gap: learn more of Kafka's limits by heart"
      ],
      a: [0],
      x: [
        "Right. You knew the service, so more study would not have helped. The qualifier decided, and reading it more slowly is the fix.",
        "You already knew MSK. A lecture would repeat what you know and leave the reading habit as it is.",
        "They were not equal: Kafka on your own instances is servers to run, and the stem asked for the least overhead.",
        "No limit was in question. The stem's qualifier decided between a managed and a self-run option."
      ],
      dom: 3, tags: ["Streaming"], doc: "msk"
    },
    docs: [["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"]]
  },

  d12e2: {
    head: "Re-watch the reviews where one more hour wins the most points",
    why: "Two days are left and every domain feels shaky. Re-watching everything spreads the time too thin. Re-watching the domain with the lowest score can mean a domain that weighs little. You need the place where one more hour wins the most points.",
    idea: "Points at risk are a domain's weight times your miss rate in it. The domain with the most points at risk is the one whose task statement reviews you re-watch.",
    do: [
      "Open 📊 Scores and read your Domain Practice score for each domain.",
      "Multiply each domain's weight (30, 26, 24 and 20%) by your miss rate in it. The largest result is your weakest domain.",
      "Before each review, write down the decision rules you remember for that task statement.",
      "Re-watch the task statement reviews of that domain, watching for what is missing from your list, not for what you already know."
    ],
    k: [
      ["Why not the lowest score", "A domain with a low score but little weight can put fewer points at risk than a heavier domain with a middling score."]
    ],
    q: {
      q: "Your Domain Practice scores: Domain 1 70%, Domain 4 60%. Domain 1 weighs 30% and Domain 4 20%. Which domain puts more points at risk?",
      o: [
        "Domain 1: 30 × 0.30 = 9, against 20 × 0.40 = 8 for Domain 4",
        "Domain 4, because its score is the lower of the two",
        "Both the same, because the scores differ by only ten points",
        "Neither: re-watch all four domains equally"
      ],
      a: [0],
      x: [
        "Right. Weight times miss rate: Domain 1 misses 30% of a 30% domain, Domain 4 misses 40% of a 20% domain.",
        "The lowest score is not the measure. Its lighter weight puts fewer points at risk.",
        "The weights differ, so the same gap in score puts different numbers of points at risk.",
        "Equal time spreads the last two days thin. The heavier risk is where an hour wins most."
      ],
      dom: 1, tags: ["Well-Architected"]
    }
  },

  d12e3: {
    head: "Rebuild your weakest topic and watch it fail once",
    why: "A topic you keep getting wrong is often one you have only read about. You can recite that a network ACL is stateless and still miss the question about its return traffic. Building it once, and breaking it, shows how the parts depend on each other. A rebuild in your own account also costs money if it runs too long.",
    idea: "Redo the lab for that topic in Skill Builder, or rebuild the smallest version of it in your own account, with a time limit and a cleanup at the end.",
    do: [
      "Pick your weakest topic from the weak spots view.",
      "Redo its lab in Skill Builder, or rebuild it in ③ your own account.",
      "Build the smallest version that shows the mechanism. Predict the result before each apply, then break it once on purpose and read the error.",
      "In your own account, set a time limit and finish with <code>terraform destroy</code>, or with the cleanup step of the build you are repeating."
    ],
    k: [
      ["Lab or your own account", "A Skill Builder lab runs in a temporary sandbox, so nothing is left in your account. A rebuild in your own account is billed while it runs: that is why the time limit and the cleanup come first."]
    ],
    q: {
      q: "You rebuild a VPC with a NAT gateway in your own account to study it, and you finish at 23:00. What must happen before you stop for the night?",
      o: [
        "Delete what you built, for example with <code>terraform destroy</code>: the NAT gateway costs money every hour it exists",
        "Stop the instances, since the rest of the VPC costs nothing while it is idle",
        "Nothing, since the zero spend budget stops resources that cost money",
        "Nothing, since the sign-up credits pay for anything left overnight"
      ],
      a: [0],
      x: [
        "Right. A NAT gateway is billed for every hour it exists, used or not, so the build ends with its cleanup.",
        "An idle NAT gateway is still billed by the hour. Stopping instances leaves it running.",
        "The zero spend budget from Day 1 only sends an email. It stops nothing.",
        "Credits are not a spending limit, and on the Paid plan whatever they don't cover is charged to your card."
      ],
      dom: 4, tags: ["Internet & NAT gateways"], doc: "nat"
    }
  },

  d12e4: {
    head: "Finish the Domain Practice questions at exam pace",
    why: "Some practice questions are still unanswered: exam-like material you can still use. Done slowly, with pauses to look things up, they train recall but not the one skill that reading cannot: deciding within the two minutes a real question allows.",
    idea: "Work through the remaining Domain 1–4 Practice questions in timed blocks, and review each block at once, while you still remember why you chose each answer.",
    do: [
      "Skill Builder → <b>Domain 1–4 Practice</b> → the questions you have not done yet.",
      "Work in timed blocks at exam pace: two minutes per question, for example ten questions in twenty minutes.",
      "Review each block right away, while you still remember why you chose each answer."
    ],
    k: [
      ["Why review at once", "A day later you remember the right answer from its explanation, not the reasoning that led you astray. Reviewed at once, the faulty reasoning is still there to fix."]
    ],
    q: {
      q: "You have 15 Domain Practice questions left and 40 minutes. Which way of using them trains what the exam needs?",
      o: [
        "One timed block of 15 at two minutes each, then a review of all 15 straight away",
        "Look up each topic while you answer, to learn more from every question",
        "Answer all 15 now and read the explanations next week",
        "Read only the explanations and skip answering the questions"
      ],
      a: [0],
      x: [
        "Right. The timed block trains deciding at exam pace, and the review right after still finds your reasoning in memory.",
        "Looking things up trains recall with help, not deciding within two minutes.",
        "A week later you remember the explanations, not why you chose each answer, so the faulty reasoning is gone.",
        "Without answering, nothing trains the decision the exam asks for."
      ],
      dom: 1, tags: ["Well-Architected"]
    }
  }
});
