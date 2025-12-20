import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import BannerAdmin from "./pages/banner";
import ServicesAdmin from "./pages/srvicesadmin";
import AdminLayout from "./components/AdminLayout";
import BlogAdmin from "./pages/blogs";
// import BlogAdmin when ready

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/admin" />} />
        
        

        {/* Protected/admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/banners" element={<BannerAdmin />} />
          <Route path="/admin/services" element={<ServicesAdmin />} />
          <Route path="/admin/blogs" element={<BlogAdmin />} />
          <Route index element={<BannerAdmin />} /> {/* default page */}
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
