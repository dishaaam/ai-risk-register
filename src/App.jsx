import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RiskListPage from "./pages/RiskListPage";
import RiskFormPage from "./pages/RiskFormPage";
import { mockRisks } from "./services/mockData";

function App() {
  const [risks, setRisks] = useState(mockRisks);

  const addRisk = (newRisk) => {
    setRisks((prev) => [
      ...prev,
      {
        ...newRisk,
        id: prev.length + 1,
        createdDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const updateRisk = (id, updatedRisk) => {
    setRisks((prev) =>
      prev.map((r) => (r.id === parseInt(id) ? { ...r, ...updatedRisk } : r))
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/risks" />} />
          <Route path="/risks" element={<RiskListPage risks={risks} />} />
          <Route path="/create" element={<RiskFormPage onSubmit={addRisk} />} />
          <Route
            path="/risks/:id/edit"
            element={<RiskFormPage risks={risks} onSubmit={updateRisk} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;