'use client';

import React, { useState } from 'react';
import { Artista, Obra, ContactoPlataforma, RolUsuario } from '@/types/database';
import { uploadImageToBucket } from '@/lib/supabase/storage';
import { AuthModal } from './AuthModal';
import {
  Shield,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  Plus,
  Users,
  Crown,
  Trash2,
  Power,
  ShieldCheck,
  UserPlus,
  Edit3,
  BookOpen,
  Save,
  Palette,
  ShieldAlert,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Upload,
  LogIn,
  LogOut,
} from 'lucide-react';

interface AdminPreviewPanelProps {
  artistas: Artista[];
  obras: Obra[];
  platformContacts: ContactoPlataforma[];
  onToggleContactoDirecto: (artistaId: string) => void;
  onAddPlatformContact: (nombre: string, contacto: string, rol?: RolUsuario) => void;
  onToggleContactActive?: (contactId: string) => void;
  onChangeContactRole?: (contactId: string, rol: RolUsuario) => void;
  onDeletePlatformContact?: (contactId: string) => void;
  onAddArtista?: (data: {
    nombre: string;
    bio?: string;
    provincia_ciudad?: string;
    foto_perfil?: string;
    whatsapp_email_contacto?: string;
    contacto_directo?: boolean;
  }) => void;
  onUpdateArtista?: (artistaId: string, updates: Partial<Artista>) => void;
  onDeleteArtista?: (artistaId: string) => void;
  onAddObra?: (data: {
    titulo: string;
    artista_id: string;
    tecnica?: string;
    medidas?: string;
    año?: number;
    precio_referencia?: number;
    disponible?: boolean;
    imagenes?: string[];
    descripcion?: string;
  }) => void;
  onUpdateObra?: (obraId: string, updates: Partial<Obra>) => void;
  onDeleteObra?: (obraId: string) => void;
  onToggleObraDisponibilidad?: (obraId: string) => void;
}

