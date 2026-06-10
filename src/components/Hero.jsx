import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-[#06091a]">
        {/* Background color instead of broken image */}
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#06091a]/50 via-[#06091a]/70 to-[#06091a]" />

      {/* Particles (Animated with Framer Motion) */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, Math.random() + 1, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container-custom max-w-4xl pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-glow border border-border-accent rounded-full text-sm font-semibold text-accent mb-6"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            ⚡
          </motion.span>
          <span>Sistem Informasi — Institut Teknologi Del</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-5"
        >
          <span className="bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent">
            Sistem Informasi Angkatan 2024
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
        >
          56 mahasiswa, satu visi. Membangun masa depan digital dengan inovasi, kolaborasi, dan semangat tanpa batas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#mahasiswa"
            className="btn btn-primary"
          >
            Kenalan dengan Kami →
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#prestasi"
            className="btn btn-secondary"
          >
            Lihat Prestasi ✨
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-text-muted rounded-full relative flex justify-center">
          <div className="w-1 h-2 bg-accent rounded-full mt-2 animate-bounce" />
        </div>
        <span className="text-[10px] text-text-muted uppercase tracking-[0.15em]">Scroll ke bawah</span>
      </motion.div>

      {/* Glows */}
      <div className="bg-glow bg-glow-gold -top-[200px] -right-[100px]" />
      <div className="bg-glow bg-glow-blue -bottom-[200px] -left-[100px]" />
    </section>
  );
};

export default Hero;
