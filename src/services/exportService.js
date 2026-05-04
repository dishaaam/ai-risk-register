import { mockRisks } from "./mockData";

// Convert risks array to CSV string
const convertToCSV = (risks) => {
  const headers = [
    "ID",
    "Title",
    "Category",
    "Status",
    "Priority",
    "Score",
    "Owner",
    "Created Date",
    "Description",
  ];

  const rows = risks.map((risk) => [
    risk.id,
    `"${risk.title}"`,
    risk.category,
    risk.status,
    risk.priority,
    risk.score,
    `"${risk.owner}"`,
    risk.createdDate,
    `"${risk.description || ""}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  return csvContent;
};

// Download CSV file
export const downloadCSV = (risks = mockRisks) => {
  const csv = convertToCSV(risks);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `risk-register-${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download JSON file
export const downloadJSON = (risks = mockRisks) => {
  const json = JSON.stringify(risks, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `risk-register-${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};