export const mockRisks = [
  {
    id: 1,
    title: "Unencrypted user data in transit",
    category: "Security",
    status: "Open",
    priority: "High",
    score: 85,
    owner: "Alice Johnson",
    createdDate: "2026-04-01",
    description: "User data is being transmitted without encryption, exposing it to man-in-the-middle attacks.",
  },
  {
    id: 2,
    title: "AI model hallucination in reports",
    category: "AI Risk",
    status: "In Progress",
    priority: "Medium",
    score: 62,
    owner: "Bob Smith",
    createdDate: "2026-04-05",
    description: "The AI model occasionally generates inaccurate information in automated reports.",
  },
  {
    id: 3,
    title: "No audit log for admin actions",
    category: "Compliance",
    status: "Open",
    priority: "High",
    score: 78,
    owner: "Carol White",
    createdDate: "2026-04-08",
    description: "Admin actions are not being logged, making it impossible to trace unauthorized changes.",
  },
  {
    id: 4,
    title: "Third-party API has no SLA",
    category: "Operational",
    status: "Resolved",
    priority: "Low",
    score: 30,
    owner: "David Lee",
    createdDate: "2026-04-10",
    description: "The third-party payment API has no service level agreement, risking unplanned downtime.",
  },
  {
    id: 5,
    title: "Missing input validation on forms",
    category: "Security",
    status: "In Progress",
    priority: "Medium",
    score: 55,
    owner: "Eva Green",
    createdDate: "2026-04-12",
    description: "Form inputs are not being validated server-side, opening the application to injection attacks.",
  },
];

export const mockStats = {
  totalRisks: 5,
  openRisks: 2,
  inProgressRisks: 2,
  resolvedRisks: 1,
  highPriority: 2,
  mediumPriority: 2,
  lowPriority: 1,
  averageScore: 62,
  byCategory: [
    { category: "Security", count: 2 },
    { category: "AI Risk", count: 1 },
    { category: "Compliance", count: 1 },
    { category: "Operational", count: 1 },
    { category: "Financial", count: 0 },
    { category: "Reputational", count: 0 },
  ],
  byStatus: [
    { status: "Open", count: 2 },
    { status: "In Progress", count: 2 },
    { status: "Resolved", count: 1 },
  ],
  byPriority: [
    { priority: "High", count: 2 },
    { priority: "Medium", count: 2 },
    { priority: "Low", count: 1 },
  ],
  recentTrend: [
    { month: "Nov", count: 1 },
    { month: "Dec", count: 2 },
    { month: "Jan", count: 3 },
    { month: "Feb", count: 2 },
    { month: "Mar", count: 4 },
    { month: "Apr", count: 5 },
  ],
};

export const mockAiAnalysis = {
  description:
    "This risk represents a significant threat to the organization's data security posture. The identified vulnerability could allow unauthorized access to sensitive user information if exploited by a malicious actor. Immediate remediation is strongly advised.",
  recommendations: [
    {
      action_type: "Immediate",
      description: "Encrypt all data in transit using TLS 1.3 or higher.",
      priority: "High",
    },
    {
      action_type: "Short-term",
      description: "Conduct a full security audit of all API endpoints.",
      priority: "Medium",
    },
    {
      action_type: "Long-term",
      description: "Implement automated vulnerability scanning in the CI/CD pipeline.",
      priority: "Low",
    },
  ],
  category: "Security",
  confidence: 0.91,
  model_used: "llama-3.3-70b",
  generated_at: "2026-04-28T10:30:00Z",
};

export const mockAiAnswer = {
  answer:
    "Based on the risk data, this risk requires immediate attention due to its high score and open status. The recommended approach is to assign a dedicated owner and begin remediation within 48 hours. Ensure all stakeholders are informed and a mitigation plan is documented.",
  confidence: 0.87,
  model_used: "llama-3.3-70b",
};