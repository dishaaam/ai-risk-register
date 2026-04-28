import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RiskListPage from "./pages/RiskListPage";
import RiskFormPage from "./pages/RiskFormPage";
import DashboardPage from "./pages/DashboardPage";
import RiskDetailPage from "./pages/RiskDetailPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Risk List */}
            <Route
              path="/risks"
              element={
                <ProtectedRoute>
                  <RiskListPage />
                </ProtectedRoute>
              }
            />

            {/* Risk Detail — coming Day 7 */}
            <Route
  path="/risks/:id"
  element={
    <ProtectedRoute>
      <RiskDetailPage />
    </ProtectedRoute>
  }
/>

            {/* Create Risk — ADMIN and MANAGER only */}
            <Route
              path="/create"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                  <RiskFormPage />
                </ProtectedRoute>
              }
            />

            {/* Edit Risk — ADMIN and MANAGER only */}
            <Route
              path="/risks/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                  <RiskFormPage />
                </ProtectedRoute>
              }
            />

            {/* Analytics — coming Day 10 */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <div className="p-6 text-gray-500">Analytics page coming Day 10...</div>
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl mb-4">404</p>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Page Not Found
                    </h2>
                    <button
                      onClick={() => window.location.href = "/dashboard"}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Go back home
                    </button>
                  </div>
                </div>
              }
            />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;