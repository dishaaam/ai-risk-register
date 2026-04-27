import api from "./api";
import { mockRisks, mockStats } from "./mockData";

const USE_MOCK = true; // Change to false when backend is ready

// GET all risks with pagination and sorting
export const getRisks = async (page = 0, size = 10, sortBy = "createdDate", sortDir = "desc", search = "") => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 1000));

    let filtered = [...mockRisks];

    if (search) {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Simulate sorting
    filtered.sort((a, b) => {
      if (sortDir === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

    // Simulate pagination
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
  const response = await api.get(`/api/risks?${params}`);
  return response.data;
};

// GET single risk by ID
export const getRiskById = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    return mockRisks.find((r) => r.id === parseInt(id)) || null;
  }
  const response = await api.get(`/api/risks/${id}`);
  return response.data;
};

// POST create risk
export const createRisk = async (data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return { ...data, id: Date.now() };
  }
  const response = await api.post("/api/risks", data);
  return response.data;
};

// PUT update risk
export const updateRisk = async (id, data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return { ...data, id };
  }
  const response = await api.put(`/api/risks/${id}`, data);
  return response.data;
};

// DELETE risk
export const deleteRisk = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));
    return true;
  }
  await api.delete(`/api/risks/${id}`);
  return true;
};

// GET dashboard stats
export const getStats = async () => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));
    return mockStats;
  }
  const response = await api.get("/api/risks/stats");
  return response.data;
};