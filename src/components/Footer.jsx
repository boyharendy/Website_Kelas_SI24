import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#040614] border-t border-border-primary py-10 relative z-20">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-text-secondary">
          © {new Date().getFullYear()} <span className="text-accent font-semibold">SI Angkatan 2023</span> · Sistem Informasi, Universitas Nusantara
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {['Beranda', 'Prestasi', 'Mahasiswa', 'Galeri', 'Buku Tamu'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(' ', '')}`}
              className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
