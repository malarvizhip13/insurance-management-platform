import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaMoneyBill,
  FaFolderOpen,
  FaUserTie,
  FaSignOutAlt,
} from "react-icons/fa";
import { supabase } from "../services/config";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "white",
    background: location.pathname === path ? "#2563eb" : "transparent",
  });

  return (
    <div
      style={{
        width: "240px",
        background: "#1e293b",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Insurance</h2>

      <hr />

      <Link to="/dashboard" style={linkStyle("/dashboard")}>
        <FaHome /> Dashboard
      </Link>

      <Link to="/customers" style={linkStyle("/customers")}>
        <FaUsers /> Customers
      </Link>

      <Link to="/policies" style={linkStyle("/policies")}>
        <FaFileAlt /> Policies
      </Link>

      <Link to="/claims" style={linkStyle("/claims")}>
        <FaClipboardList /> Claims
      </Link>

      <Link to="/payments" style={linkStyle("/payments")}>
        <FaMoneyBill /> Payments
      </Link>

      <Link to="/documents" style={linkStyle("/documents")}>
        <FaFolderOpen /> Documents
      </Link>

      <Link to="/employees" style={linkStyle("/employees")}>
        <FaUserTie /> Employees
      </Link>

      <hr />

      <button
        onClick={logout}
        style={{
          width: "100%",
          padding: "10px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;