import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (location.pathname === "/skema") {
            setActiveSection("skema");
            return;
        }

        if (location.pathname !== "/") {
            setActiveSection("home");
            return;
        }

        const sectionIds = ["about", "visi", "alur", "skema"];
        const observers = [];

        const handleHomeState = () => {
            const isNearTop = window.scrollY < 200;
            if (isNearTop) {
                setActiveSection("home");
            }
        };

        handleHomeState();
        window.addEventListener("scroll", handleHomeState);

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);

            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                {
                    root: null,
                    rootMargin: "-35% 0px -55% 0px",
                    threshold: 0
                }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            window.removeEventListener("scroll", handleHomeState);
            observers.forEach((observer) => observer.disconnect());
        };
    }, [location.pathname]);

    const scrollToSection = (id) => {
        if (location.pathname !== "/") {
            navigate("/", {
                state: { scrollTo: id }
            });
            setOpen(false);
            return;
        }

        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth"
            });
        }

        setOpen(false);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setOpen(false);
    };

    const isActive = (key) => activeSection === key;

    const navClass = (key) =>
        `nav-link cursor-pointer ${isActive(key) ? "nav-link-active text-black font-semibold" : ""}`;

    const mobileClass = (key) =>
        `mobile-link text-left ${isActive(key) ? "mobile-link-active text-yellow-500 font-semibold" : ""}`;

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled
        ? "bg-white/70 backdrop-blur-md shadow-md"
        : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* LOGO */}
                <div className="flex items-center gap-5 cursor-pointer">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
                    </Link>

                    <h1 className="font-semibold text-xl">LSP MBK</h1>
                </div>

                {/* MENU DESKTOP */}
                <div className="hidden md:flex items-center gap-10">
                    <Link to="/" onClick={scrollToTop} className={navClass("home")}>
                        Beranda
                    </Link>

                    <button onClick={() => scrollToSection("about")} className={navClass("about")}>
                        Tentang Kami
                    </button>

                    <button onClick={() => scrollToSection("visi")} className={navClass("visi")}>
                        Visi & Misi
                    </button>

                    <button onClick={() => scrollToSection("alur")} className={navClass("alur")}>
                        Alur
                    </button>

                    <button onClick={() => scrollToSection("skema")} className={navClass("skema")}>
                        Skema
                    </button>
                </div>

                {/* BUTTON KANAN */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="bg-yellow-400 px-5 py-2 rounded-lg font-medium hover:bg-yellow-500 transition cursor-pointer">
                        Masuk
                    </button>

                    <button className="border px-5 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                        Daftar
                    </button>
                </div>

                {/* HAMBURGER */}
                <button
                    onClick={() => setOpen(!open)}
                    className="hamburger-button inline-flex md:hidden cursor-pointer"
                    aria-label={open ? "Tutup menu" : "Buka menu"}
                    aria-expanded={open}
                >
                    <span className={`hamburger-line ${open ? "hamburger-line-top-open" : ""}`} />
                    <span className={`hamburger-line ${open ? "hamburger-line-middle-open" : ""}`} />
                    <span className={`hamburger-line ${open ? "hamburger-line-bottom-open" : ""}`} />
                </button>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="flex flex-col gap-3 px-6 pb-4 md:hidden bg-white">
                    <Link to="/" onClick={scrollToTop} className={navClass("home")}>
                        Beranda
                    </Link>

                    <button onClick={() => scrollToSection("about")} className={mobileClass("about")}>
                        Tentang Kami
                    </button>

                    <button onClick={() => scrollToSection("visi")} className={mobileClass("visi")}>
                        Visi & Misi
                    </button>

                    <button onClick={() => scrollToSection("alur")} className={mobileClass("alur")}>
                        Alur
                    </button>

                    <button onClick={() => scrollToSection("skema")} className={mobileClass("skema")}>
                        Skema
                    </button>

                    <button className="bg-yellow-400 py-2 rounded-lg font-medium">
                        Masuk
                    </button>

                    <button className="border py-2 rounded-lg">
                        Daftar
                    </button>

                </div>
            )}
        </nav>
    );
}
