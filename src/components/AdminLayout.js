import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FiLogOut, FiHome, FiBox, FiCalendar, FiMenu, FiX } from "react-icons/fi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar toggle
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navItems = [
    { name: "Banners", path: "/admin/banners", icon: <FiHome /> },
    { name: "Services", path: "/admin/services", icon: <FiBox /> },
    { name: "Blogs", path: "/admin/blogs", icon: <FiCalendar /> },
  ];

  const handleLogout = () => {
    alert("Logged out successfully"); // Replace with actual API
    navigate("/admin/login");
  };

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={dashboardContainer}>
      {/* Hamburger button only on mobile */}
      {isMobile && (
        <button style={hamburgerButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      <aside
        style={{
          ...sidebar,
          transform: isMobile
            ? isOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)",
          position: isMobile ? "fixed" : "relative",
        }}
      >
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
              onClick={() => {
                navigate(item.path);
                if (isMobile) setIsOpen(false);
              }}
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

      <main
       style={{
    ...mainContent,
    // Remove the marginLeft logic here!
    // flex: 1 in mainContent handles the spacing automatically.
    marginLeft: 0, 
  }}
>
    
        <Outlet />
      </main>
    </div>
  );
};

// --- Styles ---
const dashboardContainer = {
  display: "flex",
  width: "100%",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  // Change this to match the sidebar color:
  backgroundColor: "#2c3e50", 
  alignItems: "flex-start",
};

const hamburgerButton = {
  position: "fixed",
  top: 15,
  left: 15,
  zIndex: 1000,
  background: "#2c3e50",
  border: "none",
  color: "#fff",
  padding: "8px 10px",
  borderRadius: "8px",
  cursor: "pointer",
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

const sidebar = {
  width: "250px",
  minWidth: "250px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#2c3e50",
  padding: "30px 20px",
  boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  color: "#fff",
  transition: "transform 0.3s ease",
  zIndex: 999,
  height: "100vh", 
  // Change position logic here:
  top: 0,
  left: 0,
};
const mainContent = {
  flex: 1,
  padding: "30px",
  backgroundColor: "#ecf0f1", // A slightly different grey to see the section
  minHeight: "100vh",
  width: "100%",
};
export default AdminLayout;
