import { Outlet } from "react-router-dom";
import Sidebar from "/src/components/layout/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-6">
        <Outlet />
      </main>
    </div>
  );
}
