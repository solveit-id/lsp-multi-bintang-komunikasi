import { useState,useEffect,type FormEvent } from "react";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
 
function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("lspmbk-fonts")) return;
    const link = document.createElement("link");
    link.id = "lspmbk-fonts";
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
}
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 5.14A10.6 10.6 0 0 1 12 5c7 0 10.5 7 10.5 7a13.2 13.2 0 0 1-3.15 3.92M6.6 6.6C3.5 8.5 1.5 12 1.5 12s3.5 7 10.5 7a10.2 10.2 0 0 0 4.02-.82"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
 
/** Certification-badge mark, echoing the star emblem in the site header. */
function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 2 24.5 12 35.5 13.2 27.3 20.6 29.6 31.5 20 25.8 10.4 31.5 12.7 20.6 4.5 13.2 15.5 12Z"
        fill="#F4C233"
        stroke="#1E2A45"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="19" r="5.5" fill="#1E2A45" />
      <path d="M17.6 19.2l1.6 1.6 3.2-3.4" stroke="#F4C233" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
 
function CheckItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F4C233]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1E2A45" strokeWidth="3">
          <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-sm text-[#334155]">{label}</span>
    </div>
  );
}
export default function Login() {
  useGoogleFonts();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
 
    if (!email || !password) {
      setError("Masukkan email dan kata sandi untuk melanjutkan.");
      return;
    }
 
    setSubmitting(true);
    try {
      // Ganti dengan pemanggilan API autentikasi Anda.
      await new Promise((resolve) => setTimeout(resolve, 900));
    } catch {
      setError("Gagal masuk. Periksa kembali email dan kata sandi Anda.");
    } finally {
      setSubmitting(false);
    }
    if (password !== confirmPassword) {
  alert("Konfirmasi kata sandi tidak cocok.");
  return;
}
    
  };
  
 
  return (
    <div
      className="min-h-screen w-full bg-[#FAFAF9]"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
 
      <div className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-6xl flex-col lg:flex-row lg:items-center">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden px-12 py-14 lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F4C233]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#F4C233]/10 blur-3xl"
          />
 
          <div className="relative z-10 max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDF3D6] px-3 py-1 text-xs font-semibold text-[#8A6A0F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4C233]" />
              Portal Peserta Sertifikasi
            </span>
 
            <h1
              className="mt-5 text-[32px] leading-[1.2] text-[#1E2A45] xl:text-[36px]"
              style={{ fontFamily: "Poppins, ui-sans-serif, sans-serif", fontWeight: 600 }}
            >
              Daftar {" "}
              <span className="relative whitespace-nowrap">
                LSP MBK
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 120 6"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M1 4C30 1 90 1 119 4" stroke="#F4C233" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
 
            <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
              Kelola jadwal uji kompetensi, pantau status skema, dan akses
              sertifikat Anda dalam satu tempat.
            </p>
 
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
              <CheckItem label="Skema terverifikasi BNSP" />
              <CheckItem label="Asesor berpengalaman" />
              <CheckItem label="Jadwal fleksibel" />
              <CheckItem label="Sertifikat resmi" />
            </div>
          </div>
        </div>
 
        {/* Form panel */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:py-14">
          <div className="w-full max-w-2lg rounded-2xl border border-[#F1EFE9] bg-white p-7 shadow-[0_1px_2px_rgba(30,42,69,0.04),0_12px_32px_-16px_rgba(30,42,69,0.12)] sm:p-9">
            <h2
              className="text-2xl text-[#1E2A45]"
              style={{ fontFamily: "Poppins, ui-sans-serif, sans-serif", fontWeight: 600 }}
            >
              Selamat datang di LSP MBK
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              Daftarkan diri anda untuk menjadi peserta sertifikasi.
            </p>
 
            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="nama_pengguna" className="block text-sm font-medium text-[#1E2A45]">
                    Nama Pengguna
                    </label>
                    <input
                    id="nama_pengguna"
                    placeholder="Nama Lengkap"
                    className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1E2A45] placeholder:text-[#94A3B8] outline-none transition focus:border-[#F4C233] focus:ring-2 focus:ring-[#F4C233]/40"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1E2A45]">
                    Email
                    </label>
                    <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1E2A45] placeholder:text-[#94A3B8] outline-none transition focus:border-[#F4C233] focus:ring-2 focus:ring-[#F4C233]/40"
                    />
                </div>
            </div>
 
                {/* Password */}
                <div>
                    <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#1E2A45]"
                    >
                    Kata Sandi
                    </label>

                        <div className="relative mt-1.5">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 pr-11 text-sm text-[#1E2A45] placeholder:text-[#94A3B8] outline-none transition focus:border-[#F4C233] focus:ring-2 focus:ring-[#F4C233]/40"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#94A3B8] hover:text-[#1E2A45]"
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                        </div>
                    </div>
                
              {/* Confirm Password */}
                <div>
                    <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#1E2A45]"
                    >
                    Konfirmasi Kata Sandi
                    </label>

                    <div className="relative mt-1.5">
                    <input
                        id="confirmPassword"
                        type={confirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 pr-11 text-sm text-[#1E2A45] placeholder:text-[#94A3B8] outline-none transition focus:border-[#F4C233] focus:ring-2 focus:ring-[#F4C233]/40"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#94A3B8] hover:text-[#1E2A45]"
                    >
                        <EyeIcon open={showConfirmPassword} />
                    </button>
                    </div>
                </div>
 
              <label className="flex cursor-pointer select-none items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#E2E8F0] text-[#F4C233] focus:ring-2 focus:ring-[#F4C233]/40 focus:ring-offset-0"
                />
                <span className="text-sm text-[#334155]">Ingat saya</span>
              </label>
 
              {error && (
                <p role="alert" className="text-sm text-[#C0392B]">
                  {error}
                </p>
              )}
 
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#F4C233] py-3 text-sm font-semibold text-[#1E2A45] transition hover:bg-[#E6B01F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2A45] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Memproses…" : "Masuk"}
              </button>
            </form>
 
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#F1EFE9]" />
              <span className="text-xs text-[#94A3B8]">atau lanjutkan dengan</span>
              <div className="h-px flex-1 bg-[#F1EFE9]" />
            </div>
 
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#1E2A45] bg-white py-2.5 text-sm font-semibold text-[#1E2A45] transition hover:bg-[#FAFAF9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4C233]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.2 14.6 2.3 12 2.3 6.9 2.3 2.7 6.6 2.7 12S6.9 21.7 12 21.7c6.9 0 9.6-4.9 9.6-7.4 0-.5 0-.9-.1-1.3H12z" />
              </svg>
              Google
            </button>
 
            <p className="mt-7 text-center text-sm text-[#64748B]">
              Belum punya akun?{" "}
              <a href="/login" className="font-semibold text-[#1E2A45] underline-offset-2 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}