export const users = [
  { id: 1, email: "teacher@aspiro.com", password: "teacher123", role: "teacher", name: "Aspiro Admin" },
  { id: 2, email: "rahul@gmail.com",    password: "rahul123",   role: "student", name: "Rahul Kumar" },
  { id: 3, email: "priya@gmail.com",    password: "priya123",   role: null,      name: "Priya Singh" },
];

export const stats = {
  activeMocks: 4,
  totalStudentsAttempted: 758166,
  totalRegistrations: 871891,
  totalMocksBuilt: 12,
};

export const mocks = [
  {
    id: 33,
    title: "Mock for reasoning aptitudes",
    startTime: "11:10 12-09-2024",
    endTime: "14:10 17-09-2024",
    students: 212356,
    sections: [
      {
        id: 1,
        name: "Verbal Reasoning",
        marks: { correct: 2, wrong: 0.5 },
        duration: 30,
        questions: [
          {
            id: 1,
            type: "mcq",
            text: "Choose the word most similar in meaning to BENEVOLENT.",
            options: ["Cruel", "Kind", "Angry", "Sad"],
            correct: 1,
            explanation: "Benevolent means well-meaning and kindly.",
          },
          {
            id: 2,
            type: "mcq",
            text: "Find the odd one out: Apple, Mango, Carrot, Banana",
            options: ["Apple", "Mango", "Carrot", "Banana"],
            correct: 2,
            explanation: "Carrot is a vegetable; the rest are fruits.",
          },
          {
            id: 3,
            type: "mcq",
            text: "If A is the brother of B, B is the sister of C, then A is _____ of C.",
            options: ["Sister", "Brother", "Cousin", "Uncle"],
            correct: 1,
            explanation: "A is male and sibling of C through B.",
          },
        ],
      },
      {
        id: 2,
        name: "Logical Reasoning",
        marks: { correct: 2, wrong: 0.5 },
        duration: 30,
        questions: [
          {
            id: 4,
            type: "mcq",
            text: "All cats are animals. All animals have four legs. Therefore:",
            options: [
              "All cats have four legs",
              "Some cats have wings",
              "No cats have legs",
              "All animals are cats",
            ],
            correct: 0,
            explanation: "Direct syllogism conclusion.",
          },
          {
            id: 5,
            type: "mcq",
            text: "In a certain code, CLOUD is written as DNPVE. How is STORM written?",
            options: ["TUPSO", "TQPSN", "TUPTN", "SUQPN"],
            correct: 0,
            explanation: "Each letter is shifted by +1 in the alphabet.",
          },
        ],
      },
    ],
  },
  {
    id: 34,
    title: "Advanced Analytical & Verbal Reasoning Challenge",
    startTime: "09:00 01-10-2024",
    endTime: "18:00 02-10-2024",
    students: 145890,
    sections: [
      {
        id: 1,
        name: "Analytical Reasoning",
        marks: { correct: 3, wrong: 1 },
        duration: 45,
        questions: [
          {
            id: 1,
            type: "mcq",
            text: "Read the passage below and answer the questions: Alexander Graham Bell was born in Edinburgh, Scotland on March 3, 1847. When he was only eleven years old, he invented a machine that could clean wheat. Graham studies anatomy and physiology at the university of London, but moved with his family to Quebec, Canada in 1870. Bell soon moved to Boston, Massachusetts. In 1871, he began working with deaf people and published the system of Visible Hearing that was developed by his father. In 1872, Bell founded a school for the deaf which became part of Boston University.\n\nWhere was Alexander Graham Bell born?",
            options: ["England", "Quebec", "Scotland", "Boston"],
            correct: 2,
            explanation:
              "The passage clearly states Bell was born in Edinburgh, Scotland.",
          },
          {
            id: 2,
            type: "mcq",
            text: "According to the passage, what did Bell invent at age eleven?",
            options: [
              "The telephone",
              "A wheat cleaning machine",
              "Visible Hearing system",
              "A school for the deaf",
            ],
            correct: 1,
            explanation:
              "The passage states he invented a machine that could clean wheat at age eleven.",
          },
          {
            id: 3,
            type: "mcq",
            text: "Where did Bell found a school for the deaf?",
            options: ["Scotland", "Quebec", "London", "Boston"],
            correct: 3,
            explanation:
              "Bell founded a school for the deaf in Boston which became part of Boston University.",
          },
        ],
      },
    ],
  },
  {
    id: 35,
    title: "Quantitative Aptitude Speed Evaluation - Phase II",
    startTime: "10:00 15-11-2024",
    endTime: "13:00 15-11-2024",
    students: 89420,
    sections: [
      {
        id: 1,
        name: "Arithmetic",
        marks: { correct: 2, wrong: 0.5 },
        duration: 40,
        questions: [
          {
            id: 1,
            type: "mcq",
            text: "A train travels 360 km in 4 hours. What is its speed in km/h?",
            options: ["80", "90", "100", "110"],
            correct: 1,
            explanation: "Speed = Distance/Time = 360/4 = 90 km/h",
          },
          {
            id: 2,
            type: "mcq",
            text: "The ratio of two numbers is 3:5. Their sum is 160. Find the larger number.",
            options: ["60", "80", "100", "120"],
            correct: 2,
            explanation:
              "3x + 5x = 160, 8x = 160, x = 20. Larger = 5x = 100.",
          },
          {
            id: 3,
            type: "mcq",
            text: "A shopkeeper sells an item for Rs. 840 at a profit of 20%. Find the cost price.",
            options: ["Rs. 680", "Rs. 700", "Rs. 720", "Rs. 750"],
            correct: 1,
            explanation: "CP = SP / (1 + profit%) = 840 / 1.2 = 700",
          },
        ],
      },
    ],
  },
  {
    id: 36,
    title: "Comprehensive Syllabus Mock Evaluation Series",
    startTime: "08:00 05-12-2024",
    endTime: "20:00 06-12-2024",
    students: 310580,
    sections: [
      {
        id: 1,
        name: "General Awareness",
        marks: { correct: 1, wrong: 0.25 },
        duration: 20,
        questions: [
          {
            id: 1,
            type: "mcq",
            text: "Who is the author of the Indian Constitution?",
            options: [
              "Jawaharlal Nehru",
              "Mahatma Gandhi",
              "B.R. Ambedkar",
              "Sardar Patel",
            ],
            correct: 2,
            explanation:
              "Dr. B.R. Ambedkar was the principal architect of the Indian Constitution.",
          },
          {
            id: 2,
            type: "mcq",
            text: "Which planet is known as the Red Planet?",
            options: ["Venus", "Jupiter", "Mars", "Saturn"],
            correct: 2,
            explanation:
              "Mars appears red due to iron oxide (rust) on its surface.",
          },
        ],
      },
      {
        id: 2,
        name: "Current Affairs",
        marks: { correct: 1, wrong: 0.25 },
        duration: 20,
        questions: [
          {
            id: 3,
            type: "mcq",
            text: "Which country hosted the G20 Summit in 2023?",
            options: ["USA", "China", "India", "Germany"],
            correct: 2,
            explanation: "India hosted the G20 Summit in New Delhi in 2023.",
          },
        ],
      },
    ],
  },
];

export const studentResults = [
  { mockId: 33, score: 45, total: 60, timeTaken: "28:45", date: "15-09-2024" },
  { mockId: 35, score: 22, total: 30, timeTaken: "38:12", date: "15-11-2024" },
];
