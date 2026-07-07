import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Compass,
  Sparkles,
  Target,
  X
} from "lucide-react";
import img1 from "../assets/about1.png";
import img2 from "../assets/about2.png";
import img3 from "../assets/about3.png";

export default function AboutSection() {
  const [isOpen, setIsOpen] = useState(false);

  const highlights = [
    { value: "10+", label: "Skema yang siap diakses", icon: BadgeCheck },
    { value: "100%", label: "Proses yang objektif dan jelas", icon: Target },
    { value: "BNSP", label: "Mengacu pada standar resmi", icon: Compass }
  ];

  const focusAreas = [
    "Sertifikasi kompetensi yang kredibel",
    "Peningkatan kualitas SDM komunikasi",
    "Layanan yang independen dan akuntabel"
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <section id="about" className="w-full mb-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-lg">
          <h2 className="text-4xl font-semibold text-gray-800 tracking-widest mb-6">
            Tentang Kami
          </h2>

          <p className="text-gray-500 leading-relaxed mb-8">
            Lembaga Sertifikasi Multi Bintang Komunikasi di Malang adalah LSP
            Pihak Ketiga yang memastikan kompetensi tenaga kerja komunikasi
            melalui sertifikasi kredibel. Didirikan Asosiasi Profesi
            Komunikasi, berkomitmen independen, objektif, akuntabel,
            menjunjung integritas sesuai BNSP demi tenaga kerja kompeten
            Indonesia.
          </p>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="bg-yellow-400 px-6 py-3 rounded-lg font-medium tracking-widest hover:bg-yellow-500 hover:scale-105 transition cursor-pointer"
          >
            SELENGKAPNYA
          </button>
        </div>

        <div className="relative h-[420px] mt-10">
          <img
            src={img1}
            alt="Dokumentasi sertifikasi 1"
            className="absolute top-0 right-0 w-[75%] h-[120px] object-cover rounded-xl"
          />

          <img
            src={img2}
            alt="Dokumentasi sertifikasi 2"
            className="absolute top-[140px] right-0 w-[75%] h-[220px] object-cover rounded-2xl"
          />

          <img
            src={img3}
            alt="Dokumentasi sertifikasi 3"
            className="absolute bottom-0 left-0 w-[45%] h-[200px] object-cover rounded-2xl border-4 border-white"
          />

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/6 bg-yellow-400 px-8 py-5 rounded-xl shadow-lg">
            <h3 className="text-4xl font-bold">10+</h3>
            <p className="text-lg">Sertifikasi</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="about-dialog-title"
              className="relative w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:max-h-[calc(100vh-4rem)]"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500" />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white p-2 text-gray-700 shadow-sm transition hover:bg-slate-50 hover:text-gray-900"
                aria-label="Tutup popup about"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-[1] grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-5 pb-6 pt-16 text-white sm:px-8 sm:pb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                  Profil Lembaga
                </div>

                  <h3
                    id="about-dialog-title"
                    className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                  >
                    LSP Multi Bintang Komunikasi
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                    Kami berkomitmen menghadirkan proses sertifikasi yang
                    profesional, objektif, dan relevan dengan kebutuhan dunia
                    kerja. Setiap proses dirancang untuk menjaga kepercayaan,
                    memperkuat kompetensi, dan memberi nilai nyata bagi
                    individu maupun organisasi.
                  </p>

                  <div className="mt-8 grid gap-3">
                    {highlights.map(({ value, label, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/8 p-4 text-white backdrop-blur"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/15 text-amber-200">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="text-lg font-semibold">{value}</div>
                            <div className="mt-1 text-sm leading-6 text-slate-300">{label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-5 sm:px-8 sm:py-8 lg:rounded-l-[2rem]">
                  <div className="grid gap-4">
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                      <div className="flex items-center gap-2 text-sm font-semibold text-yellow-600">
                        <Compass className="h-4 w-4" />
                        Yang kami jaga
                      </div>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                        {focusAreas.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-[10px] font-black text-yellow-700">
                              i
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Nilai inti
                      </p>
                      <p className="mt-3 text-base leading-7 text-slate-700">
                        Sertifikasi bukan sekadar tanda lulus. Di sini,
                        sertifikasi dipakai untuk melihat kemampuan secara adil,
                        menjaga standar, dan memberi pengakuan yang pantas.
                      </p>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-300 p-5 text-slate-900">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <BadgeCheck className="h-4 w-4" />
                        Kenapa ini penting
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-800">
                        Karena ketika kompetensi diukur dengan cara yang tepat,
                        orang yang memang siap akan lebih mudah dipercaya dan
                        dihargai.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
