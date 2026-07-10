import { Phone, Mail, MapPin } from "lucide-react";
import { Instagram, Linkedin, Twitter, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="pt-15 pb-10">
            <div className="max-w-6xl mx-auto px-6">
                {/* CTA */}
                <div className="bg-yellow-400 rounded-3xl px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between mb-16 relative overflow-hidden">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-2">
                            Mari bekerja sama dengan LSP Multi Bintang Komunikasi
                        </h2>

                        <p className="text-sm text-gray-800 max-w-lg">
                            Kami hadir dengan layanan yang profesional, ramah, dan modern
                            untuk mendukung kebutuhan sertifikasi Anda.
                        </p>
                    </div>

                    <button className="mt-6 md:mt-0 bg-white px-6 py-2 rounded-lg font-semibold shadow cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition">
                        Registrasi
                    </button>
                </div>

                {/* FOOTER GRID */}
                <div className="grid md:grid-cols-4 gap-10">
                    {/* COLUMN 1 */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            LSP Multi Bintang Komunikasi
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Lembaga Sertifikasi Profesi yang bergerak di bidang Komunikasi
                            dan Kehumasan ber-INTEGRITAS, SMART, TERPERCAYA
                        </p>

                        {/* SOCIAL */}
                        <div className="flex gap-4 text-gray-700">
                            <Instagram size={18} />
                            <MessageCircle size={18} />
                            <Youtube size={18} />
                            <Linkedin size={18} />
                            <Twitter size={18} />
                        </div>
                    </div>

                    {/* COLUMN 2 */}
                    <div>
                        <h4 className="font-semibold mb-4">
                            Beranda
                        </h4>

                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li>Beranda</li>
                            <li>Program Keahlian</li>
                            <li>Galeri</li>
                            <li>Berita Kami</li>
                        </ul>
                    </div>

                    {/* COLUMN 3 */}
                    <div>
                        <h4 className="font-semibold mb-4">
                            Tentang
                        </h4>

                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li>Beranda</li>
                            <li>Program Keahlian</li>
                            <li>Galeri</li>
                            <li>Berita Kami</li>
                        </ul>
                    </div>

                    {/* COLUMN 4 */}
                    <div>
                        <h4 className="font-semibold mb-4">
                            Kontak
                        </h4>

                        <ul className="space-y-4 text-gray-600 text-sm">
                            <li className="flex items-center gap-3">
                                <Phone size={16} />
                                +62 812-3640-5427
                            </li>

                            <li className="flex items-center gap-3">
                                <Mail size={16} />
                                lspmbkom@gmail.com
                            </li>

                            <li className="flex items-start gap-3">
                                <MapPin size={16} />
                                Gadang Regency P2/ 44,
                                Malang, 65148
                            </li>
                        </ul>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="text-right text-gray-400 text-sm mt-12">
                    (c) 2026 Solveit.id
                </div>
            </div>
        </footer>
    );
}
