import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ImageIcon,
  Loader2,
  AlertTriangle,
  Calendar,
  Newspaper,
  Eye,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function Berita() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBerita, setEditingBerita] = useState(null); // null = mode tambah
  const [deletingBerita, setDeletingBerita] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // const response = await axios.get("http://localhost:8000/api/berita");
      // setBeritaList(response.data.data);

      const dummyData = [
        {
          id: 1,
          judul: "Pembukaan Sertifikasi Digital Marketing 2026",
          ringkasan:
            "LSP Multi Bintang Komunikasi resmi membuka pendaftaran sertifikasi kompetensi Digital Marketing untuk periode Juli 2026.",
          gambar:
            "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=300&fit=crop",
          status: "Publish",
          tanggalPublikasi: "2026-07-10",
        },
        {
          id: 2,
          judul: "Pelatihan Asesor Kompetensi Batch 12",
          ringkasan:
            "Program pelatihan asesor kompetensi kembali digelar untuk mempersiapkan asesor bersertifikat baru.",
          gambar:
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
          status: "Publish",
          tanggalPublikasi: "2026-07-08",
        },
        {
          id: 3,
          judul: "Skema Baru: Multimedia Content Creator",
          ringkasan:
            "Skema sertifikasi baru untuk kompetensi pembuatan konten multimedia kini tersedia.",
          gambar:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
          status: "Draft",
          tanggalPublikasi: "2026-07-05",
        },
        {
          id: 4,
          judul: "Kerja Sama dengan Industri Kreatif Surabaya",
          ringkasan:
            "LSP MBK menjalin kerja sama strategis dengan beberapa perusahaan industri kreatif di Surabaya.",
          gambar:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
          status: "Draft",
          tanggalPublikasi: "2026-06-28",
        },
      ];

      setTimeout(() => {
        setBeritaList(dummyData);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const filteredBerita = beritaList.filter((b) => {
    const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Semua" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE);
  const paginatedBerita = filteredBerita.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const openAddModal = () => {
    setEditingBerita(null);
    setShowFormModal(true);
  };

  const openEditModal = (berita) => {
    setEditingBerita(berita);
    setShowFormModal(true);
  };

  const openDeleteModal = (berita) => {
    setDeletingBerita(berita);
    setShowDeleteModal(true);
  };

  const handleSave = async (formData) => {
    setSubmitting(true);
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // const payload = new FormData();
      // payload.append("judul", formData.judul);
      // payload.append("ringkasan", formData.ringkasan);
      // payload.append("status", formData.status);
      // payload.append("tanggalPublikasi", formData.tanggalPublikasi);
      // if (formData.gambarFile) payload.append("gambar", formData.gambarFile);
      //
      // if (editingBerita) {
      //   await axios.post(`http://localhost:8000/api/berita/${editingBerita.id}?_method=PUT`, payload);
      // } else {
      //   await axios.post("http://localhost:8000/api/berita", payload);
      // }
      // await fetchBerita();

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingBerita) {
        setBeritaList((prev) =>
          prev.map((b) =>
            b.id === editingBerita.id
              ? {
                  ...b,
                  judul: formData.judul,
                  ringkasan: formData.ringkasan,
                  status: formData.status,
                  tanggalPublikasi: formData.tanggalPublikasi,
                  gambar: formData.gambarPreview || b.gambar,
                }
              : b,
          ),
        );
      } else {
        setBeritaList((prev) => [
          {
            id: Date.now(),
            judul: formData.judul,
            ringkasan: formData.ringkasan,
            status: formData.status,
            tanggalPublikasi: formData.tanggalPublikasi,
            gambar: formData.gambarPreview,
          },
          ...prev,
        ]);
      }

      setShowFormModal(false);
      setEditingBerita(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // await axios.delete(`http://localhost:8000/api/berita/${deletingBerita.id}`);

      await new Promise((resolve) => setTimeout(resolve, 600));

      setBeritaList((prev) => prev.filter((b) => b.id !== deletingBerita.id));
      setShowDeleteModal(false);
      setDeletingBerita(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTanggal = (isoDate) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-8 2xl:p-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-7 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Berita
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Kelola artikel dan pengumuman yang tampil di website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#F4C233] px-5 py-3  text-black shadow-sm transition hover:bg-[#fbe4a5]"
        >
          <Plus size={18} />
          Tambah Berita
        </button>
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari judul berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          {["Semua", "Publish", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5">Berita</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Tanggal Publikasi</th>
                <th className="px-6 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedBerita.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <Newspaper size={28} className="mb-1 opacity-40" />
                      <span className="text-sm font-medium text-slate-500">
                        Tidak ada berita
                      </span>
                      <span className="text-xs">
                        Coba ubah kata kunci atau filter status.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBerita.map((berita) => (
                  <tr
                    key={berita.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {berita.gambar ? (
                            <img
                              src={berita.gambar}
                              alt={berita.judul}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-300">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-slate-800">
                            {berita.judul}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
                            {berita.ringkasan}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          berita.status === "Publish"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            berita.status === "Publish"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {berita.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatTanggal(berita.tanggalPublikasi)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
                        <button
                          title="Lihat"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => openEditModal(berita)}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-yellow-50 hover:text-yellow-700"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(berita)}
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
        {!loading && filteredBerita.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-medium text-slate-700">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>
              {"–"}
              <span className="font-medium text-slate-700">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredBerita.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-slate-700">
                {filteredBerita.length}
              </span>{" "}
              berita
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>

              <span className="px-2 text-sm text-slate-500">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form Tambah/Edit */}
      {showFormModal && (
        <BeritaFormModal
          initialData={editingBerita}
          submitting={submitting}
          onClose={() => {
            setShowFormModal(false);
            setEditingBerita(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && deletingBerita && (
        <DeleteConfirmModal
          berita={deletingBerita}
          submitting={submitting}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingBerita(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: Tambah / Edit Berita
// ============================================================
function BeritaFormModal({ initialData, submitting, onClose, onSave }) {
  const isEdit = Boolean(initialData);

  const [judul, setJudul] = useState(initialData?.judul || "");
  const [ringkasan, setRingkasan] = useState(initialData?.ringkasan || "");
  const [status, setStatus] = useState(initialData?.status || "Draft");
  const [tanggalPublikasi, setTanggalPublikasi] = useState(
    initialData?.tanggalPublikasi || new Date().toISOString().split("T")[0],
  );

  const [gambarFile, setGambarFile] = useState(null);
  const [gambarPreview, setGambarPreview] = useState(
    initialData?.gambar || null,
  );

  const [errors, setErrors] = useState({});
  const gambarInputRef = useRef(null);

  const handleGambarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, gambar: "File harus berupa gambar." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, gambar: "Ukuran gambar maksimal 2MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, gambar: null }));
    setGambarFile(file);
    setGambarPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!judul.trim()) newErrors.judul = "Judul berita wajib diisi.";
    if (!ringkasan.trim()) newErrors.ringkasan = "Ringkasan wajib diisi.";
    if (!tanggalPublikasi)
      newErrors.tanggalPublikasi = "Tanggal publikasi wajib diisi.";
    if (!gambarPreview) newErrors.gambar = "Gambar berita wajib diunggah.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      judul,
      ringkasan,
      status,
      tanggalPublikasi,
      gambarFile,
      gambarPreview,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? "Edit Berita" : "Tambah Berita"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Judul Berita
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pembukaan Sertifikasi Digital Marketing 2026"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.judul ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.judul && (
                <p className="mt-1 text-xs text-red-500">{errors.judul}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Ringkasan / Isi Berita
              </label>
              <textarea
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                rows={5}
                placeholder="Tulis isi berita di sini..."
                className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.ringkasan ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.ringkasan && (
                <p className="mt-1 text-xs text-red-500">{errors.ringkasan}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Tanggal Publikasi
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="date"
                    value={tanggalPublikasi}
                    onChange={(e) => setTanggalPublikasi(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 pl-11 text-sm outline-none focus:border-blue-500 ${
                      errors.tanggalPublikasi
                        ? "border-red-300"
                        : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.tanggalPublikasi && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.tanggalPublikasi}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setStatus("Draft")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      status === "Draft"
                        ? "bg-white text-amber-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Publish")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      status === "Publish"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Gambar */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Gambar Berita
              </label>

              <input
                ref={gambarInputRef}
                type="file"
                accept="image/*"
                onChange={handleGambarChange}
                className="hidden"
              />

              {gambarPreview ? (
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
                  <img
                    src={gambarPreview}
                    alt="Preview"
                    className="h-20 w-28 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {gambarFile?.name || "Gambar saat ini"}
                    </p>
                    <button
                      type="button"
                      onClick={() => gambarInputRef.current?.click()}
                      className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Ganti gambar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => gambarInputRef.current?.click()}
                  className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed py-8 text-slate-400 transition hover:border-blue-300 hover:bg-blue-50/30 ${
                    errors.gambar ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <ImageIcon size={24} />
                  <span className="text-sm">
                    Klik untuk unggah gambar (JPG/PNG, maks 2MB)
                  </span>
                </button>
              )}
              {errors.gambar && (
                <p className="mt-1 text-xs text-red-500">{errors.gambar}</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-[#F4C233] px-5 py-2.5 text-sm  text-black transition hover:bg-[#fbe4a5] disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Simpan Perubahan" : "Simpan Berita"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: Konfirmasi Hapus
// ============================================================
function DeleteConfirmModal({ berita, submitting, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          Hapus berita ini?
        </h3>
        <p className="mt-1.5 text-sm text-slate-500">
          Berita{" "}
          <span className="font-medium text-slate-700">"{berita.judul}"</span>{" "}
          akan dihapus permanen dan tidak dapat dikembalikan.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
