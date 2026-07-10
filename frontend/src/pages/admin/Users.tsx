import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

// ============================================================
// TYPES
// ============================================================
type Role = "Super Admin" | "Admin" | "User";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [savingAdd, setSavingAdd] = useState<boolean>(false);

  const fetchUsers = async (): Promise<void> => {
    try {
      // ===============================
      // BACKEND LARAVEL NANTI
      // ===============================

      // const response = await axios.get(
      //   "http://localhost:8000/api/users"
      // );

      // setUsers(response.data.data);

      const dummyUsers: User[] = [
        {
          id: 1,
          name: "Administrator Utama",
          email: "admin@lspmbk.com",
          role: "Admin",
          created_at: "10 Juli 2026",
        },
        {
          id: 2,
          name: "Admin Sertifikasi",
          email: "sertifikasi@lspmbk.com",
          role: "Admin",
          created_at: "09 Juli 2026",
        },
        {
          id: 3,
          name: "Budi Santoso",
          email: "budi@gmail.com",
          role: "User",
          created_at: "08 Juli 2026",
        },
        {
          id: 4,
          name: "Siti Rahma",
          email: "siti@gmail.com",
          role: "User",
          created_at: "07 Juli 2026",
        },
      ];

      setTimeout(() => {
        setUsers(dummyUsers);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // panggil sekali saat komponen pertama kali render
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // reset ke halaman 1 setiap kali hasil pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const openEditModal = (user: User): void => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = (): void => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleSaveEdit = async (updatedUser: User): Promise<void> => {
    setSavingEdit(true);
    try {
      // ===============================
      // BACKEND LARAVEL NANTI
      // ===============================
      // await axios.put(
      //   `http://localhost:8000/api/users/${updatedUser.id}`,
      //   updatedUser,
      // );

      await new Promise((resolve) => setTimeout(resolve, 600));

      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      );
      closeEditModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingEdit(false);
    }
  };

  const openAddModal = (): void => {
    setShowAddModal(true);
  };

  const closeAddModal = (): void => {
    setShowAddModal(false);
  };

  const handleAddUser = async (
    newUser: Omit<User, "id" | "created_at">,
  ): Promise<void> => {
    setSavingAdd(true);
    try {
      // ===============================
      // BACKEND LARAVEL NANTI
      // ===============================
      // const response = await axios.post(
      //   "http://localhost:8000/api/users",
      //   newUser,
      // );
      // setUsers((prev) => [...prev, response.data.data]);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const createdUser: User = {
        ...newUser,
        id: Date.now(),
        created_at: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };

      setUsers((prev) => [createdUser, ...prev]);
      closeAddModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingAdd(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Manajemen Pengguna
          </h1>
          <p className="mt-1 text-slate-500">
            Kelola akun administrator dan pengguna sistem.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#F4C233] px-5 py-3 text-black transition hover:bg-[#fbe4a5]"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5">Nama</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Dibuat</th>
                <th className="px-6 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <span className="text-sm font-medium text-slate-500">
                        Tidak ada data
                      </span>
                      <span className="text-xs">
                        Belum ada pengguna yang cocok dengan pencarian.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-500">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          user.role === "Super Admin"
                            ? "bg-red-50 text-red-700 ring-red-200"
                            : user.role === "Admin"
                              ? "bg-blue-50 text-blue-700 ring-blue-200"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.role === "Super Admin"
                              ? "bg-red-500"
                              : user.role === "Admin"
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                          }`}
                        />
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {user.created_at}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
                        <button
                          title="Edit"
                          onClick={() => openEditModal(user)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-yellow-50 hover:text-yellow-700"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title="Hapus"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-medium text-slate-700">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>
              {"–"}
              <span className="font-medium text-slate-700">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-700">
                {filteredUsers.length}
              </span>{" "}
              akun
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1,
                  )
                  .map((page, idx, arr) => (
                    <div key={page} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-1.5 text-slate-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition ${
                          page === currentPage
                            ? "bg-slate-800 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edit Pengguna */}
      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          saving={savingEdit}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal Tambah Pengguna */}
      {showAddModal && (
        <AddUserModal
          saving={savingAdd}
          onClose={closeAddModal}
          onSave={handleAddUser}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: Edit Pengguna
// ============================================================
interface EditUserModalProps {
  user: User;
  saving: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

function EditUserModal({ user, saving, onClose, onSave }: EditUserModalProps) {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [role, setRole] = useState<Role>(user.role);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSave({ ...user, name, email, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Edit Pengguna
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value as Role)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#F4C233] px-5 py-2.5 text-sm  text-black transition hover:bg-[#fbe4a5] disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: Tambah Pengguna
// ============================================================
interface AddUserModalProps {
  saving: boolean;
  onClose: () => void;
  onSave: (newUser: Omit<User, "id" | "created_at">) => void;
}

function AddUserModal({ saving, onClose, onSave }: AddUserModalProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<Role>("User");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setError("");
    onSave({ name, email, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Tambah Pengguna
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="Nama lengkap"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="nama@email.com"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setRole(e.target.value as Role)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#F4C233] px-5 py-2.5 text-sm  text-black transition hover:bg-[#fbe4a5] disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
