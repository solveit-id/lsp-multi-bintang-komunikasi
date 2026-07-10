import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  FileText,
  ImageIcon,
  Loader2,
  AlertTriangle,
  Download,
  BadgeCheck,
} from "lucide-react";

const JENJANG_OPTIONS = [
  "KKNI I",
  "KKNI II",
  "KKNI III",
  "KKNI IV",
  "Okupasi",
] as const;
type Jenjang = (typeof JENJANG_OPTIONS)[number];

interface Skema {
  id: number;
  nama: string;
  kode: string;
  jenjang: Jenjang;
  deskripsi: string;
  gambar: string | null;
  dokumen: string | null;
  createdAt: string;
}

interface SkemaFormValues {
  nama: string;
  kode: string;
  jenjang: Jenjang;
  deskripsi: string;
  gambarFile: File | null;
  gambarPreview: string | null;
  dokumenFile: File | null;
}

export default function SkemaSertifikasi() {
  const [skemaList, setSkemaList] = useState<Skema[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [editingSkema, setEditingSkema] = useState<Skema | null>(null);
  const [deletingSkema, setDeletingSkema] = useState<Skema | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchSkema();
  }, []);

  const fetchSkema = async (): Promise<void> => {
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // const response = await axios.get("http://localhost:8000/api/skema");
      // setSkemaList(response.data.data);

      const dummyData: Skema[] = [
        {
          id: 1,
          nama: "Digital Marketing",
          kode: "SKM-001",
          jenjang: "KKNI III",
          deskripsi:
            "Skema sertifikasi kompetensi bidang pemasaran digital, mencakup SEO, SEM, dan social media marketing.",
          gambar:
            "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop",
          dokumen: "skema-digital-marketing.pdf",
          createdAt: "10 Juli 2026",
        },
        {
          id: 2,
          nama: "Junior Web Developer",
          kode: "SKM-002",
          jenjang: "KKNI IV",
          deskripsi:
            "Skema sertifikasi untuk kompetensi pengembangan aplikasi web tingkat junior menggunakan HTML, CSS, dan JavaScript.",
          gambar:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
          dokumen: "skema-web-developer.pdf",
          createdAt: "08 Juli 2026",
        },
        {
          id: 3,
          nama: "Multimedia Content Creator",
          kode: "SKM-003",
          jenjang: "Okupasi",
          deskripsi:
            "Skema sertifikasi kompetensi pembuatan konten multimedia untuk kebutuhan promosi dan media sosial.",
          gambar:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
          dokumen: null,
          createdAt: "05 Juli 2026",
        },
      ];

      setTimeout(() => {
        setSkemaList(dummyData);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const filteredSkema = skemaList.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.kode.toLowerCase().includes(search.toLowerCase()),
  );

  const openAddModal = (): void => {
    setEditingSkema(null);
    setShowFormModal(true);
  };

  const openEditModal = (skema: Skema): void => {
    setEditingSkema(skema);
    setShowFormModal(true);
  };

  const openDeleteModal = (skema: Skema): void => {
    setDeletingSkema(skema);
    setShowDeleteModal(true);
  };

  const handleSave = async (formData: SkemaFormValues): Promise<void> => {
    setSubmitting(true);
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // const payload = new FormData();
      // payload.append("nama", formData.nama);
      // payload.append("kode", formData.kode);
      // payload.append("jenjang", formData.jenjang);
      // payload.append("deskripsi", formData.deskripsi);
      // if (formData.gambarFile) payload.append("gambar", formData.gambarFile);
      // if (formData.dokumenFile) payload.append("dokumen", formData.dokumenFile);
      //
      // if (editingSkema) {
      //   await axios.post(`http://localhost:8000/api/skema/${editingSkema.id}?_method=PUT`, payload);
      // } else {
      //   await axios.post("http://localhost:8000/api/skema", payload);
      // }
      // await fetchSkema();

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingSkema) {
        setSkemaList((prev) =>
          prev.map((s) =>
            s.id === editingSkema.id
              ? {
                  ...s,
                  nama: formData.nama,
                  kode: formData.kode,
                  jenjang: formData.jenjang,
                  deskripsi: formData.deskripsi,
                  gambar: formData.gambarPreview || s.gambar,
                  dokumen: formData.dokumenFile?.name || s.dokumen,
                }
              : s,
          ),
        );
      } else {
        const newSkema: Skema = {
          id: Date.now(),
          nama: formData.nama,
          kode: formData.kode,
          jenjang: formData.jenjang,
          deskripsi: formData.deskripsi,
          gambar: formData.gambarPreview,
          dokumen: formData.dokumenFile?.name || null,
          createdAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
        setSkemaList((prev) => [newSkema, ...prev]);
      }

      setShowFormModal(false);
      setEditingSkema(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingSkema) return;
    setSubmitting(true);
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // await axios.delete(`http://localhost:8000/api/skema/${deletingSkema.id}`);

      await new Promise((resolve) => setTimeout(resolve, 600));

      setSkemaList((prev) => prev.filter((s) => s.id !== deletingSkema.id));
      setShowDeleteModal(false);
      setDeletingSkema(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-8 2xl:p-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-7 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Skema Sertifikasi
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Kelola skema sertifikasi kompetensi beserta dokumen dan gambar
            keterangannya.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#F4C233] px-5 py-3  text-black shadow-sm transition hover:bg-[#fbe4a5]"
        >
          <Plus size={18} />
          Tambah Skema
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau kode skema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm text-slate-400">
            Memuat skema sertifikasi...
          </span>
        </div>
      ) : filteredSkema.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-slate-400">
          <BadgeCheck size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-medium text-slate-500">
            Belum ada skema sertifikasi
          </p>
          <p className="mt-1 text-xs">
            Klik &quot;Tambah Skema&quot; untuk membuat skema baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSkema.map((skema) => (
            <div
              key={skema.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
            >
              {/* Gambar */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                {skema.gambar ? (
                  <img
                    src={skema.gambar}
                    alt={skema.nama}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageIcon size={32} />
                  </div>
                )}

                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                  {skema.jenjang}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs font-medium text-blue-600">
                  {skema.kode}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-800">
                  {skema.nama}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {skema.deskripsi}
                </p>

                {/* Dokumen */}
                <div className="mt-4">
                  {skema.dokumen ? (
                    <a
                      href="#"
                      onClick={(e: { preventDefault: () => any }) =>
                        e.preventDefault()
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg
                      bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700
                      transition hover:bg-red-100"
                    >
                      <FileText size={13} />
                      {skema.dokumen}
                      <Download size={12} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-400">
                      <FileText size={13} />
                      Belum ada dokumen
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">
                    Dibuat {skema.createdAt}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(skema)}
                      title="Edit"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-yellow-50 hover:text-yellow-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(skema)}
                      title="Hapus"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form Tambah/Edit */}
      {showFormModal && (
        <SkemaFormModal
          initialData={editingSkema}
          submitting={submitting}
          onClose={() => {
            setShowFormModal(false);
            setEditingSkema(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && deletingSkema && (
        <DeleteConfirmModal
          skema={deletingSkema}
          submitting={submitting}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingSkema(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: Tambah / Edit Skema
// ============================================================
interface SkemaFormModalProps {
  initialData: Skema | null;
  submitting: boolean;
  onClose: () => void;
  onSave: (formData: SkemaFormValues) => void;
}

function SkemaFormModal({
  initialData,
  submitting,
  onClose,
  onSave,
}: SkemaFormModalProps) {
  const isEdit = Boolean(initialData);

  const [nama, setNama] = useState<string>(initialData?.nama || "");
  const [kode, setKode] = useState<string>(initialData?.kode || "");
  const [jenjang, setJenjang] = useState<Jenjang>(
    initialData?.jenjang || JENJANG_OPTIONS[0],
  );
  const [deskripsi, setDeskripsi] = useState<string>(
    initialData?.deskripsi || "",
  );

  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [gambarPreview, setGambarPreview] = useState<string | null>(
    initialData?.gambar || null,
  );
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const [dokumenName, setDokumenName] = useState<string | null>(
    initialData?.dokumen || null,
  );

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const gambarInputRef = useRef<HTMLInputElement>(null);
  const dokumenInputRef = useRef<HTMLInputElement>(null);

  const handleGambarChange = (e: ChangeEvent<HTMLInputElement>): void => {
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

  const handleDokumenChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, dokumen: "File harus berformat PDF." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, dokumen: "Ukuran PDF maksimal 5MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, dokumen: null }));
    setDokumenFile(file);
    setDokumenName(file.name);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    if (!nama.trim()) newErrors.nama = "Nama skema wajib diisi.";
    if (!kode.trim()) newErrors.kode = "Kode skema wajib diisi.";
    if (!deskripsi.trim()) newErrors.deskripsi = "Deskripsi wajib diisi.";
    if (!gambarPreview) newErrors.gambar = "Gambar keterangan wajib diunggah.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      nama,
      kode,
      jenjang,
      deskripsi,
      gambarFile,
      gambarPreview,
      dokumenFile,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? "Edit Skema Sertifikasi" : "Tambah Skema Sertifikasi"}
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nama Skema
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Digital Marketing"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.nama ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.nama && (
                <p className="mt-1 text-xs text-red-500">{errors.nama}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Kode Skema
              </label>
              <input
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="Contoh: SKM-004"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.kode ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.kode && (
                <p className="mt-1 text-xs text-red-500">{errors.kode}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Jenjang
              </label>
              <select
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value as Jenjang)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {JENJANG_OPTIONS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Deskripsi
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={3}
                placeholder="Jelaskan cakupan kompetensi skema ini..."
                className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 ${
                  errors.deskripsi ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.deskripsi && (
                <p className="mt-1 text-xs text-red-500">{errors.deskripsi}</p>
              )}
            </div>

            {/* Upload Gambar */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Gambar Keterangan
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

            {/* Upload PDF */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Dokumen Skema (PDF)
              </label>

              <input
                ref={dokumenInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleDokumenChange}
                className="hidden"
              />

              {dokumenName ? (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {dokumenName}
                    </p>
                    <button
                      type="button"
                      onClick={() => dokumenInputRef.current?.click()}
                      className="mt-0.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Ganti file
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => dokumenInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-6 text-slate-400 transition hover:border-blue-300 hover:bg-blue-50/30"
                >
                  <Upload size={18} />
                  <span className="text-sm">
                    Klik untuk unggah dokumen PDF (maks 5MB)
                  </span>
                </button>
              )}
              {errors.dokumen && (
                <p className="mt-1 text-xs text-red-500">{errors.dokumen}</p>
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
            {isEdit ? "Simpan Perubahan" : "Simpan Skema"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL: Konfirmasi Hapus
// ============================================================
interface DeleteConfirmModalProps {
  skema: Skema;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({
  skema,
  submitting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          Hapus skema ini?
        </h3>
        <p className="mt-1.5 text-sm text-slate-500">
          Skema{" "}
          <span className="font-medium text-slate-700">
            &quot;{skema.nama}&quot;
          </span>{" "}
          beserta dokumen dan gambarnya akan dihapus permanen. Tindakan ini
          tidak dapat dibatalkan.
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
