import api from "./api";
import { mockRisks } from "./mockData";

const USE_MOCK = true; // Change to false when backend is ready

// Local copy we can mutate during mock mode
let localRisks = [...mockRisks];

// GET all risks with pagination and sorting
export const getRisks = async (page = 0, size = 10, sortBy = "createdDate", sortDir = "desc") => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));

    let filtered = [...localRisks];

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
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

  const params = new URLSearchParams({ page, size, sortBy, sortDir });
  const response = await api.get(`/api/risks?${params}`);
  return response.data;
};

// GET single risk by ID
export const getRiskById = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    return localRisks.find((r) => r.id === parseInt(id)) || null;
  }
  const response = await api.get(`/api/risks/${id}`);
  return response.data;
};

// POST create risk
export const createRisk = async (data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));

    // Generate new ID
    const newId = Math.max(...localRisks.map((r) => r.id)) + 1;

    const newRisk = {
      ...data,
      id: newId,
      createdDate: new Date().toISOString().split("T")[0], // today's date
    };

    // ADD to local array so list shows it
    localRisks.push(newRisk);

    return newRisk;
  }
  const response = await api.post("/api/risks", data);
  return response.data;
};

// PUT update risk
export const updateRisk = async (id, data) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 800));

    // Find and UPDATE in local array
    const index = localRisks.findIndex((r) => r.id === parseInt(id));
    if (index !== -1) {
      localRisks[index] = { ...localRisks[index], ...data };
    }

    return localRisks[index];
  }
  const response = await api.put(`/api/risks/${id}`, data);
  return response.data;
};

// DELETE risk
export const deleteRisk = async (id) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 500));

    // REMOVE from local array
    localRisks = localRisks.filter((r) => r.id !== parseInt(id));

    return true;
  }
  await api.delete(`/api/risks/${id}`);
  return true;
};