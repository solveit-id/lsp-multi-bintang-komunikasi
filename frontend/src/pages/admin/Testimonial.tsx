import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Star,
  AlertTriangle,
  Loader2,
  MessageSquareQuote,
  Eye,
  EyeOff,
  UserCircle2,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

// ============================================================
// TYPES
// ============================================================
interface Testimonial {
  id: number;
  nama: string;
  peran: string;
  foto: string;
  pesan: string;
  rating: number;
  tampil: boolean;
  createdAt: string;
}

type VisibilityFilter = "Semua" | "Tampil" | "Disembunyikan";
type RatingFilter = "Semua" | "1" | "2" | "3" | "4" | "5";

export default function TestimonialPage() {
  const [testimonialList, setTestimonialList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("Semua");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("Semua");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletingTestimonial, setDeletingTestimonial] =
    useState<Testimonial | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTestimonial();
  }, []);

  const fetchTestimonial = async (): Promise<void> => {
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // const response = await axios.get("http://localhost:8000/api/testimonial");
      // setTestimonialList(response.data.data);

      const dummyData: Testimonial[] = [
        {
          id: 1,
          nama: "Budi Santoso",
          peran: "Alumni Sertifikasi Digital Marketing",
          foto: "https://i.pravatar.cc/150?img=12",
          pesan:
            "Prosesnya sangat profesional dan asesor sangat membantu. Materinya relevan dengan kebutuhan industri saat ini.",
          rating: 5,
          tampil: true,
          createdAt: "10 Juli 2026",
        },
        {
          id: 2,
          nama: "Siti Rahma",
          peran: "Alumni Skema Web Developer",
          foto: "https://i.pravatar.cc/150?img=32",
          pesan:
            "Pelayanan cepat dan sistemnya mudah dipahami. Terima kasih LSP MBK atas sertifikasi yang diberikan.",
          rating: 5,
          tampil: true,
          createdAt: "08 Juli 2026",
        },
        {
          id: 3,
          nama: "Andi Wijaya",
          peran: "Peserta Uji Kompetensi",
          foto: "https://i.pravatar.cc/150?img=51",
          pesan:
            "Cukup baik, hanya saja jadwal ujian sempat mundur dari perkiraan awal.",
          rating: 3,
          tampil: false,
          createdAt: "05 Juli 2026",
        },
        {
          id: 4,
          nama: "Dewi Lestari",
          peran: "Alumni Multimedia Content Creator",
          foto: "https://i.pravatar.cc/150?img=45",
          pesan:
            "Sangat merekomendasikan LSP ini untuk siapa saja yang ingin sertifikasi kompetensi multimedia.",
          rating: 4,
          tampil: true,
          createdAt: "02 Juli 2026",
        },
        {
          id: 5,
          nama: "Rangga Pratama",
          peran: "Peserta Uji Kompetensi",
          foto: "https://i.pravatar.cc/150?img=60",
          pesan:
            "Kurang puas dengan respons admin yang lambat saat saya bertanya soal jadwal.",
          rating: 2,
          tampil: false,
          createdAt: "28 Juni 2026",
        },
      ];

      setTimeout(() => {
        setTestimonialList(dummyData);
        setLoading(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const filteredTestimonial = testimonialList.filter((t: Testimonial) => {
    const matchSearch =
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.pesan.toLowerCase().includes(search.toLowerCase());

    const matchVisibility =
      visibilityFilter === "Semua" ||
      (visibilityFilter === "Tampil" && t.tampil) ||
      (visibilityFilter === "Disembunyikan" && !t.tampil);

    const matchRating =
      ratingFilter === "Semua" || t.rating === Number(ratingFilter);

    return matchSearch && matchVisibility && matchRating;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTestimonial.length / ITEMS_PER_PAGE),
  );
  const paginatedTestimonial = filteredTestimonial.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, visibilityFilter, ratingFilter]);

  const handleToggleTampil = async (
    testimonial: Testimonial,
  ): Promise<void> => {
    setTogglingId(testimonial.id);
    const nextValue = !testimonial.tampil;

    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // await axios.patch(`http://localhost:8000/api/testimonial/${testimonial.id}`, {
      //   tampil: nextValue,
      // });

      await new Promise((resolve) => setTimeout(resolve, 400));

      setTestimonialList((prev) =>
        prev.map((t) =>
          t.id === testimonial.id ? { ...t, tampil: nextValue } : t,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setTogglingId(null);
    }
  };

  const openDeleteModal = (testimonial: Testimonial): void => {
    setDeletingTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingTestimonial) return;

    setSubmitting(true);
    try {
      // ===========================================
      // NANTI GANTI DENGAN API LARAVEL
      // ===========================================
      // await axios.delete(`http://localhost:8000/api/testimonial/${deletingTestimonial.id}`);

      await new Promise((resolve) => setTimeout(resolve, 600));

      setTestimonialList((prev) =>
        prev.filter((t) => t.id !== deletingTestimonial.id),
      );
      setShowDeleteModal(false);
      setDeletingTestimonial(null);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const tampilCount = testimonialList.filter((t) => t.tampil).length;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-8 2xl:p-12">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-7 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Testimonial
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Kelola testimoni dari alumni dan peserta uji kompetensi.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          <Eye size={16} />
          {tampilCount} testimoni tampil di halaman depan
        </div>
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari nama atau isi testimoni..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
            {(["Semua", "Tampil", "Disembunyikan"] as VisibilityFilter[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setVisibilityFilter(status)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    visibilityFilter === status
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>

          <select
            value={ratingFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRatingFilter(e.target.value as RatingFilter)
            }
            className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Rating</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm text-slate-400">Memuat testimoni...</span>
        </div>
      ) : paginatedTestimonial.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-slate-400">
          <MessageSquareQuote size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-medium text-slate-500">
            Tidak ada testimoni
          </p>
          <p className="mt-1 text-xs">
            Coba ubah kata kunci pencarian atau filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {paginatedTestimonial.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`rounded-2xl border bg-white p-5 transition-all duration-300 ${
                testimonial.tampil
                  ? "border-slate-200"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {testimonial.foto ? (
                    <img
                      src={testimonial.foto}
                      alt={testimonial.nama}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <UserCircle2 size={22} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {testimonial.nama}
                    </p>
                    <p className="text-xs text-slate-500">
                      {testimonial.peran}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                    testimonial.tampil
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-100 text-slate-500 ring-slate-200"
                  }`}
                >
                  {testimonial.tampil ? (
                    <Eye size={11} />
                  ) : (
                    <EyeOff size={11} />
                  )}
                  {testimonial.tampil ? "Tampil" : "Tersembunyi"}
                </span>
              </div>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    className={
                      star <= testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-200"
                    }
                  />
                ))}
              </div>

              {/* Pesan */}
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                &ldquo;{testimonial.pesan}&rdquo;
              </p>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                  {testimonial.createdAt}
                </span>

                <div className="flex items-center gap-3">
                  {/* Toggle Tampilkan */}
                  <label className="flex cursor-pointer items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {togglingId === testimonial.id
                        ? "Menyimpan..."
                        : "Tampilkan"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={testimonial.tampil}
                      disabled={togglingId === testimonial.id}
                      onClick={() => handleToggleTampil(testimonial)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                        testimonial.tampil ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          testimonial.tampil ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </label>

                  <button
                    onClick={() => openDeleteModal(testimonial)}
                    title="Hapus"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredTestimonial.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-medium text-slate-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            {"–"}
            <span className="font-medium text-slate-700">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredTestimonial.length,
              )}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-700">
              {filteredTestimonial.length}
            </span>{" "}
            testimoni
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && deletingTestimonial && (
        <DeleteConfirmModal
          testimonial={deletingTestimonial}
          submitting={submitting}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingTestimonial(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL: Konfirmasi Hapus
// ============================================================
interface DeleteConfirmModalProps {
  testimonial: Testimonial;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({
  testimonial,
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
          Hapus testimoni ini?
        </h3>
        <p className="mt-1.5 text-sm text-slate-500">
          Testimoni dari{" "}
          <span className="font-medium text-slate-700">{testimonial.nama}</span>{" "}
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
