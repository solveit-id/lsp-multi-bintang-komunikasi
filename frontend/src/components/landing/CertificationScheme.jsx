"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SkemaSertifikasi() {

    const categories = ["Semua","Teknologi","Keuangan","Matematika","Mesin"];

    const [activeCategory,setActiveCategory] = useState("Semua");
    const [index,setIndex] = useState(0);
    const [cardsToShow,setCardsToShow] = useState(3);
    const [selectedSkema, setSelectedSkema] = useState(null);
    const [registrationSkema, setRegistrationSkema] = useState(null);
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        whatsapp: ""
    });

    useEffect(()=>{

        const handleResize = ()=>{

            if(window.innerWidth < 640){
                setCardsToShow(1);
            }
            else if(window.innerWidth < 1024){
                setCardsToShow(2);
            }
            else{
                setCardsToShow(3);
            }

        };

        handleResize();
        window.addEventListener("resize",handleResize);

        return ()=> window.removeEventListener("resize",handleResize);

    },[]);


    const skemaData = [
        {
            id:1,
            title:"Komunikasi Organisasi",
            desc:"Klaster Pelaksanaan Strategi Komunikasi Organisasi.",
            category:"Teknologi",
            image:"https://images.unsplash.com/photo-1552581234-26160f608093"
        },
        {
            id:2,
            title:"Manajemen Keuangan",
            desc:"Klaster pengelolaan keuangan organisasi.",
            category:"Keuangan",
            image:"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c"
        },
        {
            id:3,
            title:"Analisis Data",
            desc:"Kompetensi analisis dan pengolahan data.",
            category:"Matematika",
            image:"https://images.unsplash.com/photo-1551288049-bebda4e38f71"
        },
        {
            id:4,
            title:"Teknik Mesin",
            desc:"Pengoperasian dan perawatan mesin industri.",
            category:"Mesin",
            image:"https://images.unsplash.com/photo-1581091870622-3a1f3c9d0c1c"
        },
        {
            id:5,
            title:"Pengembangan Software",
            desc:"Kompetensi pengembangan aplikasi modern.",
            category:"Teknologi",
            image:"https://images.unsplash.com/photo-1519389950473-47ba0277781c"
        }
    ];

    const filtered = activeCategory === "Semua" ? skemaData : skemaData.filter(item => item.category === activeCategory);


    /* Reset index ketika filter berubah */
    useEffect(()=>{
        setIndex(0);
    },[activeCategory]);

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


    /* Slider Navigation */

    const nextSlide = ()=>{

        if(filtered.length <= cardsToShow) return;

        setIndex((prev)=> (prev + 1) % filtered.length);

    };

    const prevSlide = ()=>{

        if(filtered.length <= cardsToShow) return;

        setIndex((prev)=> (prev - 1 + filtered.length) % filtered.length);

    };

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


    return (

        <section id="skema" className="py-24">

            <div className="max-w-6xl mx-auto px-6">

                {/* Title */}

                <div className="text-center mb-10">

                    <h2 className="text-2xl md:text-3xl font-bold">
                    SKEMA SERTIFIKASI KOMPETENSI
                    </h2>

                    <p className="text-gray-600 mt-2">
                    Pilih skema sertifikasi yang paling sesuai dengan keahlian dan karier Anda
                    </p>

                </div>


                {/* Filter */}

                <div className="flex justify-center gap-6 mb-14 flex-wrap hidden">

                    {categories.map((cat)=>(

                        <button key={cat} onClick={()=>setActiveCategory(cat)} className={`text-sm font-medium cursor-pointer transition relative
                        ${activeCategory === cat
                        ? "text-black"
                        : "text-gray-500 hover:text-black"}`}>

                            {cat}

                            {/* underline active */}

                            {activeCategory === cat && (

                                <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-black"/>

                            )}

                        </button>

                    ))}

                </div>


                {/* Slider */}

                <div className="flex justify-center gap-6 transition-all duration-500">

                    {filtered.length <= cardsToShow ? (

                        /* Jika data sedikit tampilkan apa adanya */

                        filtered.map((item,i)=>{

                            return(

                                <div key={item.id} className="bg-white rounded-[28px] p-6 shadow-md w-[280px] hover:scale-105 transition cursor-pointer">

                                    <div className="border rounded-[22px] overflow-hidden mb-5">

                                        <img src={item.image} className="w-full h-[200px] object-cover"/>

                                    </div>

                                    <h3 className="font-bold text-[18px] uppercase mb-3"> {item.title} </h3>

                                    <p className="text-gray-600 text-[14px] mb-6"> {item.desc}</p>

                                    <div className="flex gap-3">

                                        <button
                                        onClick={() => setSelectedSkema(item)}
                                        className="flex-1 bg-yellow-400 py-2 rounded-full text-sm font-semibold hover:scale-105 transition cursor-pointer">
                                        Lihat Detail
                                        </button>

                                        <button
                                        onClick={() => openRegistration(item)}
                                        className="flex-1 bg-yellow-400 py-2 rounded-full text-sm font-semibold hover:scale-105 transition cursor-pointer">
                                        Daftar
                                        </button>

                                    </div>

                                </div>

                            );

                        })

                    ) : (

                        /* Jika data banyak gunakan slider */

                        Array.from({ length: cardsToShow }).map((_,i)=>{

                            const item = filtered[(index + i) % filtered.length];
                            const isCenter = cardsToShow === 3 && i === 1;

                            return(

                                <div
                                key={item.id + "-" + i}
                                className={`bg-white rounded-[28px] p-6 transition-all duration-300
                                ${isCenter ? "scale-105 shadow-xl" : "shadow-md"}
                                w-[280px] hover:scale-105 cursor-pointer`}>

                                    <div className="border rounded-[22px] overflow-hidden mb-5">

                                        <img src={item.image} className="w-full h-[200px] object-cover"/>

                                    </div>

                                    <h3 className="font-bold text-[18px] uppercase mb-3"> {item.title} </h3>

                                    <p className="text-gray-600 text-[14px] mb-6"> {item.desc} </p>

                                    <div className="flex gap-3">

                                        <button
                                        onClick={() => setSelectedSkema(item)}
                                        className="flex-1 bg-yellow-400 py-2 rounded-full text-sm font-semibold hover:scale-105 transition cursor-pointer">
                                        Lihat Detail
                                        </button>

                                        <button
                                        onClick={() => openRegistration(item)}
                                        className="flex-1 bg-yellow-400 py-2 rounded-full text-sm font-semibold hover:scale-105 transition cursor-pointer">
                                        Daftar
                                        </button>

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

                <AnimatePresence>
                    {selectedSkema && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 cursor-pointer"
                            onClick={closeModal}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                className="w-full max-w-[420px] rounded-[32px] bg-white p-5 md:p-7 shadow-2xl cursor-default"
                                onClick={(event) => event.stopPropagation()}
                                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
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
                            transition={{ duration: 0.2 }}
                        >
                            <motion.form
                                className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-[32px] bg-white p-5 md:p-7 shadow-2xl cursor-default"
                                onClick={(event) => event.stopPropagation()}
                                onSubmit={(event) => event.preventDefault()}
                                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
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


                {/* Arrow */}

                <div className="flex justify-center gap-10 mt-12">

                    <button onClick={prevSlide} className="p-2 hover:scale-110 transition cursor-pointer">

                        <ChevronLeft size={30}/>

                    </button>

                    <button onClick={nextSlide} className="p-2 hover:scale-110 transition cursor-pointer">

                        <ChevronRight size={30}/>

                    </button>

                </div>


                {/* Lihat Lainnya */}

                <div className="flex justify-center mt-14">
                    <Link to="/skema">
                    <button className="px-8 py-3 rounded-full border border-black hover:bg-black hover:text-white transition cursor-pointer">

                    Lihat Selengkapnya

                    </button>
                    </Link>
                </div>

            </div>

        </section>

    );

}
