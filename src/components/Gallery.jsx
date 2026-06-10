import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Settings, ShieldAlert, Plus, Edit2, Trash2, Save, Upload } from 'lucide-react';
import { galleryData as defaultGalleryData } from '../data/galleryData';

const ADMIN_TOKEN = "sikatnyaw123";

const defaultFilters = [
  { id: 'semua', label: 'Semua', icon: '' },
  { id: 'akademik', label: '📚 Akademik' },
  { id: 'nongkrong', label: '☕ Nongkrong' },
  { id: 'proyek', label: '💻 Proyek' },
];

const Gallery = () => {
  // Data State
  const [gallery, setGallery] = useState([]);
  const [activeFilter, setActiveFilter] = useState('semua');
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTokenPrompt, setShowTokenPrompt] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ src: '', caption: '', category: 'akademik' });

  // Load Data
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGallery(data);
        } else {
          setGallery(defaultGalleryData);
        }
      })
      .catch(e => {
        console.error('Error fetching gallery:', e);
        setGallery(defaultGalleryData); // Hanya gunakan default jika server mati/error
      });
  }, []);

  const dynamicFilters = useMemo(() => {
    const customCategories = new Set(gallery.map(item => item.category));
    const result = [...defaultFilters];
    customCategories.forEach(cat => {
      if (!result.find(f => f.id === cat)) {
        // Capitalize first letter for label
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        result.push({ id: cat, label: label });
      }
    });
    return result;
  }, [gallery]);

  const filteredGallery = useMemo(() => {
    if (activeFilter === 'semua') return gallery;
    return gallery.filter(item => item.category === activeFilter);
  }, [activeFilter, gallery]);

  // Lightbox Handlers
  const openLightbox = (index) => {
    if (isAdmin) return; // Disable lightbox in admin mode when clicking card so they can edit
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredGallery.length - 1;
    if (newIndex >= filteredGallery.length) newIndex = 0;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex, filteredGallery]);

  // Token Handlers
  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (tokenInput === ADMIN_TOKEN) {
      setIsAdmin(true);
      setShowTokenPrompt(false);
      setTokenInput('');
    } else {
      setTokenError('Token salah! Silakan coba lagi.');
    }
  };

  // Admin Actions
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Yakin ingin menghapus foto ini dari galeri?')) {
      try {
        const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus');
        setGallery(gallery.filter(a => a.id !== id));
      } catch (e) {
        console.error(e);
        alert('Gagal menghapus dari server.');
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsAdding(true);
    setEditForm({ src: '', caption: '', category: 'akademik' });
  };

  const openEditModal = (item, e) => {
    e.stopPropagation();
    setIsAdding(false);
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, src: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.src) {
      alert("Harap unggah atau masukkan gambar!");
      return;
    }
    
    try {
      if (isAdding) {
        const newItem = { ...editForm, id: `g_${Date.now()}` };
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (!res.ok) throw new Error('Gagal menambah');
        setGallery([newItem, ...gallery]);
        setIsAdding(false);
      } else {
        const res = await fetch(`/api/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
        });
        if (!res.ok) throw new Error('Gagal mengedit');
        const updated = gallery.map(a => a.id === editingItem.id ? { ...a, ...editForm } : a);
        setGallery(updated);
        setEditingItem(null);
      }
    } catch (e) {
      console.error(e);
      alert(e.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleDeleteCategory = async (catId, e) => {
    e.stopPropagation();
    if (window.confirm(`Yakin ingin menghapus kategori "${catId}"? Semua foto di dalamnya akan dipindahkan ke kategori "akademik".`)) {
      try {
        const photosToUpdate = gallery.filter(item => item.category === catId);
        const newGallery = [...gallery];
        
        for (const photo of photosToUpdate) {
          const updatedPhoto = { ...photo, category: 'akademik' };
          await fetch(`/api/gallery/${photo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPhoto)
          });
          const index = newGallery.findIndex(p => p.id === photo.id);
          if (index !== -1) newGallery[index] = updatedPhoto;
        }
        
        setGallery(newGallery);
        if (activeFilter === catId) setActiveFilter('semua');
        if (editForm.category === catId) setEditForm({...editForm, category: ''});
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus kategori.');
      }
    }
  };

  return (
    <section id="galeri" className="section relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Admin Toggle Button */}
        <div className="absolute top-0 right-0 z-20">
          {!isAdmin ? (
            <button 
              onClick={() => {
                setShowTokenPrompt(true);
                setTokenError('');
              }}
              className="p-2 text-text-muted hover:text-accent bg-bg-card/50 hover:bg-bg-card rounded-full transition-colors border border-transparent hover:border-border-accent"
              title="Masuk Mode Admin"
            >
              <Settings size={20} />
            </button>
          ) : (
            <button 
              onClick={() => setIsAdmin(false)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-danger rounded-full transition-colors hover:bg-red-600 flex items-center gap-1 shadow-lg"
              title="Keluar Mode Admin"
            >
              <X size={14} /> Keluar Admin
            </button>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="section-badge">
              <Camera size={16} /> Galeri Memori
            </div>
            <h2 className="section-title">Momen yang Tak Terlupakan</h2>
            <p className="section-subtitle ml-0">Dari kelas hingga luar kampus — setiap memori berharga bagi kami.</p>
          </div>
        </motion.div>

        {/* Filters & Add Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10"
        >
          <div className="flex flex-wrap gap-3">
            {dynamicFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.id 
                    ? 'bg-accent text-bg-primary shadow-[0_4px_15px_rgba(240,192,64,0.3)]' 
                    : 'bg-bg-card border border-border-primary text-text-secondary hover:bg-glass-strong hover:text-text-primary'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isAdmin && (
            <button 
              onClick={openAddModal}
              className="px-5 py-2 rounded-full bg-accent text-bg-primary font-bold flex items-center gap-2 transition-all hover:bg-[#e6a800] hover:scale-105 shadow-[0_4px_15px_rgba(240,192,64,0.3)]"
            >
              <Plus size={18} /> Tambah Foto
            </button>
          )}
        </motion.div>

        {/* Masonry Grid */}
        {filteredGallery.length > 0 ? (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence>
              {filteredGallery.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className={`break-inside-avoid relative group rounded-2xl overflow-hidden bg-bg-card border border-border-primary ${!isAdmin ? 'cursor-pointer' : ''}`}
                >
                  <img 
                    src={item.src} 
                    alt={item.caption} 
                    loading="lazy"
                    className={`w-full h-auto transition-transform duration-700 ${!isAdmin ? 'group-hover:scale-110' : ''}`}
                  />
                  
                  {/* Overlay for Caption */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#06091a]/90 via-[#06091a]/40 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-5 ${!isAdmin ? 'group-hover:opacity-100' : 'opacity-100'}`}>
                    <span className="text-xs font-medium text-accent uppercase tracking-wider mb-1 block">
                      {item.category}
                    </span>
                    <p className="text-text-primary font-medium leading-tight drop-shadow-md">
                      {item.caption}
                    </p>
                  </div>

                  {/* Admin Actions Overlay */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => openEditModal(item, e)}
                        className="w-9 h-9 rounded-full bg-blue-500/80 backdrop-blur-sm text-white hover:bg-blue-600 flex items-center justify-center transition-colors shadow-lg"
                        title="Edit Foto"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(item.id, e)}
                        className="w-9 h-9 rounded-full bg-danger/80 backdrop-blur-sm text-white hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg"
                        title="Hapus Foto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-bg-card border border-border-primary rounded-2xl">
            <Camera className="mx-auto text-text-muted mb-4" size={48} />
            <p className="text-text-secondary">Belum ada foto dalam kategori ini.</p>
          </div>
        )}
      </div>

      <div className="bg-glow bg-glow-blue top-[30%] -left-[250px]" />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && !isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#06091a]/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full max-w-5xl h-full p-4 md:p-10 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              
              <button 
                onClick={closeLightbox}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-accent hover:text-bg-primary flex items-center justify-center transition-colors text-white z-50"
              >
                <X size={24} />
              </button>

              <button 
                onClick={() => navigateLightbox(-1)}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-accent hover:text-bg-primary flex items-center justify-center transition-colors text-white z-50"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.img 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={filteredGallery[currentIndex].src} 
                alt={filteredGallery[currentIndex].caption}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
              
              <motion.p 
                key={`caption-${currentIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-text-primary text-center mt-6 text-lg font-medium max-w-2xl"
              >
                {filteredGallery[currentIndex].caption}
              </motion.p>

              <button 
                onClick={() => navigateLightbox(1)}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-accent hover:text-bg-primary flex items-center justify-center transition-colors text-white z-50"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token Prompt Modal */}
      <AnimatePresence>
        {showTokenPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#06091a]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-card border border-border-primary rounded-2xl w-full max-w-sm p-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowTokenPrompt(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/50 text-accent flex items-center justify-center mb-4 mx-auto">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-lg font-bold text-center mb-1">Mode Admin Galeri</h3>
              <p className="text-sm text-text-secondary text-center mb-6">
                Masukkan token untuk mengakses fitur tambah, edit, dan hapus foto galeri.
              </p>
              
              <form onSubmit={handleTokenSubmit}>
                <div className="mb-4">
                  <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value);
                      setTokenError('');
                    }}
                    placeholder="Token Rahasia..."
                    autoFocus
                    className={`w-full bg-[#0a0e28] border ${tokenError ? 'border-danger' : 'border-border-primary'} rounded-lg py-3 px-4 text-center tracking-widest focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                  />
                  {tokenError && <p className="text-danger text-xs text-center mt-2">{tokenError}</p>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-accent hover:bg-[#e6a800] text-bg-primary font-bold py-3 rounded-lg transition-all"
                >
                  Buka Kunci Admin
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAdding || editingItem) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#06091a]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-card border border-border-primary rounded-2xl w-full max-w-md p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => { setIsAdding(false); setEditingItem(null); }}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-6">
                {isAdding ? 'Tambah Foto Galeri' : 'Edit Foto Galeri'}
              </h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Foto Galeri</label>
                  <div className="flex flex-col gap-4">
                    {editForm.src && (
                      <div className="w-full h-40 bg-black/50 rounded-lg overflow-hidden border border-border-primary flex items-center justify-center">
                        <img 
                          src={editForm.src} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <div className="w-full bg-[#0a0e28] border border-dashed border-border-primary hover:border-accent rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-text-muted hover:text-accent transition-colors text-sm">
                        <Upload size={16} />
                        <span>Pilih File Gambar Baru...</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoUpload} 
                      />
                    </label>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Caption/Deskripsi</label>
                  <input
                    type="text"
                    value={editForm.caption}
                    onChange={(e) => setEditForm({...editForm, caption: e.target.value})}
                    placeholder="Tulis deskripsi momen ini..."
                    required
                    className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Kategori</label>
                  
                  {/* Pilihan Kategori yang sudah ada */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dynamicFilters.filter(f => f.id !== 'semua').map(f => {
                      const isDefault = defaultFilters.some(df => df.id === f.id);
                      return (
                        <div key={f.id} className="relative inline-flex items-center">
                          <button
                            type="button"
                            onClick={() => setEditForm({...editForm, category: f.id})}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              editForm.category === f.id
                                ? 'bg-accent text-bg-primary shadow-md'
                                : 'bg-glass border border-border-primary text-text-secondary hover:border-accent hover:text-accent'
                            } ${!isDefault ? 'pr-8' : ''}`}
                          >
                            {f.label}
                          </button>
                          
                          {/* Tombol Hapus Kategori (hanya untuk custom) */}
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCategory(f.id, e)}
                              className={`absolute right-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                editForm.category === f.id
                                  ? 'text-bg-primary hover:bg-black/20'
                                  : 'text-text-muted hover:text-danger hover:bg-danger/20'
                              }`}
                              title="Hapus Kategori (Pindahkan isinya ke Akademik)"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Input untuk kategori baru atau edit kategori */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value.toLowerCase()})}
                      placeholder="Atau ketik nama kategori baru..."
                      required
                      className="flex-1 bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setEditForm({...editForm, category: ''})}
                      className="px-4 py-2.5 bg-danger/20 text-danger hover:bg-danger hover:text-white rounded-lg transition-colors flex items-center justify-center"
                      title="Hapus / Kosongkan Kategori"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">
                    Pilih kategori di atas atau ketik baru. Kategori otomatis terhapus dari website jika tidak ada foto yang menggunakannya.
                  </p>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingItem(null); }}
                    className="flex-1 bg-glass border border-border-primary hover:bg-glass-strong text-text-primary py-2.5 rounded-lg transition-all font-medium"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-accent hover:bg-[#e6a800] text-bg-primary py-2.5 rounded-lg transition-all font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(240,192,64,0.3)]"
                  >
                    <Save size={18} /> Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
