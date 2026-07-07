"use client";

import { useState } from "react";
import heroImg from "../assets/hero.png";
import hero2 from "../assets/hero.png";
import hero3 from "../assets/hero.png";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Dropdown from "../components/DropdownMenu.jsx";

export default function Hero() {
    const images = [heroImg, hero2, hero3];
    const [index, setIndex] = useState(0);

    const next = () => {
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section className="w-full pt-28 pb-24 sm:pt-32 sm:pb-28">
            <div className="max-w-7xl mx-auto px-6">
                {/* Container */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* LEFT IMAGE */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full">
                            <img
                                src={images[index]}
                                alt="ruang kerja"
                                className="rounded-2xl w-full h-[260px] sm:h-[420px] object-cover transition duration-500"
                            />

                            {/* slider button */}
                            <div className="absolute bottom-3 left-4 flex gap-2 sm:-bottom-5 sm:left-10">
                                <button onClick={prev} className="bg-gray-200 p-3 rounded-lg shadow hover:scale-105 transition cursor-pointer">
                                    <ChevronLeft size={20} />
                                </button>

                                <button onClick={next} className="bg-yellow-400 p-3 rounded-lg shadow hover:scale-105 transition cursor-pointer">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* indicator */}
                        <div className="flex justify-center mt-3 text-sm text-gray-600 gap-3 items-center">
                            <span>{String(index + 1).padStart(2, "0")}</span>

                            <div className="w-16 h-1 bg-gray-300 rounded overflow-hidden">
                                <div
                                    className="h-1 bg-yellow-400 rounded transition-all duration-500"
                                    style={{ width: `${((index + 1) / images.length) * 100}%` }}
                                />
                            </div>

                            <span>{String(images.length).padStart(2, "0")}</span>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="space-y-6 lg:-ml-35 relative z-10 backdrop-blur-[4px] bg-gradient-to-br from-white/60 to-white/20 border border-white/40 p-8 rounded-2xl">
                        {/* title */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-gray-800">
                                <div className="flex items-center gap-3">
                                    <span>Lembaga Sertifikasi</span>
                                    <div className="hidden sm:block w-12 h-1 bg-yellow-400 rounded"></div>
                                </div>

                                Profesi Multi Bintang <br />
                                Komunikasi
                            </h1>
                        </div>

                        {/* search card */}
                        <div className="backdrop-blur-md bg-white/60 border border-white/40 rounded-xl shadow-[0_6px_20px_rgba(201,162,39,0.25)] p-4 grid sm:grid-cols-4 gap-3">
                            {/* Pilih Skema */}
                            <Dropdown
                                placeholder="Pilih Skema"
                                options={["Skema 1", "Skema 2", "Skema 3"]}
                            />

                            {/* Provinsi */}
                            <Dropdown
                                placeholder="Provinsi Anda"
                                options={["DKI Jakarta", "Jawa Barat", "Jawa Timur"]}
                            />

                            {/* Jadwal */}
                            <div className="flex items-center border border-gray-200 px-3 rounded-xl bg-white/70 hover:bg-white cursor-pointer">
                                <input
                                    type="date"
                                    className="bg-transparent outline-none w-full cursor-pointer"
                                />
                            </div>

                            {/* Search Button */}
                            <button className="bg-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition shadow-md cursor-pointer hover:scale-105">
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* FEATURES */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 justify-items-center text-center lg:col-start-2 lg:-mt-35 lg:ml-25 lg:justify-items-start lg:text-left">
                        {["Penyiapan kantor virtual", "Ruang kerja terbuka", "Ruang acara", "Area santai"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>

                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
