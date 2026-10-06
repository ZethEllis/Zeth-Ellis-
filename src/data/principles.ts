export interface Principle {
  n: number;
  title: string;
  summary: string;
  body: string[];
}

export const INTRO = [
  "For decades, career exploration has often been reduced to a familiar formula: answer a series of questions, receive a personality profile, and get a list of recommended careers.",
  "But the question people are actually trying to answer is much harder: “What is the best career for me?” A career decision involves identity, interests, skills, values, work preferences, education, financial considerations, labor-market conditions, family expectations, and an increasingly uncertain future of work. No single test or algorithm can fully capture all of that.",
  "The Career E-Sandbox takes a different approach. Rather than attempting to produce a definitive answer, it creates an environment where people can explore possibilities, compare perspectives, question recommendations, and develop greater self-knowledge.",
];

export const PRINCIPLES: Principle[] = [
  {
    n: 1,
    title: "Solve the exploration problem — not every career problem",
    summary: "Help people answer “Which careers should I explore?” and give them a better starting point.",
    body: [
      "Many career tools try to take users through an entire journey, from personality assessment to career recommendation to education program to job search. That can create complicated experiences that never really answer the first question: “Which careers should I explore?”",
      "The Career E-Sandbox focuses on making that exploration better. It helps users generate possibilities, compare them, investigate why they might fit, identify potential mismatches, and discover careers they may not have considered.",
      "The goal isn't to make the entire career decision for someone. It is to give them a better starting point for making that decision themselves.",
    ],
  },
  {
    n: 2,
    title: "Build a sandbox, not a test",
    summary: "Change inputs, try assumptions, compare scenarios and see what happens.",
    body: [
      "A test asks users to provide information so the system can produce an answer. A sandbox lets users experiment: change inputs, try different assumptions, compare scenarios, revisit previous explorations, and see what happens when something changes.",
      "That makes career exploration more like experimentation than examination. A useful metaphor is a flight simulator: an environment where you can practice, encounter different conditions, and learn.",
    ],
  },
  {
    n: 3,
    title: "Make recommendations transparent",
    summary: "See why a career was suggested, then agree, disagree or change the inputs.",
    body: [
      "Instead of “Career Match: 87%”, the sandbox explains why: strong alignment with your interest in problem-solving, moderate alignment with your income goals, a potential mismatch with your preference for social interaction, a positive employment outlook.",
      "That changes your relationship with the recommendation. You don't have to accept it. You can agree, disagree, investigate, or change the inputs. Transparency matters most when AI is involved: users should understand what information was provided, which framework generated the recommendation, what assumptions were made, and where uncertainty exists.",
    ],
  },
  {
    n: 4,
    title: "Include multiple perspectives",
    summary: "Compare interests, work style and practical factors side by side — and see where they disagree.",
    body: [
      "There is no single universally correct way to think about career fit. Different frameworks illuminate different aspects of a person or the labor market: interests, skills, values, work preferences, education, goals, labor-market data, job-growth projections, and more.",
      "The purpose is to make the differences visible. If three lenses recommend the same career, that's interesting. If they produce dramatically different recommendations, that's interesting too. The disagreement becomes an opportunity for critical thinking, so the sandbox exposes conflicting answers instead of hiding them.",
    ],
  },
  {
    n: 5,
    title: "Help users understand themselves",
    summary: "Explore careers → learn about yourself → refine your profile → explore again.",
    body: [
      "Career exploration isn't only about discovering occupations. It's also about discovering what you enjoy, what motivates you, what you value, which environments you prefer, what you're good at, what you don't want to do, and which trade-offs you're willing to make.",
      "That shouldn't stop at a personality label. Instead of “You are an INFP, so you should become a writer,” the sandbox asks: “What aspects of writing appeal to you?” Perhaps you enjoy creativity but dislike working alone — which points toward adjacent careers in design, research, or strategy.",
    ],
  },
  {
    n: 6,
    title: "Show both matches and mismatches",
    summary: "Best matches, potential mismatches, adjacent careers and unexpected options.",
    body: [
      "Knowing what doesn't fit can be as valuable as knowing what does. The sandbox shows best matches (strong alignment across several factors), potential mismatches (important characteristics that conflict with your preferences or goals), adjacent careers (not the strongest statistical match, but sharing meaningful characteristics), and unexpected careers you may never have considered.",
    ],
  },
  {
    n: 7,
    title: "Keep the human in the loop",
    summary: "Arrive at your next conversation with a counselor, mentor or parent with something to discuss.",
    body: [
      "Career decisions involve uncertainty, personal circumstances, values and emotions that no algorithm fully understands. The sandbox should make conversations with educators, counselors, parents, mentors and professionals better — not replace them.",
      "Compare “I have no idea what I want to do” with “I've explored eight careers. These three seem strongest. Two perspectives disagree about one of them. I realized I care much more about work environment than I thought, and I found three adjacent careers I want to investigate.” The second conversation has somewhere to go.",
    ],
  },
];
