import {
  LayoutDashboard,
  Users,
  FileBadge,
  ClipboardList,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
  icons,
  Newspaper,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "Kelola User",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Skema Sertifikasi",
      icon: FileBadge,
      path: "/admin/skema",
    },
    {
      title: "Berita",
      icon: Newspaper,
      path: "/admin/berita",
    },
    {
      title: "Testimonial",
      icon: UserCog,
      path: "/admin/testimonial",
    },
  ];

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 left-5 z-50 rounded-lg bg-[#1E2A45] p-2 text-black lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-[#fffff] text-black transition-all duration-300 shadow-2xl
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl">
              <img
                src="/src/assets/logo.png"
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <h2 className="font-bold">LSP Multi Bintang Komunikasi</h2>
              <p className="text-xs text-black-300">Admin Panel</p>
            </div>
          </div>

          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menu */}
        <div className="mt-6 px-4">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = location.pathname === menu.path;

            return (
              <Link
                key={menu.title}
                to={menu.path}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition
                ${
                  active
                    ? "bg-[#F4C233] text-[#1E2A45] font-semibold"
                    : "hover:bg-[#fbe4a5]"
                }`}
              >
                <Icon size={20} />
                <span>{menu.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-500 transition">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