export function AdminPreviewPanel({
  artistas,
  obras,
  platformContacts,
  onToggleContactoDirecto,
  onAddPlatformContact,
  onToggleContactActive,
  onChangeContactRole,
  onDeletePlatformContact,
  onAddArtista,
  onUpdateArtista,
  onDeleteArtista,
  onAddObra,
  onUpdateObra,
  onDeleteObra,
  onToggleObraDisponibilidad,
}: AdminPreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<RolUsuario>('superadmin');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Estado para gestión de equipo (Admins / Gestores)
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoContacto, setNuevoContacto] = useState('');
  const [nuevoRol, setNuevoRol] = useState<RolUsuario>('gestor');

  // Estado para agregar nuevo artista (SuperAdmin / Gestor)
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [artistNombre, setArtistNombre] = useState('');
  const [artistBio, setArtistBio] = useState('');
  const [artistProvincia, setArtistProvincia] = useState('La Habana');
  const [artistFoto, setArtistFoto] = useState('');
  const [artistContacto, setArtistContacto] = useState('');
  const [artistDirecto, setArtistDirecto] = useState(false);

  // Estado para agregar nueva obra
  const [showAddObra, setShowAddObra] = useState(false);
  const [obraTitulo, setObraTitulo] = useState('');
  const [obraArtistaId, setObraArtistaId] = useState('');
  const [obraTecnica, setObraTecnica] = useState('');
  const [obraMedidas, setObraMedidas] = useState('');
  const [obraAño, setObraAño] = useState('');
  const [obraPrecio, setObraPrecio] = useState('');
  const [obraDisponible, setObraDisponible] = useState(true);
  const [obraImagenUrl, setObraImagenUrl] = useState('');
  const [obraDescripcion, setObraDescripcion] = useState('');

  // Estado para autogestión de perfil de artista (Rol: Artista)
  const [selectedArtistIdForEdit, setSelectedArtistIdForEdit] = useState<string>(
    artistas[0]?.id || ''
  );
  const selectedArtistToEdit =
    artistas.find((a) => a.id === selectedArtistIdForEdit) || artistas[0];

  const [editBio, setEditBio] = useState('');
  const [editProvincia, setEditProvincia] = useState('');
  const [editFoto, setEditFoto] = useState('');
  const [editContacto, setEditContacto] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Cargar datos del artista al seleccionar en autogestión
  const handleSelectArtistForEdit = (id: string) => {
    setSelectedArtistIdForEdit(id);
    const art = artistas.find((a) => a.id === id);
    if (art) {
      setEditBio(art.bio || '');
      setEditProvincia(art.provincia_ciudad || '');
      setEditFoto(art.foto_perfil || '');
      setEditContacto(art.whatsapp_email_contacto || '');
    }
  };

  const handleAddGestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoNombre.trim() && nuevoContacto.trim()) {
      onAddPlatformContact(nuevoNombre, nuevoContacto, nuevoRol);
      setNuevoNombre('');
      setNuevoContacto('');
      setNuevoRol('gestor');
    }
  };

  const handleAddArtistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artistNombre.trim()) {
      onAddArtista?.({
        nombre: artistNombre,
        bio: artistBio,
        provincia_ciudad: artistProvincia,
        foto_perfil: artistFoto,
        whatsapp_email_contacto: artistContacto,
        contacto_directo: artistDirecto,
      });
      setArtistNombre('');
      setArtistBio('');
      setArtistProvincia('La Habana');
      setArtistFoto('');
      setArtistContacto('');
      setArtistDirecto(false);
      setShowAddArtist(false);
    }
  };

  const handleAddObraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetArtistaId = obraArtistaId || artistas[0]?.id;
    if (obraTitulo.trim() && targetArtistaId) {
      onAddObra?.({
        titulo: obraTitulo,
        artista_id: targetArtistaId,
        tecnica: obraTecnica || 'Óleo sobre lienzo',
        medidas: obraMedidas || '100 x 80 cm',
        año: obraAño ? parseInt(obraAño, 10) : new Date().getFullYear(),
        precio_referencia: obraPrecio ? parseFloat(obraPrecio) : undefined,
        disponible: obraDisponible,
        imagenes: obraImagenUrl ? [obraImagenUrl] : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'],
        descripcion: obraDescripcion,
      });
      setObraTitulo('');
      setObraTecnica('');
      setObraMedidas('');
      setObraAño('');
      setObraPrecio('');
      setObraDisponible(true);
      setObraImagenUrl('');
      setObraDescripcion('');
      setShowAddObra(false);
    }
  };

  const handleArtistImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImageToBucket(file, 'artistas-imagenes');
    if (uploadedUrl) {
      setArtistFoto(uploadedUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setArtistFoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleObraImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImageToBucket(file, 'obras-imagenes');
    if (uploadedUrl) {
      setObraImagenUrl(uploadedUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setObraImagenUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditArtistImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadImageToBucket(file, 'artistas-imagenes');
    if (uploadedUrl) {
      setEditFoto(uploadedUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditFoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArtistProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedArtistToEdit) {
      onUpdateArtista?.(selectedArtistToEdit.id, {
        bio: editBio,
        provincia_ciudad: editProvincia,
        foto_perfil: editFoto,
        whatsapp_email_contacto: editContacto,
      });
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  return (
    <div id="contacto-info" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#12141a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 glass-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Panel de Control & Administración de Equipo</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              Gestión de Permisos, Registro de Artistas & Control de Equipo
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              SuperAdmin y Gestores administran el catálogo y los permisos; los Artistas autogestionan su trayectoria biográfica.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {currentUserEmail ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                <span>Sesión: <strong>{currentUserEmail}</strong></span>
                <button
                  onClick={() => setCurrentUserEmail(null)}
                  className="p-1 hover:text-white transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-200 border border-white/10 hover:border-amber-500/50 hover:text-amber-300 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Iniciar Sesión</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              {isOpen ? 'Ocultar Panel Admin' : 'Abrir Panel de Administración'}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-6 space-y-8 animate-fadeIn">
            {/* Simulator Role Selector */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Simular Vista de Rol Actual:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveRole('superadmin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRole === 'superadmin'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  SuperAdmin (Ramiro)
                </button>

                <button
                  onClick={() => setActiveRole('gestor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRole === 'gestor'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Gestor / Coordinador
                </button>

                <button
                  onClick={() => {
                    setActiveRole('artista');
                    if (selectedArtistToEdit) {
                      setEditBio(selectedArtistToEdit.bio || '');
                      setEditProvincia(selectedArtistToEdit.provincia_ciudad || '');
                      setEditFoto(selectedArtistToEdit.foto_perfil || '');
                      setEditContacto(selectedArtistToEdit.whatsapp_email_contacto || '');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRole === 'artista'
                      ? 'bg-purple-500 text-white font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Portal Artista (Autogestión)
                </button>
              </div>
            </div>

            {/* SECCIÓN A: SUPERADMIN / GESTOR (Gestión de Artistas y Equipo) */}
            {activeRole !== 'artista' ? (
              <>
                {/* Control 1: Gestión y Registro de Artistas */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      (1) Catálogo de Artistas Cubanos & Permisos de Contacto:
                    </h4>

                    {activeRole === 'superadmin' && (
                      <button
                        onClick={() => setShowAddArtist(!showAddArtist)}
                        className="px-3 py-1.5 rounded-lg gold-button text-xs font-semibold flex items-center gap-1.5 shadow-md"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        {showAddArtist ? 'Cancelar Registro' : '+ Agregar Nuevo Artista'}
                      </button>
                    )}
                  </div>

                  {/* Formulario Agregar Nuevo Artista */}
                  {showAddArtist && activeRole === 'superadmin' && (
                    <form
                      onSubmit={handleAddArtistSubmit}
                      className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-4 animate-fadeIn"
                    >
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Registrar Nuevo Artista en la Plataforma
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Nombre Completo *</label>
                          <input
                            type="text"
                            placeholder="Ej: Manuel Mendive"
                            value={artistNombre}
                            onChange={(e) => setArtistNombre(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Provincia / Ciudad</label>
                          <input
                            type="text"
                            placeholder="Ej: La Habana / Matanzas"
                            value={artistProvincia}
                            onChange={(e) => setArtistProvincia(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Foto de Perfil (URL o Archivo)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="https://..."
                              value={artistFoto}
                              onChange={(e) => setArtistFoto(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                            <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs cursor-pointer flex items-center gap-1 shrink-0">
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>Subir</span>
                              <input type="file" accept="image/*" onChange={handleArtistImageFileUpload} className="hidden" />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">WhatsApp / Email de Contacto</label>
                          <input
                            type="text"
                            placeholder="+53 50000000"
                            value={artistContacto}
                            onChange={(e) => setArtistContacto(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Biografía & Trayectoria Profesional</label>
                        <textarea
                          rows={3}
                          placeholder="Escribe la biografía, estudios, exposiciones y técnica distintiva..."
                          value={artistBio}
                          onChange={(e) => setArtistBio(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={artistDirecto}
                            onChange={(e) => setArtistDirecto(e.target.checked)}
                            className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                          />
                          <span>Habilitar Contacto Directo por defecto</span>
                        </label>

                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg gold-button text-xs font-semibold flex items-center gap-1.5 shadow-md"
                        >
                          <Plus className="w-4 h-4" /> Dar de Alta Artista
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Lista de Artistas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artistas.map((art) => (
                      <div
                        key={art.id}
                        className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-amber-500/20">
                            {art.foto_perfil ? (
                              <img src={art.foto_perfil} alt={art.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <Palette className="w-5 h-5 text-slate-400 m-2" />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-white block">{art.nombre}</span>
                            <span className="text-[11px] text-slate-400">
                              {art.provincia_ciudad || 'Cuba'} • {art.contacto_directo ? 'Contacto Directo' : 'Gestión Asistida'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleContactoDirecto(art.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            {art.contacto_directo ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <ToggleRight className="w-5 h-5" /> Directo
                              </span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1">
                                <ToggleLeft className="w-5 h-5" /> Asistido
                              </span>
                            )}
                          </button>

                          {activeRole === 'superadmin' && (
                            <button
                              onClick={() => onDeleteArtista?.(art.id)}
                              title="Eliminar artista"
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Control 2: Gestión de Obras en el Catálogo */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      (2) Obras de Arte Registradas ({obras.length}):
                    </h4>

                    <button
                      onClick={() => setShowAddObra(!showAddObra)}
                      className="px-3 py-1.5 rounded-lg gold-button text-xs font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {showAddObra ? 'Cancelar Registro' : '+ Publicar Nueva Obra'}
                    </button>
                  </div>

                  {/* Formulario Agregar Nueva Obra */}
                  {showAddObra && (
                    <form
                      onSubmit={handleAddObraSubmit}
                      className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-4 animate-fadeIn"
                    >
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Registrar Nueva Pieza en el Catálogo
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Título de la Obra *</label>
                          <input
                            type="text"
                            placeholder="Ej: Trópico en Penumbra"
                            value={obraTitulo}
                            onChange={(e) => setObraTitulo(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Artista Autor *</label>
                          <select
                            value={obraArtistaId}
                            onChange={(e) => setObraArtistaId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                            required
                          >
                            <option value="">-- Seleccionar Artista --</option>
                            {artistas.map((art) => (
                              <option key={art.id} value={art.id}>
                                {art.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Técnica</label>
                          <input
                            type="text"
                            placeholder="Ej: Óleo sobre lienzo"
                            value={obraTecnica}
                            onChange={(e) => setObraTecnica(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Dimensiones / Medidas</label>
                          <input
                            type="text"
                            placeholder="Ej: 120 x 90 cm"
                            value={obraMedidas}
                            onChange={(e) => setObraMedidas(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Año de Creación</label>
                          <input
                            type="number"
                            placeholder="2024"
                            value={obraAño}
                            onChange={(e) => setObraAño(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Precio Referencia (USD)</label>
                          <input
                            type="number"
                            placeholder="Ej: 1500"
                            value={obraPrecio}
                            onChange={(e) => setObraPrecio(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Imagen Principal (URL o Subir Archivo)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://..."
                            value={obraImagenUrl}
                            onChange={(e) => setObraImagenUrl(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <label className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs cursor-pointer flex items-center gap-1 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Subir Archivo</span>
                            <input type="file" accept="image/*" onChange={handleObraImageFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Descripción / Ficha Curatorial</label>
                        <textarea
                          rows={2}
                          placeholder="Reseña conceptual o contexto de la obra..."
                          value={obraDescripcion}
                          onChange={(e) => setObraDescripcion(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={obraDisponible}
                            onChange={(e) => setObraDisponible(e.target.checked)}
                            className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                          />
                          <span>Marcar como disponible para adquisición</span>
                        </label>

                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg gold-button text-xs font-semibold flex items-center gap-1.5 shadow-md"
                        >
                          <Plus className="w-4 h-4" /> Agregar Obra al Catálogo
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Lista de Obras */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {obras.map((obra) => (
                      <div
                        key={obra.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-white/10 relative">
                            <img
                              src={obra.imagenes[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'}
                              alt={obra.titulo}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-medium text-white truncate">{obra.titulo}</h5>
                            <span className="text-[11px] text-amber-400/90 block truncate">
                              {obra.artista?.nombre || 'Artista'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {obra.tecnica || 'Arte Cubano'} {obra.precio_referencia ? `• $${obra.precio_referencia} USD` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onToggleObraDisponibilidad?.(obra.id)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                              obra.disponible
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {obra.disponible ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-400" /> Disponible
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-400" /> Reservada
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onDeleteObra?.(obra.id)}
                            title="Eliminar obra"
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Control 3: Platform Contacts / Admin Team */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      (3) Equipo de Gestión & Atención Oficial de la Plataforma:
                    </h4>
                    <span className="text-xs text-slate-400">
                      {platformContacts.length} miembro(s) registrados
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {platformContacts.map((c) => {
                      const isSuperAdmin = c.rol === 'superadmin' || c.nombre_encargado.toLowerCase().includes('ramiro');
                      const currentRol = c.rol || (isSuperAdmin ? 'superadmin' : 'gestor');

                      return (
                        <div
                          key={c.id}
                          className={`p-4 rounded-xl border transition-all ${
                            c.activo
                              ? 'bg-slate-900/80 border-white/10'
                              : 'bg-slate-950/40 border-dashed border-slate-800 opacity-60'
                          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-white font-medium">
                                {c.nombre_encargado}
                              </strong>
                              {isSuperAdmin ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" /> SuperAdmin
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Gestor / Coordinador
                                </span>
                              )}

                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  c.activo
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {c.activo ? '● Activo' : '○ Inactivo'}
                              </span>
                            </div>

                            <span className="text-xs text-slate-400 block">{c.whatsapp_email}</span>
                          </div>

                          {activeRole === 'superadmin' && (
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => onToggleContactActive?.(c.id)}
                                className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                                  c.activo
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                              >
                                <Power className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">{c.activo ? 'Desactivar' : 'Activar'}</span>
                              </button>

                              <select
                                value={currentRol}
                                onChange={(e) => onChangeContactRole?.(c.id, e.target.value as RolUsuario)}
                                className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                              >
                                <option value="gestor">Rol: Gestor</option>
                                <option value="superadmin">Rol: SuperAdmin</option>
                              </select>

                              <button
                                onClick={() => onDeletePlatformContact?.(c.id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {activeRole === 'superadmin' && (
                    <form
                      onSubmit={handleAddGestorSubmit}
                      className="bg-slate-950/80 p-4 rounded-xl border border-white/10 space-y-3"
                    >
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Agregar Nuevo Administrador o Gestor de Equipo
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre completo del gestor..."
                          value={nuevoNombre}
                          onChange={(e) => setNuevoNombre(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />

                        <input
                          type="text"
                          placeholder="WhatsApp o Email de contacto..."
                          value={nuevoContacto}
                          onChange={(e) => setNuevoContacto(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          required
                        />

                        <select
                          value={nuevoRol}
                          onChange={(e) => setNuevoRol(e.target.value as RolUsuario)}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="gestor">Rol: Gestor / Coordinador</option>
                          <option value="superadmin">Rol: SuperAdmin</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg gold-button text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-4 h-4" /> Registrar en el Equipo de la Plataforma
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              /* SECCIÓN B: PORTAL DE AUTOGESTIÓN PARA ARTISTAS (Rol: Artista) */
              <div className="space-y-6 animate-fadeIn">
                {/* Banner de Restricción de Privilegios */}
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-purple-300 block mb-0.5 font-semibold">
                      Portal de Autogestión de Perfil de Artista
                    </strong>
                    <span>
                      Como Artista, puedes actualizar tu biografía, trayectoria profesional y datos personales de contacto.
                      Las funciones de asignación de gestores, permisos de contacto directo y administración global son reservadas únicamente para SuperAdmin (Ramiro) y coordinadores.
                    </span>
                  </div>
                </div>

                {/* Seleccionar artista a editar */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Seleccionar Perfil de Artista a Autogestionar:
                    </label>

                    <select
                      value={selectedArtistIdForEdit}
                      onChange={(e) => handleSelectArtistForEdit(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {artistas.map((art) => (
                        <option key={art.id} value={art.id}>
                          {art.nombre} ({art.provincia_ciudad || 'Cuba'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Formulario de Edición de Perfil de Artista */}
                  {selectedArtistToEdit && (
                    <form onSubmit={handleSaveArtistProfile} className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border-2 border-amber-500/30 shrink-0">
                          <img
                            src={editFoto || selectedArtistToEdit.foto_perfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'}
                            alt={selectedArtistToEdit.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="text-base font-serif font-bold text-white">
                            {selectedArtistToEdit.nombre}
                          </h4>
                          <span className="text-xs text-amber-400">
                            {selectedArtistToEdit.contacto_directo
                              ? '✓ Modalidad: Contacto Directo Habilitado'
                              : '⚡ Modalidad: Atención Coordinada por Plataforma'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Provincia / Ciudad de Residencia</label>
                          <input
                            type="text"
                            value={editProvincia}
                            onChange={(e) => setEditProvincia(e.target.value)}
                            placeholder="Ej: La Habana, Cienfuegos"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-400 block mb-1">WhatsApp / Email de Contacto</label>
                          <input
                            type="text"
                            value={editContacto}
                            onChange={(e) => setEditContacto(e.target.value)}
                            placeholder="+53 50000000 o email@artista.art"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Foto de Perfil (URL de la Imagen)</label>
                        <input
                          type="text"
                          value={editFoto}
                          onChange={(e) => setEditFoto(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Biografía, Trayectoria Profesional & Reseña Artística
                        </label>
                        <textarea
                          rows={5}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Describe tu formación, trayectoria, principales exposiciones, técnica distintiva y filosofía artística..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {isSavedNotice ? (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            ✓ Biografía y trayectoria guardadas correctamente
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Los cambios se reflejarán inmediatamente en la sección de Creadores.
                          </span>
                        )}

                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-lg gold-button text-xs font-semibold flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
                        >
                          <Save className="w-4 h-4" /> Guardar Mi Perfil
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(email) => setCurrentUserEmail(email)}
      />
    </div>
  );
}


