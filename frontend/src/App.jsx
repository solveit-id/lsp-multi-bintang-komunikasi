import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Skema from "./pages/skema";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import SkemaAdmin from "./pages/admin/skema_sertifikasi";
import Berita from "./pages/admin/berita";
import Testimonial from "./pages/admin/Testimonial";

import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/skema" element={<Skema />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/skema" element={<SkemaAdmin />} />
          <Route path="/admin/berita" element={<Berita />} />
          <Route path="/admin/testimonial" element={<Testimonial />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
