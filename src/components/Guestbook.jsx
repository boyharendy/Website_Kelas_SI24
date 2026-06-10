import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Settings, X, ShieldAlert, Trash2 } from 'lucide-react';

const ADMIN_TOKEN = "sikatnyaw123";

const Guestbook = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTokenPrompt, setShowTokenPrompt] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Initial load from API
  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setMessages(sorted);
        } else {
          setMessages([]);
        }
      })
      .catch(e => {
        console.error('Error fetching guestbook:', e);
      });
  }, []);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (tokenInput === ADMIN_TOKEN) {
      setIsAdmin(true);
      setShowTokenPrompt(false);
      setTokenInput('');
      setTokenError('');
    } else {
      setTokenError('Token tidak valid!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      const res = await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus pesan');
      setMessages(messages.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat menghapus pesan.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Pesan tidak boleh kosong!');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const newMessage = {
        id: `gb_${Date.now()}`,
        name: name.trim() || 'Anonim',
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      
      if (!res.ok) throw new Error('Gagal mengirim');
      
      setMessages([newMessage, ...messages]);
      setName('');
      setMessage('');
    } catch (e) {
      console.error(e);
      setError('Gagal mengirim pesan ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section id="bukutamu" className="section relative overflow-hidden bg-bg-secondary">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="section-badge mb-0">
              <MessageSquare size={16} /> Buku Tamu
            </div>
            {!isAdmin ? (
              <button 
                onClick={() => setShowTokenPrompt(true)}
                className="p-2 text-text-muted hover:text-accent bg-glass-strong hover:bg-white/10 rounded-full transition-all"
                title="Masuk Mode Admin"
              >
                <Settings size={16} />
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
          <h2 className="section-title">Tinggalkan Pesan untuk Kami</h2>
          <p className="section-subtitle">Kesan, pesan, atau ucapan — kami menghargai setiap kata dari kalian.</p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2 bg-bg-card border border-border-primary rounded-2xl p-6 md:p-8 backdrop-blur-md self-start sticky top-24 shadow-elevated"
          >
            <h3 className="font-heading text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">✍️</span> Tulis Pesan
            </h3>
            <p className="text-sm text-text-secondary mb-6">Boleh anonim, boleh pakai nama — yang penting dari hati.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5" htmlFor="name">Nama (Opsional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama..."
                    maxLength={50}
                    className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5" htmlFor="message">Pesan <span className="text-danger">*</span></label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                  placeholder="Tulis pesan, kesan, atau ucapanmu di sini..."
                  maxLength={500}
                  rows={4}
                  className={`w-full bg-[#0a0e28] border rounded-lg p-4 text-text-primary focus:outline-none focus:ring-1 transition-all resize-none ${
                    error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border-primary focus:border-accent focus:ring-accent'
                  }`}
                />
                {error && <p className="text-danger text-xs mt-1.5 flex items-center gap-1">⚠️ {error}</p>}
                <p className="text-right text-xs text-text-muted mt-1">{message.length}/500</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                  isSubmitting 
                    ? 'bg-glass-strong text-text-muted cursor-not-allowed' 
                    : 'bg-accent hover:bg-[#e6a800] text-bg-primary shadow-[0_4px_15px_rgba(240,192,64,0.3)] hover:shadow-[0_8px_25px_rgba(240,192,64,0.4)] hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? 'Mengirim...' : (
                  <>Kirim Pesan <Send size={18} /></>
                )}
              </button>
            </form>
          </motion.div>

          {/* Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                📨 Pesan Terbaru
              </h3>
              <span className="px-3 py-1 bg-glass-strong rounded-full text-xs font-medium text-text-secondary border border-border-primary">
                {messages.length} Pesan
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar" style={{ scrollbarWidth: 'thin' }}>
              {messages.length === 0 ? (
                <div className="text-center py-12 bg-bg-card border border-border-primary rounded-2xl">
                  <p className="text-text-secondary">Belum ada pesan. Jadilah yang pertama!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-[#0a0e28] border border-border-primary rounded-2xl p-5 hover:border-border-accent transition-colors relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-bg-primary font-bold text-lg">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-primary leading-none mb-1">{msg.name}</h4>
                          <span className="text-[11px] text-text-muted">{formatDate(msg.timestamp)}</span>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Hapus Pesan"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-glow bg-glow-gold top-[20%] -right-[200px]" />

      {/* Admin Token Modal */}
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
              className="bg-bg-secondary border border-border-primary p-6 md:p-8 rounded-2xl max-w-sm w-full shadow-elevated relative"
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
              
              <h3 className="text-xl font-bold text-center mb-2">Mode Admin Buku Tamu</h3>
              <p className="text-sm text-text-secondary text-center mb-6">
                Masukkan token untuk menghapus komentar.
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
                    className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-3 px-4 text-center tracking-widest focus:outline-none focus:border-accent transition-all"
                    autoFocus
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
    </section>
  );
};

export default Guestbook;
