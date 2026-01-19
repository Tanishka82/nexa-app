const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const questions = [
    // --- TECH: SOFTWARE DEVELOPMENT (Technical) ---
    {
      question: "Which of the following is NOT a React Hook?",
      options: ["useState", "useFetch", "useEffect", "useReducer"],
      correctAnswer: "useFetch",
      explanation: "useFetch is not a built-in React Hook; it is often a custom hook created by developers.",
      difficulty: "EASY",
      category: "TECHNICAL",
      industry: "tech",
      subIndustry: "software-development",
      skills: ["React", "JavaScript", "Frontend"],
    },
    {
      question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctAnswer: "O(log n)",
      explanation: "In a balanced BST, the height is log(n), making search operations O(log n).",
      difficulty: "MEDIUM",
      category: "TECHNICAL",
      industry: "tech",
      subIndustry: "software-development",
      skills: ["Data Structures", "Algorithms"],
    },
    {
      question: "Which HTTP method is typically used to update an existing resource?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: "PUT",
      explanation: "PUT is used to update/replace an existing resource, while POST is generally used to create new ones.",
      difficulty: "EASY",
      category: "TECHNICAL",
      industry: "tech",
      subIndustry: "software-development",
      skills: ["Web Development", "API"],
    },
    {
      question: "In JavaScript, what is the output of `typeof null`?",
      options: ["'null'", "'undefined'", "'object'", "'number'"],
      correctAnswer: "'object'",
      explanation: "This is a long-standing bug in JavaScript where null is considered an object type.",
      difficulty: "MEDIUM",
      category: "TECHNICAL",
      industry: "tech",
      subIndustry: "software-development",
      skills: ["JavaScript"],
    },
    // --- TECH: SOFTWARE DEVELOPMENT (Behavioral) ---
    {
      question: "How do you handle a disagreement with a team member about a technical decision?",
      options: [
        "I insist on my way because I know I am right.",
        "I complain to the manager immediately.",
        "I discuss the pros and cons of both approaches and try to reach a consensus.",
        "I ignore the issue and do what I want."
      ],
      correctAnswer: "I discuss the pros and cons of both approaches and try to reach a consensus.",
      explanation: "Collaboration and weighing trade-offs are key engineering skills.",
      difficulty: "EASY",
      category: "BEHAVIORAL",
      industry: "tech",
      subIndustry: "software-development",
      skills: ["Communication", "Teamwork"],
    },
    // --- TECH: DATA SCIENCE (Technical) ---
    {
      question: "Which of the following algorithms is NOT a supervised learning algorithm?",
      options: ["Linear Regression", "Decision Trees", "K-Means Clustering", "Support Vector Machine"],
      correctAnswer: "K-Means Clustering",
      explanation: "K-Means is an unsupervised learning algorithm used for clustering.",
      difficulty: "MEDIUM",
      category: "TECHNICAL",
      industry: "tech",
      subIndustry: "data-science",
      skills: ["Machine Learning", "AI"],
    },
  ];

  console.log("Seeding questions...");

  for (const q of questions) {
    await prisma.quizQuestion.create({
      data: {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
        industry: q.industry,
        subIndustry: q.subIndustry,
        skills: q.skills,
        isActive: true, // Default to active
      },
    });
  }

  console.log(`Database seeded with ${questions.length} questions!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });