import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleBadgeStyles = {
  ADMIN: "bg-red-500",
  MANAGER: "bg-yellow-500",
  VIEWER: "bg-green-500",
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinks = [
    { label: "🏠 Dashboard", path: "/dashboard" },
    { label: "📋 Risk List", path: "/risks" },
    { label: "📊 Analytics", path: "/analytics" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-900 text-white px-6 py-3 flex justify-between items-center shadow sticky top-0 z-40">

      {/* Left — Logo + Nav Links */}
      <div className="flex items-center gap-6">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-lg hidden sm:block">AI Risk Register</span>
        </div>

        {/* Nav Links — only show when logged in */}
        {isAuthenticated && (
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive(link.path)
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-blue-100 hover:bg-blue-800"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right — User info and logout */}
      {isAuthenticated && user ? (
        <div className="flex items-center gap-4">

          {/* User Info */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-white text-xs font-semibold">
                {user.name}
              </span>
              <span className="text-blue-300 text-xs">{user.email}</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full text-white font-semibold ${
                roleBadgeStyles[user.role] || "bg-gray-500"
              }`}
            >
              {user.role}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-blue-700"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm bg-blue-800 hover:bg-red-600 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            <span>⎋</span>
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      ) : (
        // Show login button if not authenticated
        !isAuthenticated && location.pathname !== "/login" && (
          <button
            onClick={() => navigate("/login")}
            className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
          >
            Login
          </button>
        )
      )}
    </nav>
  );
};

export default Navbar;