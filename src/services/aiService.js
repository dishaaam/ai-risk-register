import { mockAiAnalysis, mockAiAnswer } from "./mockData";

const USE_MOCK = true; // Change to false when backend is ready

// Ask a general AI question (not tied to a specific risk)
export const askGeneralQuestion = async (question, context = "") => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 1800));
    const responses = {
      default: `Based on your question about "${question}", here is what I can tell you: Risk management requires a systematic approach to identifying, assessing, and mitigating potential threats. Always ensure risks are documented with clear ownership and remediation timelines.`,
      risk: `For risk-related questions like "${question}", the best practice is to score risks on a 1-100 scale based on likelihood and impact. High scores (70+) require immediate action, medium scores (50-69) need short-term planning, and low scores (below 50) can be monitored.`,
      security: `Regarding your security question "${question}": Security risks should always be treated as high priority. Implement defence-in-depth strategies, conduct regular penetration testing, and ensure all data in transit is encrypted using TLS 1.3 or higher.`,
      compliance: `For compliance questions like "${question}": Ensure all regulatory requirements are documented as risks and assigned to compliance officers. Regular audits and automated monitoring tools are essential for maintaining compliance posture.`,
    };

    const lower = question.toLowerCase();
    let answer = responses.default;
    if (lower.includes("security") || lower.includes("encrypt")) answer = responses.security;
    else if (lower.includes("compliance") || lower.includes("regulation")) answer = responses.compliance;
    else if (lower.includes("risk") || lower.includes("score")) answer = responses.risk;

    return {
      answer,
      confidence: 0.88,
      model_used: "llama-3.3-70b",
      tokens_used: 142,
      response_time_ms: 1800,
      cached: false,
    };
  }

  const response = await fetch(
    `${import.meta.env.VITE_AI_URL || "http://localhost:5000"}/query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context }),
    }
  );
  if (!response.ok) throw new Error("AI service error");
  return response.json();
};

// Generate a full report
export const generateReport = async (risks) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 2500));
    return {
      title: "AI Risk Register — Executive Report",
      executive_summary:
        "The organization currently has 5 documented risks across multiple categories. Two high-priority security risks require immediate attention. Overall risk posture is moderate with a mean score of 62/100.",
      overview:
        "Risk distribution shows concentration in Security (40%) and Compliance (20%) categories. The trend over the past 6 months shows an increase in identified risks, suggesting improved risk awareness across teams.",
      top_items: [
        "Unencrypted user data in transit — Score: 85 — Immediate action required",
        "No audit log for admin actions — Score: 78 — Assign owner and remediate",
        "AI model hallucination in reports — Score: 62 — Monitor and test regularly",
      ],
      recommendations: [
        "Prioritise encryption implementation across all data channels",
        "Implement comprehensive audit logging for all privileged actions",
        "Establish an AI model validation framework",
        "Schedule monthly risk review meetings with all stakeholders",
      ],
      generated_at: new Date().toISOString(),
      model_used: "llama-3.3-70b",
      is_fallback: false,
    };
  }

  const response = await fetch(
    `${import.meta.env.VITE_AI_URL || "http://localhost:5000"}/generate-report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ risks }),
    }
  );
  if (!response.ok) throw new Error("Report generation failed");
  return response.json();
};