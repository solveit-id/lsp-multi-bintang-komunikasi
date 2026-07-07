"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function Ulasan() {
    const reviews = [
        {
            id: 1,
            name: "Mike Taylor",
            job: "Lahore, Pakistan",
            text: "Pengalaman berbagi yang sangat membantu dan memberikan kesan profesional.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            name: "Chris Thomas",
            job: "CEO Red Button",
            text: "Program sertifikasinya bagus dan sangat bermanfaat untuk pekerjaan saya.",
            image: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            id: 3,
            name: "Anna Smith",
            job: "Desainer UI",
            text: "Mentor yang luar biasa dan lingkungan belajar yang sangat baik.",
            image: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
            id: 4,
            name: "Daniel Mark",
            job: "Insinyur Perangkat Lunak",
            text: "Program ini membantu saya meningkatkan keterampilan teknis saya.",
            image: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        {
            id: 5,
            name: "Sophie Lee",
            job: "Manajer Produk",
            text: "Pelatihannya sangat profesional dan materinya tersusun rapi.",
            image: "https://randomuser.me/api/portraits/women/33.jpg"
        }
    ];

    const [[index, direction], setIndex] = useState([0, 0]);

    const next = () => {
        setIndex([(index + 1) % reviews.length, 1]);
    };

    const prev = () => {
        setIndex([(index - 1 + reviews.length) % reviews.length, -1]);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(([prevIndex]) => [
                (prevIndex + 1) % reviews.length,
                1
            ]);
        }, 5000);

        return () => clearInterval(interval);
    }, [reviews.length]);

    const active = reviews[index];
    const second = reviews[(index + 1) % reviews.length];

    const variants = {
        enter: (direction) => ({
            y: direction > 0 ? 120 : -120,
            opacity: 0
        }),
        center: {
            y: 0,
            opacity: 1
        },
        exit: (direction) => ({
            y: direction > 0 ? -120 : 120,
            opacity: 0
        })
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center py-24 px-6">
            {/* LEFT */}
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1F2A44] mb-6">
                    ULASAN
                </h2>

                <p className="text-gray-500 leading-relaxed mb-8 md:mb-10 max-w-md">
                    Ulasan dan pengalaman nyata dari para peserta yang telah memperoleh manfaat melalui program pelatihan dan sertifikasi yang kami selenggarakan.
                </p>

                {/* DOT */}
                <div className="flex gap-3">
                    {reviews.map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i === index ? "bg-gray-700" : "bg-gray-300"}`} />
                    ))}
                </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start">
                {/* CARD AREA */}
                <div className="relative w-full max-w-[420px] h-[260px]">
                    {/* CARD BELAKANG */}
                    <div className="absolute top-20 md:top-35 left-6 md:left-10 w-full bg-white rounded-xl p-6 shadow-lg opacity-70">
                        <h4 className="font-semibold text-gray-700">
                            {second.name}
                        </h4>

                        <p className="text-sm text-gray-500">
                            {second.job}
                        </p>
                    </div>

                    {/* CARD UTAMA */}
                    <AnimatePresence custom={direction} mode="wait">
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.45 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            className="absolute w-full bg-white rounded-xl p-6 md:p-8 shadow-2xl"
                        >
                            {/* AVATAR */}
                            <img
                                src={active.image}
                                className="absolute -top-6 -left-4 md:-left-6 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white object-cover"
                            />

                            <p className="text-gray-600 leading-relaxed mb-5 text-[14px] md:text-[15px]">
                                "{active.text}"
                            </p>

                            <h4 className="font-semibold text-gray-800">
                                {active.name}
                            </h4>

                            <p className="text-sm text-gray-500">
                                {active.job}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* BUTTON */}
                <div className="flex md:flex-col gap-4 mt-[-25px] md:mt-15 md:ml-15">
                    <button
                        onClick={prev}
                        className="w-10 h-10 flex items-center justify-center bg-white shadow rounded-full hover:shadow-md hover:scale-105 transition cursor-pointer"
                    >
                        <ChevronUp size={18} />
                    </button>

                    <button
                        onClick={next}
                        className="w-10 h-10 flex items-center justify-center bg-white shadow rounded-full hover:shadow-md hover:scale-105 transition cursor-pointer"
                    >
                        <ChevronDown size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
