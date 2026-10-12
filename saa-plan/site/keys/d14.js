// Key points per plan step for Day 14. Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  d14e1: {
    k: [
      "Read your own wrong-answer notes and nothing new. Today the points come from not repeating mistakes you have already made once.",
      "Leave time for check-in: an online exam can be launched up to 30 minutes before the appointment, and a test center asks you to arrive 15 to 30 minutes early with your ID."
    ],
    docs: [["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"]]
  },

  d14e2: {
    k: [
      "65 questions in 130 minutes is two minutes per question. If a question is still open after about two minutes, choose your best option, flag it and move on.",
      "Unanswered questions are scored as incorrect and guessing is not penalised, so never leave a question blank, not even one you have flagged.",
      "15 questions are unscored and not marked. A question on something you never studied may be one of them: answer it and do not let it unsettle you.",
      "No breaks are scheduled. At a test center the clock keeps running during a break; in an online exam you may not leave the camera view at all, not even for the restroom."
    ],
    trap: "Two options often both work. The qualifier in the last sentence of the stem, such as 'most cost-effective' or 'least operational overhead', decides between them, so read that sentence twice.",
    docs: [
      ["SAA-C03 exam guide", "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html"],
      ["AWS Certification policies: during testing", "https://aws.amazon.com/certification/policies/during-testing/"]
    ]
  },

  d14e3: {
    k: [
      "Final results are posted to your AWS Certification Account within five business days after the exam.",
      "The badge arrives as an email from Credly with instructions for claiming it. It is also under the Digital Badges tab of your AWS Certification Account.",
      "Passing gives you a 50% discount voucher for recertification or any other AWS exam, found in your AWS Certification Account. The certification is valid for 3 years."
    ],
    docs: [
      ["AWS Certification policies: after testing", "https://aws.amazon.com/certification/policies/after-testing/"],
      ["AWS Certification digital badges", "https://aws.amazon.com/certification/certification-digital-badges/"],
      ["Benefits for AWS Certified individuals", "https://aws.amazon.com/certification/benefits/"]
    ]
  }
});
