import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/HeroSection";
import About from "../components/landing/AboutSection";
import VisionMission from "../components/landing/VisionMission";
import CertificationProcess from "../components/landing/CertificationProcess";
import CertificationScheme from "../components/landing/CertificationScheme";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state?.scrollTo;

    if (!target) return;

    const raf = window.requestAnimationFrame(() => {
      const element = document.getElementById(target);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }

      navigate(".", { replace: true, state: null });
    });

    return () => window.cancelAnimationFrame(raf);
  }, [location.state, navigate]);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <VisionMission />
      <CertificationProcess />
      <CertificationScheme />
      <Testimonials />
      <Footer />
    </>
  );
}
