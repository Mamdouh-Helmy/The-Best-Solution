"use client";

import { useRef } from "react";
import Header from "@/components/header/Header";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Testimonials from "@/components/testimonials/Testimonials";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
import SiteSky from "@/components/layout/SiteSky";

export default function Home() {
  const contactBoundaryRef = useRef(null);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col">
      <Header />
      <Hero />
      <div className="relative">
        <SiteSky
          threadsBoundaryRef={contactBoundaryRef}
          moonAnchorRef={contactBoundaryRef}
        />
        <About />
        <Projects />
        <Testimonials />
        <div ref={contactBoundaryRef} aria-hidden="true" />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
