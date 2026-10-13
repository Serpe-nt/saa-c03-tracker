// Key points for the plan steps whose id starts with d14 (kept from the 14-day plan; the number is not the day they sit on now). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d14e1: {
    why: "Cramming new material on the morning of the exam adds little, and it costs calm and energy you need for a long sitting. A short look at your own mistakes is the review that pays best. It also leaves time to check in without hurry.",
    k: [
      ["Only your own notes", "Read your own wrong-answer notes and nothing new. Today the points come from not repeating mistakes you have already made once."],
      ["Leave time for check-in", "An online exam can be launched up to 30 minutes before the appointment. A test center asks you to arrive 15 to 30 minutes early with your ID."]
    ],
    docs: [["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"]]
  },

  d14e2: {
    why: "Knowledge alone does not pass the exam when time and nerves go wrong. Minutes sink into one hard question, blanks are left at the end, or a strange question shakes you. A fixed routine for every question keeps the clock and your attention under control.",
    k: [
      ["Two minutes per question", "65 questions in 130 minutes is two minutes per question. If a question is still open after about two minutes, choose your best option, flag it and move on."],
      ["Never leave a blank", "Unanswered questions are scored as incorrect and guessing is not penalised. So never leave a question blank, not even one you have flagged."],
      ["Unscored questions", "15 questions are unscored and not marked. A question on something you never studied may be one of them. Answer it and do not let it unsettle you."],
      ["Breaks", "No breaks are scheduled. At a test center the clock keeps running during a break. In an online exam you may not leave the camera view at all, not even for the restroom."]
    ],
    trap: "Two options often both work. The qualifier in the last sentence of the stem, such as 'most cost-effective' or 'least operational overhead', decides between them, so read that sentence twice.",
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"]
    ]
  },

  d14e3: {
    why: "A certification that nobody can see does little for a job search. The digital badge is how you show the result to others. The benefits that come with passing are easy to miss if you do not know where to find them.",
    k: [
      ["Results", "Final results are posted to your AWS Certification Account within five business days after the exam."],
      ["Badge", "The badge arrives as an email from Credly with instructions for claiming it. It is also under the Digital Badges tab of your AWS Certification Account."],
      ["Voucher and validity", "Passing gives you a 50% discount voucher for recertification or any other AWS exam, found in your AWS Certification Account. The certification is valid for 3 years."]
    ],
    docs: [
      ["AWS Certification policies: after testing", "https://aws.amazon.com/certification/policies/after-testing/"],
      ["AWS Certification digital badges", "https://aws.amazon.com/certification/certification-digital-badges/"],
      ["Benefits for AWS Certified individuals", "https://aws.amazon.com/certification/benefits/"]
    ]
  }
});
