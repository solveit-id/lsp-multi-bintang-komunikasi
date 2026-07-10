"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";

export default function SertifikasiTimeline() {
    const [activeStep, setActiveStep] = useState(-1);

    const steps = [
        {
            title: "Tombol WhatsApp Aktif",
            text: "Pengguna melihat dan mengklik tombol ajakan bertindak di website."
        },
        {
            title: "Konsultasi Awal",
            text: "Tim kami menjelaskan proses sertifikasi dan kebutuhan dokumen."
        },
        {
            title: "Pengisian Formulir",
            text: "Peserta mengisi formulir pendaftaran sertifikasi."
        },
        {
            title: "Pengumpulan Dokumen",
            text: "Peserta mengirimkan dokumen persyaratan sertifikasi."
        },
        {
            title: "Proses Asesmen",
            text: "Asesor melakukan evaluasi kompetensi peserta."
        },
        {
            title: "Penilaian Kompetensi",
            text: "Hasil asesmen dinilai sesuai standar kompetensi."
        },
        {
            title: "Penerbitan Sertifikat",
            text: "Peserta yang lulus akan mendapatkan sertifikat resmi."
        }
    ];

    return (
        <section id="alur" className="py-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Title */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold mb-3">
                        ALUR SERTIFIKASI
                    </h2>

                    <p className="text-gray-600">
                        Alur sertifikasi dimulai dari registrasi, asesmen, penilaian, hingga sertifikat.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Base line */}
                    <div className="absolute left-6 md:left-1/2 top-0 h-full w-[4px] md:-translate-x-1/2 bg-gray-300"></div>

                    {/* Progress line */}
                    <motion.div
                        className="absolute left-6 md:left-1/2 top-0 w-[4px] md:-translate-x-1/2 bg-black origin-top"
                        animate={{
                            height: `${((activeStep + 1) / steps.length) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />

                    {steps.map((step, index) => {
                        const isLeft = index % 2 === 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                onViewportEnter={() => setActiveStep(index)}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: false, margin: "-100px" }}
                                className="relative mb-24"
                            >
                                {/* DOT */}
                                <div
                                    className={`absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full border-4 border-white shadow-md z-10
                                    ${index <= activeStep ? "bg-black" : "bg-gray-300"}`}
                                />

                                {/* Card */}
                                <div className={`flex pl-16 md:pl-0 ${isLeft ? "md:justify-start" : "md:justify-end"}`}>
                                    <div className="w-[380px] bg-yellow-400 p-6 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
                                        <div className="flex items-start gap-3 mb-2">
                                            <MousePointerClick size={26} />
                                            <h3 className="font-bold">{step.title}</h3>
                                        </div>

                                        <p className="text-sm leading-relaxed">
                                            {step.text}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
