import api from "./api";
import { mockRisks, mockStats, mockAiAnalysis, mockAiAnswer } from "./mockData";

const USE_MOCK = true; // Change to false when backend is ready

// ─── RISKS ───────────────────────────────────────────────

export const getRisks = async (
  page = 0,
  size = 10,
  sortBy = "createdDate",
  sortDir = "desc",
  search = "",
  status = "All",
  priority = "All",
  category = "All",
  startDate = null,
  endDate = null
) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));

    let filtered = [...mockRisks];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.owner.toLowerCase().includes(search.toLowerCase()) ||
          r.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status && status !== "All") {
      filtered = filtered.filter((r) => r.status === status);
    }

    // Priority filter
    if (priority && priority !== "All") {
      filtered = filtered.filter((r) => r.priority === priority);
    }

    // Category filter
    if (category && category !== "All") {
      filtered = filtered.filter((r) => r.category === category);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(
        (r) => new Date(r.createdDate) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (r) => new Date(r.createdDate) <= new Date(endDate)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortDir === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

    // Pagination
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

  // Real API call
  const params = new URLSearchParams({ page, size, sortBy, sortDir });
  if (search) params.append("search", search);
  if (status && status !== "All") params.append("status", status);
  if (priority && priority !== "All") params.append("priority", priority);
  if (category && category !== "All") params.append("category", category);
  if (startDate) params.append("startDate", startDate.toISOString().split("T")[0]);
  if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

  const response = await api.get(`/api/risks?${params}`);
  return response.data;
};

// ─────────────────────────────────────────────────────────

export const getRiskById = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    const risk = mockRisks.find((r) => r.id === parseInt(id));
    return risk || null;
  }
  const response = await api.get(`/api/risks/${id}`);
  return response.data;
};

// ─────────────────────────────────────────────────────────

export const createRisk = async (data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return { ...data, id: Date.now() };
  }
  const response = await api.post("/api/risks", data);
  return response.data;
};

// ─────────────────────────────────────────────────────────

export const updateRisk = async (id, data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return { ...data, id };
  }
  const response = await api.put(`/api/risks/${id}`, data);
  return response.data;
};

// ─────────────────────────────────────────────────────────

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
    return { ...mockAiAnalysis };
  }
  const response = await api.get(`/api/risks/${riskId}/ai-analysis`);
  return response.data;
};

// ─────────────────────────────────────────────────────────

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