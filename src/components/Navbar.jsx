import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { id: 'hero', label: 'Beranda' },
    { id: 'prestasi', label: 'Prestasi' },
    { id: 'mahasiswa', label: 'Mahasiswa' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'bukutamu', label: 'Buku Tamu' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPos = window.scrollY + 150;

      sections.forEach(section => {
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${isScrolled ? 'py-2 bg-[#06091a]/85 backdrop-blur-xl border-b border-white/5 shadow-lg' : ''}`}>
      <div className="container-custom flex items-center justify-between">
        <a href="#hero" className="font-heading text-xl font-extrabold text-text-primary flex items-center gap-2">
          🎓 <span className="text-accent">SIKATNYAW</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 relative ${activeSection === link.id ? 'text-text-primary bg-white/10' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-screen w-64 bg-[#0a0e28]/95 backdrop-blur-2xl border-l border-white/5 p-8 pt-20 transition-transform duration-300 transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button
            className="absolute top-6 right-6 text-text-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg py-2 ${activeSection === link.id ? 'text-accent font-bold' : 'text-text-secondary'}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
