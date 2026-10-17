// Key points for the plan steps whose id starts with d14 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d14e1: {
    head: "On exam morning, read only your own mistakes",
    why: "On exam morning you open a new topic, find two things you have never heard of, and walk into the exam rattled. New material now adds little and costs the calm and energy you need for 130 minutes. A short look at your own mistakes pays best, and leaves time to check in without a rush.",
    idea: "Spend at most an hour on your wrong-answer notes and nothing new. Today the points come from not repeating mistakes you have already made once.",
    do: [
      "Open the notebook of wrong answers here, and the rules in your notes. Read only those.",
      "Stop after one hour at most.",
      "Leave time for check-in. An online exam can be launched up to 30 minutes before the appointment. At a test center, arrive 15 to 30 minutes early with your ID."
    ],
    k: [
      ["Why your own notes", "They hold exactly the confusions you have shown, each with the rule that fixes it. Anything else you read today is new, and new is what unsettles."]
    ],
    q: {
      q: "It is 07:30 and your online exam starts at 09:30. Which plan for the morning fits best?",
      o: [
        "Up to an hour on your wrong-answer notes, then be ready to launch the exam from 09:00",
        "Two hours on a topic you never studied, in case it comes up",
        "A full practice exam first, to warm up",
        "Launch the exam at 08:30 to finish early"
      ],
      a: [0],
      x: [
        "Right. Your own mistakes are the review that pays best today, and an online exam can be launched up to 30 minutes before the appointment.",
        "New material on the morning adds little and costs calm you need for 130 minutes.",
        "A full practice exam would spend the energy the real one needs two hours later.",
        "An online exam can be launched only up to 30 minutes early, so 08:30 is too soon."
      ]
    },
    docs: [["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"]]
  },

  d14e2: {
    head: "Work every question the same way, so the clock stays yours",
    why: "Twelve minutes vanish into one question about a service you half remember. At the end five questions are still blank, and a strange question early on shook you for the next ten. Knowledge alone does not pass when time and nerves go wrong. A fixed routine for every question keeps both under control.",
    idea: "Eliminate two options first, decide between the rest, flag what is still hard and move on. Return to the flags at the end, with every question already answered.",
    do: [
      "On each question, read the last sentence of the stem twice, then eliminate the two options that break a requirement.",
      "If it is still open after about two minutes, choose your best option, flag it and move on.",
      "Answer every question, flagged ones included. Return to the flags at the end with the time that is left."
    ],
    k: [
      ["Two minutes per question", "65 questions in 130 minutes is two minutes per question."],
      ["Never leave a blank", "Unanswered questions are scored as incorrect and guessing is not penalised. So never leave a question blank, not even one you have flagged."],
      ["Unscored questions", "15 questions are unscored and not marked. A question on something you never studied may be one of them. Answer it and do not let it unsettle you."],
      ["Breaks", "No breaks are scheduled. At a test center the clock keeps running during a break. In an online exam you may not leave the camera view at all, not even for the restroom."]
    ],
    trap: "Two options often both work. The qualifier in the last sentence of the stem, such as \"most cost-effective\" or \"least operational overhead\", decides between them, so read that sentence twice.",
    q: {
      q: "Forty minutes are left and every question is answered. On one flagged question, two options both seem to work. What decides between them?",
      o: [
        "The qualifier in the stem's last sentence, such as \"most cost-effective\" or \"least operational overhead\"",
        "The longer option, because it covers more detail",
        "The option with the newer service in it",
        "The option you would choose in your own job"
      ],
      a: [0],
      x: [
        "Right. When two options both work, the stem's qualifier is what makes one of them the best answer.",
        "Length says nothing about which option meets the stated requirement.",
        "A newer service is not a better answer unless the requirement calls for what it does.",
        "Your own job has other constraints. The stem's stated requirements are the only ones that count."
      ]
    },
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"]
    ]
  },

  d14e3: {
    head: "Claim your badge and show the result",
    why: "You pass, and a week later nobody knows: the result sits in an account you rarely open. A certification that nobody can see does little for a job search. The digital badge is how you show it, and the benefits that come with passing are easy to miss.",
    idea: "The result arrives in your AWS Certification Account, and the badge comes from Credly by email. Claim it, then add it to your CV and LinkedIn.",
    do: [
      "Wait for the result in your AWS Certification Account: it is posted within five business days after the exam.",
      "Accept the badge from the Credly email, or find it under the <b>Digital Badges</b> tab of your AWS Certification Account.",
      "Add the badge to your CV and to LinkedIn.",
      "Find the 50% discount voucher in your AWS Certification Account."
    ],
    k: [
      ["Valid for 3 years", "The certification is valid for 3 years. The 50% voucher from passing can go to recertification or to any other AWS exam."]
    ],
    q: {
      q: "Three weeks after passing you want to book another AWS exam. What discount do you have, and where is it?",
      o: [
        "A 50% voucher, in your AWS Certification Account",
        "A 50% code, inside the Credly badge email",
        "A free exam voucher, sent with the result",
        "A 25% discount that appears by itself at checkout"
      ],
      a: [0],
      x: [
        "Right. Passing gives a 50% discount voucher for recertification or any other AWS exam, found in your AWS Certification Account.",
        "The Credly email is for claiming the badge. The voucher is in your AWS Certification Account.",
        "The benefit is a 50% discount, not a free exam.",
        "The voucher is 50%, and you find it in your AWS Certification Account."
      ]
    },
    docs: [
      ["AWS Certification policies: after testing", "https://aws.amazon.com/certification/policies/after-testing/"],
      ["AWS Certification digital badges", "https://aws.amazon.com/certification/certification-digital-badges/"],
      ["Benefits for AWS Certified individuals", "https://aws.amazon.com/certification/benefits/"]
    ]
  }
});
