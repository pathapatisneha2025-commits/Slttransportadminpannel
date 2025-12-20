import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiBox, FiCalendar } from "react-icons/fi"; // icons

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Banners", path: "/admin/banners", icon: <FiHome /> },
    { name: "Services", path: "/admin/services", icon: <FiBox /> },
    { name: "Blogs", path: "/admin/blogs", icon: <FiCalendar /> },
  ];

  const handleLogout = async () => {
    alert("Logged out successfully"); // Replace with actual API if needed
    navigate("/admin/login");
  };

  return (
    <div style={dashboardContainer}>
      <aside style={sidebar}>
        <h2 style={sidebarTitle}>SLT Admin</h2>

        <div style={navContainer}>
          {navItems.map((item) => (
            <div
              key={item.path}
              style={{
                ...navItemStyle,
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={iconStyle}>{item.icon}</span>
              {item.name}
            </div>
          ))}
        </div>

        <div style={logoutStyle} onClick={handleLogout}>
          <FiLogOut style={{ marginRight: "8px" }} />
          Logout
        </div>
      </aside>

      <main style={mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

// --- Styles ---
const dashboardContainer = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f4f6f8",
};

const sidebar = {
  width: "250px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#2c3e50",
  padding: "30px 20px",
  borderRadius: "0 12px 12px 0",
  boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  color: "#fff",
};

const sidebarTitle = {
  marginBottom: "40px",
  fontSize: "1.7rem",
  fontWeight: "700",
  letterSpacing: "1px",
};

const navContainer = {
  flex: 1,
};

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "12px",
  cursor: "pointer",
  fontWeight: "500",
  color: "#fff",
  transition: "all 0.3s",
};

const iconStyle = {
  marginRight: "12px",
  fontSize: "1.2rem",
};

const logoutStyle = {
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "8px",
  backgroundColor: "#e74c3c",
  fontWeight: "600",
  cursor: "pointer",
  justifyContent: "center",
  transition: "0.3s",
};

const mainContent = {
  flex: 1,
  padding: "30px",
  backgroundColor: "#ecf0f1",
  borderRadius: "0 0 12px 12px",
};

export default AdminLayout;
