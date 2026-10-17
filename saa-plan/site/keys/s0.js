// Key points for the plan steps whose id starts with s0 (enrolling on Skill Builder, Day 1). Data only. Keys are plan item ids from plan.js.
window.KEYS = window.KEYS || {};
Object.assign(window.KEYS, {
  s0b: {
    head: "Start with the course that assumes nothing",
    why: "The architecture courses talk about subnets, instance profiles and read replicas as if you knew them. Starting there with no AWS experience, every lesson stalls on words nobody has explained. You need the basics first, from a course written for beginners.",
    idea: "AWS Technical Essentials is that course. You take it today and tomorrow, before the first architecture course on Day 2.",
    k: [
      ["Free training needs only a sign-in", "AWS's free digital training needs no subscription: sign in to Skill Builder, pick a course and start. For individuals AWS recommends signing in with an AWS Builder ID."]
    ],
    q: {
      q: "Someone has an AWS Builder ID but no Skill Builder subscription. Which of these can they start today?",
      o: [
        "AWS Technical Essentials, which is free digital training",
        "The Official Practice Exam for SAA-C03",
        "Domain Practice for each exam domain",
        "The SAA-C03 certification exam itself"
      ],
      a: [0],
      x: [
        "Right. Free digital training needs only a sign-in to Skill Builder.",
        "The Official Practice Exam needs the Individual subscription.",
        "Domain Practice needs the Individual subscription.",
        "The exam is booked and paid for separately, through your AWS Certification account. The Individual subscription doesn't include it."
      ],
      dom: 4, tags: ["Cost management tools"]
    },
    docs: [["AWS Training FAQs", "https://aws.amazon.com/training/faqs/"]]
  },
  s0a: {
    head: "Enroll in the learning plan that runs Days 2 to 17",
    why: "Picking courses one by one from hundreds, you take them in the wrong order and skip the labs that make a lecture stick. You need a set path, from lectures to hands-on labs, chosen for the job you are training for.",
    idea: "A learning plan is AWS's recommended collection of courses for one job role, each harder than the last. Enrolled, you find it under My training, where every lecture and lab of the coming weeks starts.",
    k: [
      ["Labs run in a sandbox", "Each lab opens a temporary AWS sandbox. Nothing runs in your own account, so a lab can't leave anything behind that costs you money."]
    ],
    q: {
      q: "A lab in the Solutions Architect plan has you launch instances and a load balancer. What does that cost your own AWS account?",
      o: [
        "Nothing, because the lab runs in a temporary sandbox, not in your account",
        "The usual hourly prices, until you delete what the lab created",
        "Only the load balancer's hours, because instances in labs are free",
        "Nothing until your credits run out, then the usual prices"
      ],
      a: [0],
      x: [
        "Right. Each lab opens a temporary AWS sandbox, and nothing runs in your own account.",
        "That is true for the builds you do in your own account, which is why each build ends with a cleanup. A lab's sandbox is not your account.",
        "No part of a lab runs in your account, so neither part is billed to it.",
        "Credits pay for usage in your own account. A lab's resources live in the sandbox, not there."
      ],
      dom: 4, tags: ["Cost management tools"]
    },
    docs: [["AWS Training FAQs", "https://aws.amazon.com/training/faqs/"]]
  }
});
