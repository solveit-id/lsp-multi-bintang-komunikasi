import { useState } from "react";

export default function VisionMission() {

    const [activeTab,setActiveTab] = useState("visi");

    return (

        <section id="visi" className="w-full py-24 sm:py-28">
            
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10 items-center">

                {/* LEFT TITLE */}
                <div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                    VISI & MISI
                    </h2>

                    <p className="text-gray-600 leading-relaxed">
                    Landasan dan arah gerak kami dalam memberikan yang terbaik
                    </p>

                </div>


                {/* CENTER BUTTON */}
                <div className="flex flex-col gap-6 items-center">

                    {/* VISI */}
                    <button onMouseEnter={()=>setActiveTab("visi")} className={`px-10 py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${activeTab==="visi"
                    ? "bg-yellow-400 shadow-[0_12px_30px_rgba(0,0,0,0.25)] scale-105"
                    : "bg-white border border-gray-300 hover:bg-yellow-100"}`}>

                    VISI

                    </button>

                    {/* MISI */}
                    <button onMouseEnter={()=>setActiveTab("misi")} className={`px-10 py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${activeTab==="misi"
                    ? "bg-yellow-400 shadow-[0_12px_30px_rgba(0,0,0,0.25)] scale-105"
                    : "bg-white border border-gray-300 hover:bg-yellow-100"}`}>

                    MISI

                    </button>

                </div>


                {/* RIGHT TEXT */}
                <div className="relative perspective-[1000px] min-h-[180px]">

                    <div key={activeTab} className="absolute inset-0 animate-flip">

                        {activeTab === "visi" && (

                            <p className="text-gray-700 leading-relaxed text-lg">

                                Menjadi Lembaga Sertifikasi Profesi yang ber-INTEGRITAS,
                                SMART, TERPERCAYA melalui layanan sertifikasi berkualitas
                                untuk menghasilkan SDM unggul, profesional, kompeten dan
                                bernalar kritis yang dapat bersaing dalam era digital.

                            </p>

                        )}


                        {activeTab === "misi" && (

                            <ul className="list-disc pl-5 space-y-3 text-gray-700 text-lg">

                                <li>Menyelenggarakan sertifikasi kompetensi yang kredibel.</li>
                                <li>Meningkatkan kualitas SDM profesional.</li>
                                <li>Mendorong budaya kerja kompeten dan berintegritas.</li>
                                <li>Mendukung daya saing tenaga kerja di era digital.</li>

                            </ul>

                        )}

                    </div>

                </div>

            </div>

        </section>

    );

}
