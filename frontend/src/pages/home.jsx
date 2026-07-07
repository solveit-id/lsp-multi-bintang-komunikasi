import Navbar from "../components/Navbar";
import Hero from "../components/HeroSection";
import About from "../components/AboutSection";
import VisionMission from "../components/VisionMission";
import CertificationProcess from "../components/CertificationProcess";
import CertificationScheme from "../components/CertificationScheme";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
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
