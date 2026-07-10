"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SkemaList() {
    const [selectedSkema, setSelectedSkema] = useState(null);
    const [registrationSkema, setRegistrationSkema] = useState(null);
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        whatsapp: ""
    });

    const skemaData = [
        { id: 1, title: "Komunikasi Organisasi", category: "Komunikasi", desc: "Pelaksanaan strategi komunikasi organisasi secara profesional.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
        { id: 2, title: "Manajemen Keuangan", category: "Keuangan", desc: "Pengelolaan keuangan organisasi secara efektif.", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43" },
        { id: 3, title: "Analisis Data", category: "Teknologi", desc: "Pengolahan dan analisis data untuk pengambilan keputusan.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71" },
        { id: 4, title: "Pemasaran Digital", category: "Pemasaran", desc: "Strategi pemasaran digital di berbagai platform online.", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312" },
        { id: 5, title: "Manajemen Proyek", category: "Manajemen", desc: "Pengelolaan proyek secara efektif dan efisien.", image: "https://images.unsplash.com/photo-1507209696998-3c532be9b2b5" },
        { id: 6, title: "Desain UI/UX", category: "Teknologi", desc: "Perancangan tampilan dan pengalaman pengguna aplikasi.", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
        { id: 7, title: "Berbicara di Depan Umum", category: "Komunikasi", desc: "Teknik berbicara di depan publik secara profesional.", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad" },
        { id: 8, title: "Operator Mesin", category: "Mesin", desc: "Pengoperasian mesin industri sesuai standar kompetensi.", image: "https://images.unsplash.com/photo-1581091012184-5c8c1c1c3c16" },
        { id: 9, title: "Analisis Bisnis", category: "Manajemen", desc: "Analisis kebutuhan bisnis dan strategi perusahaan.", image: "https://images.unsplash.com/photo-1551434678-e076c223a692" },
        { id: 10, title: "Keamanan Siber", category: "Teknologi", desc: "Keamanan sistem dan perlindungan data digital.", image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87" },
        { id: 11, title: "Pembuat Konten", category: "Pemasaran", desc: "Pembuatan konten kreatif untuk media digital.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
        { id: 12, title: "Kontrol Kualitas", category: "Mesin", desc: "Pengawasan kualitas produk industri.", image: "https://images.unsplash.com/photo-1581093588401-22c4f5c5c1c0" }
    ];

    const [search, setSearch] = useState("");

    const cardVariants = {
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -18, scale: 0.98 }
    };

    const modalVariants = {
        hidden: { opacity: 0, y: 28, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 28, scale: 0.96 }
    };

    const filtered = skemaData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const closeModal = () => setSelectedSkema(null);
    const closeRegistration = () => setRegistrationSkema(null);
    const openRegistration = (item) => {
        setRegistrationSkema(item);
        setFormData({
            nama: "",
            email: "",
            whatsapp: ""
        });
    };

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedSkema(null);
                setRegistrationSkema(null);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <section className="py-24 mt-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* TITLE */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-3">
                        Daftar Skema Sertifikasi
                    </h1>

                    <p className="text-gray-600">
                        Temukan skema sertifikasi sesuai bidang kompetensi Anda
                    </p>
                </div>

                {/* SEARCH */}
                <div className="max-w-xl mx-auto mb-12 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Cari skema sertifikasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                        w-full
                        border border-gray-300
                        rounded-xl
                        pl-12 pr-4 py-3
                        outline-none
                        transition
                        focus:ring-2 focus:ring-yellow-400
                        "
                    />
                </div>

                {/* CARD LIST */}
                <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                    layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                                }}
                                whileHover={{ y: -8, scale: 1.03 }}
                                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
                            >
                                <motion.img
                                    src={item.image}
                                    className="w-full h-[180px] object-cover"
                                    whileHover={{ scale: 1.06 }}
                                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                />

                                <div className="p-5">
                                    <h3 className="font-bold text-lg mb-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4">
                                        {item.desc}
                                    </p>

                                    <button
                                        onClick={() => setSelectedSkema(item)}
                                        className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition cursor-pointer"
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                    {selectedSkema && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 cursor-pointer"
                            onClick={closeModal}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            <motion.div
                                className="w-full max-w-[420px] rounded-[32px] bg-white p-5 md:p-7 shadow-2xl cursor-default"
                                onClick={(event) => event.stopPropagation()}
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="relative mb-6 overflow-hidden rounded-[30px]">
                                    <div className="mx-auto w-full max-w-[95%]">
                                        <img
                                            src={selectedSkema.image}
                                            alt={selectedSkema.title}
                                            className="h-48 md:h-56 rounded-[26px] w-full object-cover"
                                        />
                                    </div>

                                    <motion.button
                                        onClick={closeModal}
                                        whileHover={{ scale: 1.08, rotate: 8 }}
                                        whileTap={{ scale: 0.92, rotate: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-3 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl leading-none text-gray-700 shadow-lg transition hover:bg-gray-100 cursor-pointer"
                                        aria-label="Tutup popup"
                                    >
                                        &times;
                                    </motion.button>
                                </div>

                                <div className="mx-auto w-full max-w-[95%]">
                                    <h3 className="text-[30px] md:text-[38px] font-bold leading-tight text-gray-900">
                                        {selectedSkema.title}
                                    </h3>

                                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
                                        {selectedSkema.category}
                                    </p>

                                    <div className="mt-6 rounded-[22px] border border-gray-200 bg-gray-50 p-5 md:p-6">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-4">
                                            Deskripsi
                                        </h4>

                                        <p className="text-gray-600 leading-relaxed">
                                            {selectedSkema.desc || "Deskripsi belum tersedia."}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-center md:justify-end">
                                        <button
                                            onClick={() => {
                                                closeModal();
                                                openRegistration(selectedSkema);
                                            }}
                                            className="w-full md:w-auto rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow-[0_12px_30px_rgba(250,204,21,0.35)] transition hover:bg-yellow-500 cursor-pointer"
                                        >
                                            Daftar Sekarang
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {registrationSkema && (
                        <motion.div
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 py-8 cursor-pointer overflow-y-auto"
                            onClick={closeRegistration}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            <motion.form
                                className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-5 md:p-7 shadow-2xl cursor-default"
                                onClick={(event) => event.stopPropagation()}
                                onSubmit={(event) => event.preventDefault()}
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <motion.button
                                    type="button"
                                    onClick={closeRegistration}
                                    whileHover={{ scale: 1.08, rotate: 8 }}
                                    whileTap={{ scale: 0.92, rotate: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl leading-none text-gray-700 shadow-lg transition hover:bg-gray-100 cursor-pointer"
                                    aria-label="Tutup popup pendaftaran"
                                >
                                    &times;
                                </motion.button>

                                <div className="mb-5">
                                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
                                        Pendaftaran
                                    </p>

                                    <div className="overflow-hidden rounded-[28px]">
                                        <img
                                            src={registrationSkema.image}
                                            alt={registrationSkema.title}
                                            className="h-40 md:h-48 w-full rounded-[26px] object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="mx-auto w-full max-w-[95%]">
                                    <h3 className="text-[30px] md:text-[38px] font-bold leading-tight text-gray-900">
                                        {registrationSkema.title}
                                    </h3>

                                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
                                        {registrationSkema.category}
                                    </p>

                                    <div className="mt-6 rounded-[22px] border border-gray-200 bg-gray-50 p-5 md:p-6">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-4">
                                            Form Pendaftaran
                                        </h4>

                                        <div className="grid gap-4">
                                            <label className="grid gap-2 text-sm font-medium text-gray-700">
                                                Nama Lengkap
                                                <input
                                                    type="text"
                                                    value={formData.nama}
                                                    onChange={(event) => setFormData((prev) => ({ ...prev, nama: event.target.value }))}
                                                    placeholder="Masukkan nama lengkap"
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                                                />
                                            </label>

                                            <label className="grid gap-2 text-sm font-medium text-gray-700">
                                                Email
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                                                    placeholder="Masukkan email"
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                                                />
                                            </label>

                                            <label className="grid gap-2 text-sm font-medium text-gray-700">
                                                Nomor WhatsApp
                                                <input
                                                    type="tel"
                                                    value={formData.whatsapp}
                                                    onChange={(event) => setFormData((prev) => ({ ...prev, whatsapp: event.target.value }))}
                                                    placeholder="Masukkan nomor WhatsApp"
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col md:flex-row justify-center md:justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeRegistration}
                                        className="w-full md:w-auto rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        className="w-full md:w-auto rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow-[0_12px_30px_rgba(250,204,21,0.35)] transition hover:bg-yellow-500 cursor-pointer"
                                    >
                                        Kirim Pendaftaran
                                    </button>
                                </div>
                                </div>
                            </motion.form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
