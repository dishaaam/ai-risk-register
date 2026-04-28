import api from "./api";
import { mockRisks, mockStats, mockAiAnalysis, mockAiAnswer } from "./mockData";

const USE_MOCK = true; // Change to false when backend is ready

// ─── RISKS ───────────────────────────────────────────────

export const getRisks = async (page = 0, size = 10, sortBy = "createdDate", sortDir = "desc", search = "") => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 1000));
    let filtered = [...mockRisks];
    if (search) {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      if (sortDir === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return {
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size,
    };
  }
  const params = new URLSearchParams({ page, size, sortBy, sortDir });
  if (search) params.append("search", search);
  const response = await api.get(`/api/risks?${params}`);
  return response.data;
};

export const getRiskById = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    const risk = mockRisks.find((r) => r.id === parseInt(id));
    return risk || null;
  }
  const response = await api.get(`/api/risks/${id}`);
  return response.data;
};

export const createRisk = async (data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return { ...data, id: Date.now() };
  }
  const response = await api.post("/api/risks", data);
  return response.data;
};

export const updateRisk = async (id, data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return { ...data, id };
  }
  const response = await api.put(`/api/risks/${id}`, data);
  return response.data;
};

export const deleteRisk = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    return true;
  }
  await api.delete(`/api/risks/${id}`);
  return true;
};

// ─── STATS ───────────────────────────────────────────────

export const getStats = async () => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return mockStats;
  }
  const response = await api.get("/api/risks/stats");
  return response.data;
};

// ─── AI ──────────────────────────────────────────────────

export const getAiAnalysis = async (riskId) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 2000));
    // Return a copy so it never fails
    return { ...mockAiAnalysis };
  }
  const response = await api.get(`/api/risks/${riskId}/ai-analysis`);
  return response.data;
};

export const askAiQuestion = async (riskId, question) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 1500));
    return {
      ...mockAiAnswer,
      answer: `Based on the risk data, here is what I can tell you about "${question}": ${mockAiAnswer.answer}`,
    };
  }
  const response = await api.post(`/api/risks/${riskId}/ask`, { question });
  return response.data;
};