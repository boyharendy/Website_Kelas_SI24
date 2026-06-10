import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Settings, X, Save, ShieldAlert, Upload, Crop } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { studentsData as defaultStudentsData } from '../data/studentsData';
import getCroppedImg from '../utils/cropImage';

const Github = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const Instagram = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const avatarColors = [
  '4f6dff', 'f0c040', '34d399', 'f87171', 'a78bfa',
  'fb923c', '38bdf8', 'f472b6', '818cf8', '22d3ee',
  'facc15', '4ade80', 'c084fc', 'fb7185', '2dd4bf',
];

const getAvatarColor = (index) => avatarColors[index % avatarColors.length];
const getAvatarUrl = (name, index) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${getAvatarColor(index)}&color=fff&size=200&font-size=0.35&bold=true`;



const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);

  // Modals state
  const [tokenPromptFor, setTokenPromptFor] = useState(null);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', photo: '', quote: '', ig: '', gh: '' });
  const [activeCard, setActiveCard] = useState(null);

  // Cropper state
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Load data
  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents(defaultStudentsData);
        }
      })
      .catch(e => {
        console.error('Error fetching students:', e);
        setStudents(defaultStudentsData); // Hanya gunakan default jika server mati/error
      });
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, students]);

  // Token Prompt Handlers
  const handleGearClick = (student, e) => {
    e.stopPropagation();
    setTokenPromptFor(student);
    setTokenInput('');
    setTokenError('');
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    
    // Validasi token: NIM + angka terakhir dari NIM
    const nim = tokenPromptFor.nim;
    const lastDigit = nim.charAt(nim.length - 1);
    const expectedToken = nim + lastDigit;

    if (tokenInput === expectedToken) {
      setEditingStudent(tokenPromptFor);
      setEditForm({
        name: tokenPromptFor.name || '',
        photo: tokenPromptFor.photo || '',
        quote: tokenPromptFor.quote || '',
        ig: tokenPromptFor.ig || '',
        gh: tokenPromptFor.gh || ''
      });
      setTokenPromptFor(null);
    } else {
      setTokenError('Token salah! Silakan coba lagi.');
    }
  };

  // Photo Upload & Crop Handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setEditForm({ ...editForm, photo: croppedImageBase64 });
      setImageToCrop(null); // Close cropper UI
    } catch (e) {
      console.error(e);
      alert('Gagal memotong gambar.');
    }
  };

  const handleCancelCrop = () => {
    setImageToCrop(null);
  };

  // Edit Submit Handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${editingStudent.nim}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Gagal menyimpan ke server');

      const updatedStudents = students.map(s => {
        if (s.nim === editingStudent.nim) {
          return { ...s, ...editForm };
        }
        return s;
      });

      setStudents(updatedStudents);
      setEditingStudent(null);
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <section id="mahasiswa" className="section relative overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-badge mx-auto">
            <Users size={16} /> Direktori Anggota
          </div>
          <h2 className="section-title">56 Mahasiswa, Satu Keluarga</h2>
          <p className="section-subtitle">Kenali setiap anggota kelas kami  orang-orang hebat dan Keren.</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-12 relative"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Cari nama mahasiswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-14 pr-6 bg-bg-card border border-border-primary rounded-full text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all backdrop-blur-md"
            />
          </div>
          <p className="text-center text-sm text-text-muted mt-3">
            Menampilkan {filteredStudents.length} dari {students.length} anggota
          </p>
        </motion.div>

        {/* Grid / Flex Layout */}
        {filteredStudents.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-5">
            {filteredStudents.map((student, index) => {
              const originalIndex = students.findIndex(s => s.nim === student.nim);

              let igUrl = student.ig || '';
              if (igUrl && !igUrl.startsWith('http')) {
                igUrl = igUrl.includes('instagram.com') ? 'https://' + igUrl : 'https://instagram.com/' + igUrl;
              }

              let ghUrl = student.gh || '';
              if (ghUrl && !ghUrl.startsWith('http')) {
                ghUrl = ghUrl.includes('github.com') ? 'https://' + ghUrl : 'https://github.com/' + ghUrl;
              }

              return (
                <motion.div
                  key={student.nim}
                  onClick={() => setActiveCard(activeCard === student.nim ? null : student.nim)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
                  className="w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(20%-16px)] bg-bg-card border border-border-primary rounded-2xl p-5 text-center backdrop-blur-md transition-all hover:-translate-y-1.5 hover:border-border-accent hover:shadow-[0_4px_30px_rgba(0,0,0,0.3)] group relative overflow-hidden"
                >
                  <div className="w-32 sm:w-40 h-auto aspect-[3/4] mx-auto mb-4 rounded-xl border-2 border-border-primary overflow-hidden group-hover:border-accent transition-colors relative">
                    <img
                      src={student.photo || getAvatarUrl(student.name, originalIndex)}
                      alt={`Foto ${student.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-lg leading-tight mb-1">{student.name}</h3>
                  <p className="text-xs font-medium text-accent tracking-wider mb-4">{student.nim}</p>

                  {/* Hover Overlay for Quote and Socials */}
                  <div className={`absolute inset-0 bg-[#0d1230]/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-10 ${activeCard === student.nim ? 'opacity-100 md:opacity-0' : 'opacity-0'} md:group-hover:opacity-100`}>

                    {/* Gear Icon (Settings) */}
                    <button
                      onClick={(e) => handleGearClick(student, e)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-accent border border-white/10 hover:border-accent flex items-center justify-center text-white/70 hover:text-bg-primary transition-all z-20"
                      title="Edit Data Mahasiswa"
                    >
                      <Settings size={16} />
                    </button>

                    <p className="text-sm italic text-text-primary mb-4 break-words w-full">"{student.quote}"</p>
                    <div className="flex gap-3">
                      {igUrl && (
                        <a href={igUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-full bg-glass-strong border border-border-primary flex items-center justify-center text-text-primary hover:bg-accent hover:text-bg-primary hover:border-accent transition-all">
                          <Instagram size={18} />
                        </a>
                      )}
                      {ghUrl && (
                        <a href={ghUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-full bg-glass-strong border border-border-primary flex items-center justify-center text-text-primary hover:bg-accent hover:text-bg-primary hover:border-accent transition-all">
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-glass-strong mb-4">
              <Search className="text-text-muted" size={24} />
            </div>
            <p className="text-text-secondary">Tidak ditemukan mahasiswa dengan nama "{searchQuery}"</p>
          </div>
        )}
      </div>

      <div className="bg-glow bg-glow-blue top-[20%] -right-[200px]" />
      <div className="bg-glow bg-glow-gold bottom-[10%] -left-[150px]" />

      {/* Token Prompt Modal */}
      <AnimatePresence>
        {tokenPromptFor && (
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
                onClick={() => setTokenPromptFor(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 rounded-full bg-danger/20 border border-danger/50 text-danger flex items-center justify-center mb-4 mx-auto">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-lg font-bold text-center mb-1">Akses Terkunci</h3>
              <p className="text-sm text-text-secondary text-center mb-6">
                Masukkan token untuk mengedit data <span className="font-semibold text-accent">{tokenPromptFor.name}</span>.
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
                  Buka Kunci
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Data Modal */}
      <AnimatePresence>
        {editingStudent && (
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
              {imageToCrop ? (
                /* Cropper View */
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-bold mb-4">Sesuaikan Foto</h3>
                  <div className="relative w-full h-64 bg-black/50 rounded-lg overflow-hidden mb-4 border border-border-primary">
                    <Cropper
                      image={imageToCrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={3 / 4}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-text-secondary mb-2">Zoom</label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(e.target.value)}
                      className="w-full accent-accent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelCrop}
                      className="flex-1 bg-glass border border-border-primary hover:bg-glass-strong text-text-primary py-2.5 rounded-lg transition-all font-medium text-sm"
                    >
                      Batal Potong
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyCrop}
                      className="flex-1 bg-accent hover:bg-[#e6a800] text-bg-primary py-2.5 rounded-lg transition-all font-bold flex items-center justify-center gap-2 text-sm"
                    >
                      <Crop size={16} /> Terapkan Foto
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <>
                  <button
                    onClick={() => setEditingStudent(null)}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <h3 className="text-xl font-bold mb-1">Edit Data Mahasiswa</h3>
                  <p className="text-sm text-accent mb-6 font-medium">{editingStudent.nim}</p>

                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    {/* Edit Name */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Nama Lengkap"
                        required
                        className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                      />
                    </div>

                    {/* Edit Photo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Foto (Rasio 3:4)</label>

                      <div className="flex items-center gap-4">
                        {editForm.photo && (
                          <img
                            src={editForm.photo}
                            alt="Preview"
                            className="w-12 h-16 rounded-md object-cover border border-border-primary"
                          />
                        )}
                        <label className="flex-1 cursor-pointer">
                          <div className="w-full bg-[#0a0e28] border border-dashed border-border-primary hover:border-accent rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-text-muted hover:text-accent transition-colors text-sm">
                            <Upload size={16} />
                            <span>Pilih & Potong Gambar...</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoSelect}
                          />
                        </label>
                      </div>
                      {editForm.photo && (
                        <button
                          type="button"
                          onClick={() => setEditForm({ ...editForm, photo: '' })}
                          className="text-[11px] text-danger hover:text-red-400 mt-2 text-left"
                        >
                          Hapus Foto (Kembali ke inisial)
                        </button>
                      )}
                    </div>

                    {/* Quote */}
                    <div>
                      <label className="flex justify-between items-end text-sm font-medium text-text-secondary mb-1.5">
                        <span>Deskripsi / Quote</span>
                        <span className="text-[10px] text-text-muted">{editForm.quote?.length || 0}/100</span>
                      </label>
                      <textarea
                        value={editForm.quote}
                        onChange={(e) => setEditForm({ ...editForm, quote: e.target.value.substring(0, 100) })}
                        maxLength={100}
                        placeholder="Tulis quote atau deskripsi singkat..."
                        rows={3}
                        className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm resize-none"
                      />
                    </div>

                    {/* IG */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">URL Instagram</label>
                      <input
                        type="text"
                        value={editForm.ig}
                        onChange={(e) => setEditForm({ ...editForm, ig: e.target.value })}
                        placeholder="Contoh: https://instagram.com/jokosusilo"
                        className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                      />
                    </div>

                    {/* GH */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">URL Github</label>
                      <input
                        type="text"
                        value={editForm.gh}
                        onChange={(e) => setEditForm({ ...editForm, gh: e.target.value })}
                        placeholder="Contoh: https://github.com/jokosusilo123"
                        className="w-full bg-[#0a0e28] border border-border-primary rounded-lg py-2.5 px-4 focus:outline-none focus:border-accent transition-all text-sm"
                      />
                    </div>



                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
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
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Students;
