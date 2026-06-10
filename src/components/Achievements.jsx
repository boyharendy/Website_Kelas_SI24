import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementsData as defaultAchievementsData } from '../data/achievementsData';
import { ChevronLeft, ChevronRight, Trophy, Settings, X, ShieldAlert, Plus, Edit2, Trash2, Save } from 'lucide-react';

const ADMIN_TOKEN = "sikatnyaw123";

const Achievements = () => {
  const scrollRef = useRef(null);
  
  // Data State
  const [achievements, setAchievements] = useState([]);
  
  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTokenPrompt, setShowTokenPrompt] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Edit/Add Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ trophy: '🏆', title: '', level: '', members: '', desc: '' });

  // Load Data
  useEffect(() => {
    fetch('/api/achievements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAchievements(data);
        } else {
          setAchievements(defaultAchievementsData);
        }
      })
      .catch(e => {
        console.error('Error fetching achievements:', e);
        setAchievements(defaultAchievementsData); // Hanya gunakan default jika server mati/error
      });
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus prestasi ini?')) {
      try {
        const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus');
        setAchievements(achievements.filter(a => a.id !== id));
      } catch (e) {
        console.error(e);
        alert('Gagal menghapus dari server.');
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsAdding(true);
    setEditForm({ trophy: '🏆', title: '', level: 'Nasional', members: '', desc: '' });
  };

  const openEditModal = (item) => {
    setIsAdding(false);
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdding) {
        const newItem = { ...editForm, id: `p_${Date.now()}` };
        const res = await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (!res.ok) throw new Error('Gagal menambah');
        setAchievements([newItem, ...achievements]);
        setIsAdding(false);
      } else {
        const res = await fetch(`/api/achievements/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
        });
        if (!res.ok) throw new Error('Gagal mengedit');
        const updated = achievements.map(a => a.id === editingItem.id ? { ...a, ...editForm } : a);
        setAchievements(updated);
        setEditingItem(null);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan data ke server.');
    }
  };

  return (
    <section id="prestasi" className="section bg-bg-secondary overflow-hidden relative">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />

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
              <Trophy size={16} /> Papan Prestasi
            </div>
            <h2 className="section-title">Bangga dengan Pencapaian Kami</h2>
            <p className="section-subtitle ml-0">Dari ruang kelas hingga panggung nasional, kami terus berkarya dan berprestasi.</p>
          </div>
          
          <div className="flex gap-3 items-center">
            {isAdmin && (
              <button 
                onClick={openAddModal}
                className="h-12 px-5 rounded-full bg-accent text-bg-primary font-bold flex items-center gap-2 transition-all hover:bg-[#e6a800] hover:scale-105 shadow-[0_4px_15px_rgba(240,192,64,0.3)] mr-2"
              >
                <Plus size={20} /> Tambah
              </button>
            )}
            
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-bg-card border border-border-primary text-text-primary flex items-center justify-center transition-all hover:bg-accent hover:text-bg-primary hover:border-accent hover:scale-105 backdrop-blur-md"
              aria-label="Sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-bg-card border border-border-primary text-text-primary flex items-center justify-center transition-all hover:bg-accent hover:text-bg-primary hover:border-accent hover:scale-105 backdrop-blur-md"
              aria-label="Selanjutnya"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {achievements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-none w-[320px] md:w-[360px] snap-start bg-bg-card border border-border-primary rounded-2xl p-7 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-border-accent hover:shadow-[0_4px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-light opacity-0 transition-opacity group-hover:opacity-100" />
              
              {/* Admin Actions Overlay */}
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-danger/20 text-danger hover:bg-danger hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-glow border border-border-accent rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.trophy}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg leading-tight mb-1.5 pr-12">{item.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-accent-glow border border-border-accent text-accent rounded-full">
                      {item.level}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-glass-strong text-text-secondary rounded-full">
                      {item.members}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary line-clamp-3">
                {item.desc}
              </p>
            </motion.div>
          ))}
          {achievements.length === 0 && (
            <div className="w-full text-center py-10 text-text-muted">
              Belum ada data prestasi.
            </div>
          )}
        </div>
      </div>

      <div className="bg-glow bg-glow-gold top-1/2 -left-[200px]" />

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
              <h3 className="text-lg font-bold text-center mb-1">Mode Admin Prestasi</h3>
              <p className="text-sm text-text-secondary text-center mb-6">
                Masukkan token untuk mengakses fitur tambah, edit, dan hapus prestasi.
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
                {isAdding ? 'Tambah Prestasi Baru' : 'Edit Prestasi'}
              </h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/4">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Ikon/Emoji</label>
                    <input
                      type="text"
                      value={editForm.trophy}
                      onChange={(e) => setEditForm({...editForm, trophy: e.target.value})}
                      placeholder="🏆"
                      required
                      maxLength={2}
                      className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 text-center text-xl focus:outline-none focus:border-accent transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Judul Prestasi</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      placeholder="Contoh: Juara 1 Web Design"
                      required
                      className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Tingkat</label>
                    <input
                      type="text"
                      value={editForm.level}
                      onChange={(e) => setEditForm({...editForm, level: e.target.value})}
                      placeholder="Nasional, Kampus..."
                      required
                      className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Peraih</label>
                    <input
                      type="text"
                      value={editForm.members}
                      onChange={(e) => setEditForm({...editForm, members: e.target.value})}
                      placeholder="Nama/Tim..."
                      required
                      className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Deskripsi Singkat</label>
                  <textarea
                    value={editForm.desc}
                    onChange={(e) => setEditForm({...editForm, desc: e.target.value})}
                    placeholder="Ceritakan detail prestasi ini..."
                    rows={3}
                    required
                    className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm resize-none"
                  />
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

export default Achievements;
