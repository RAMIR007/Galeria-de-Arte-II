'use client';

import React, { useState } from 'react';
import { Artista, Obra, DocumentoPDF } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { ConsignmentContractModal } from './ConsignmentContractModal';
import {
  X,
  Palette,
  User,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Save,
  FileText,
  Video,
  Image as ImageIcon,
  DollarSign,
  ShieldCheck,
  Download,
  ExternalLink,
} from 'lucide-react';

interface ArtistDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  artista: Artista;
  obras: Obra[];
  onUpdateArtista: (artistaId: string, updates: Partial<Artista>) => void;
  onToggleContactoDirecto: (artistaId: string) => void;
  onAddObra: (data: {
    titulo: string;
    artista_id: string;
    tecnica?: string;
    medidas?: string;
    año?: number;
    precio_referencia?: number;
    disponible?: boolean;
    imagenes?: string[];
    descripcion?: string;
    es_exclusiva?: boolean;
    comision_porcentaje?: number;
  }) => void;
  onUpdateObra?: (obraId: string, updates: Partial<Obra>) => void;
  onDeleteObra: (obraId: string) => void;
  onToggleObraDisponibilidad: (obraId: string) => void;
}

export function ArtistDashboardModal({
  isOpen,
  onClose,
  artista,
  obras,
  onUpdateArtista,
  onToggleContactoDirecto,
  onAddObra,
  onUpdateObra,
  onDeleteObra,
  onToggleObraDisponibilidad,
}: ArtistDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'obras' | 'perfil'>('obras');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  // Formulario de edición de perfil
  const [bio, setBio] = useState(artista.bio || '');
  const [notasTaller, setNotasTaller] = useState(artista.notas_taller || '');
  const [provincia, setProvincia] = useState(artista.provincia_ciudad || 'La Habana');
  const [contacto, setContacto] = useState(artista.whatsapp_email_contacto || '');
  const [fotoPerfil, setFotoPerfil] = useState(artista.foto_perfil || '');
  const [videoPresentacion, setVideoPresentacion] = useState(artista.video_presentacion || '');
  const [fotosGaleria, setFotosGaleria] = useState<string[]>(artista.fotos_galeria || []);
  const [documentosPdf, setDocumentosPdf] = useState<DocumentoPDF[]>(artista.documentos_pdf || []);

  // Nuevos campos para agregar PDF
  const [nuevoPdfTitulo, setNuevoPdfTitulo] = useState('');
  const [nuevoPdfUrl, setNuevoPdfUrl] = useState('');

  const [perfilSaved, setPerfilSaved] = useState(false);

  // Formulario de nueva obra
  const [titulo, setTitulo] = useState('');
  const [tecnica, setTecnica] = useState('Óleo sobre lienzo');
  const [medidas, setMedidas] = useState('100 x 80 cm');
  const [año, setAño] = useState(new Date().getFullYear().toString());
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenesObra, setImagenesObra] = useState<string[]>([]);
  const [disponible, setDisponible] = useState(true);
  const [aceptaConsignacion, setAceptaConsignacion] = useState(true);

  if (!isOpen) return null;

  // Obras específicas del artista
  const misObras = obras.filter((o) => o.artista_id === artista.id);

  // Calculadora personalizada según el porcentaje acordado del artista (Modificable solo por SuperAdmin)
  const galleryFeePct = artista.comision_porcentaje ?? 20;
  const artistPayoutPct = 100 - galleryFeePct;

  const numericPrice = precio ? parseFloat(precio) : 0;
  const galleryFee = Math.round(numericPrice * (galleryFeePct / 100));
  const artistPayout = Math.round(numericPrice * (artistPayoutPct / 100));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateArtista(artista.id, {
      bio,
      notas_taller: notasTaller,
      provincia_ciudad: provincia,
      whatsapp_email_contacto: contacto,
      foto_perfil: fotoPerfil,
      video_presentacion: videoPresentacion,
      fotos_galeria: fotosGaleria,
      documentos_pdf: documentosPdf,
    });
    setPerfilSaved(true);
    setTimeout(() => setPerfilSaved(false), 2500);
  };

  const handleAddPdfDocument = () => {
    if (!nuevoPdfTitulo || !nuevoPdfUrl) return;
    setDocumentosPdf((prev) => [...prev, { titulo: nuevoPdfTitulo, url: nuevoPdfUrl }]);
    setNuevoPdfTitulo('');
    setNuevoPdfUrl('');
  };

  const handleRemovePdfDocument = (index: number) => {
    setDocumentosPdf((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateObra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !aceptaConsignacion) return;

    onAddObra({
      titulo,
      artista_id: artista.id,
      tecnica,
      medidas,
      año: parseInt(año, 10) || new Date().getFullYear(),
      precio_referencia: precio ? parseFloat(precio) : undefined,
      disponible,
      imagenes: imagenesObra.length > 0 ? imagenesObra : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'],
      descripcion,
      es_exclusiva: true,
      comision_porcentaje: 20,
    });

    // Resetear formulario
    setTitulo('');
    setPrecio('');
    setDescripcion('');
    setImagenesObra([]);
    setShowAddForm(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-[#12141a] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden glass-card my-auto">
          {/* Header del Dashboard */}
          <div className="relative p-6 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-slate-900 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artista.foto_perfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'}
                  alt={artista.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-bold text-white">{artista.nombre}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Artista Consignado ({artistPayoutPct}/{galleryFeePct})
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {artista.provincia_ciudad || 'Cuba'} • {misObras.length} Obra(s) en Catálogo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowContractModal(true)}
                className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver Contrato Consignación</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Control del Modo de Contacto */}
          <div className="p-4 bg-slate-900/60 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-medium">Modalidad de Atención a Compradores:</span>
            </div>

            <button
              onClick={() => onToggleContactoDirecto(artista.id)}
              className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-2 transition-all ${
                artista.contacto_directo
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {artista.contacto_directo ? (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                  <span>Contacto Directo Habilitado (WhatsApp/Email propio)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-amber-400" />
                  <span>Atención Asistida por la Galería / Plataforma</span>
                </>
              )}
            </button>
          </div>

          {/* Navegación por Pestañas */}
          <div className="flex border-b border-white/10 bg-slate-950/80 px-6">
            <button
              onClick={() => setActiveTab('obras')}
              className={`py-3 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'obras'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Mis Obras & Portafolio ({misObras.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('perfil')}
              className={`py-3 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-colors ${
                activeTab === 'perfil'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mi Perfil, Video, Fotos & PDFs</span>
            </button>
          </div>

          {/* Contenido Principal */}
          <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
            {activeTab === 'obras' && (
              <div className="space-y-6">
                {/* Botón para Mostrar Formulario de Nueva Obra */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">Portafolio de Colección</h3>
                    <p className="text-xs text-slate-400">
                      Obras consignadas en exclusividad (80% Artista / 20% Galería).
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="py-2 px-3.5 rounded-xl gold-button text-xs font-semibold flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddForm ? 'Cancelar' : 'Publicar Nueva Obra'}</span>
                  </button>
                </div>

                {/* Formulario de Nueva Obra */}
                {showAddForm && (
                  <form
                    onSubmit={handleCreateObra}
                    className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4 animate-fadeIn"
                  >
                    <h4 className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Registrar Nueva Creación (Consignación Exclusiva)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Título de la Obra *</label>
                        <input
                          type="text"
                          placeholder="Ej: Sombras Tropicales I"
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Técnica</label>
                        <input
                          type="text"
                          placeholder="Ej: Óleo sobre lienzo"
                          value={tecnica}
                          onChange={(e) => setTecnica(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Medidas / Dimensiones</label>
                        <input
                          type="text"
                          placeholder="Ej: 120 x 90 cm"
                          value={medidas}
                          onChange={(e) => setMedidas(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Año de Creación</label>
                        <input
                          type="number"
                          placeholder="2026"
                          value={año}
                          onChange={(e) => setAño(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2 p-3 bg-black/40 rounded-xl border border-white/10">
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Precio de Venta al Público (USD)
                        </label>
                        <input
                          type="number"
                          placeholder="Ej: 1000"
                          value={precio}
                          onChange={(e) => setPrecio(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-sm text-emerald-400 font-bold focus:border-amber-500 focus:outline-none mb-2"
                        />

                        {/* Calculadora visual de acuerdo del artista */}
                        {numericPrice > 0 && (
                          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
                              <span className="text-[10px] text-slate-400 block">Pago Neto Artista ({artistPayoutPct}%)</span>
                              <strong className="text-sm">${artistPayout.toLocaleString()} USD</strong>
                            </div>
                            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300">
                              <span className="text-[10px] text-slate-400 block">Comisión Galería ({galleryFeePct}%)</span>
                              <strong className="text-sm">${galleryFee.toLocaleString()} USD</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Descripción / Reseña de la Obra</label>
                      <textarea
                        rows={2}
                        placeholder="Breve reseña sobre el concepto, materiales o inspiración de la obra..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Componente Uploader de Imágenes */}
                    <ImageUploader
                      bucket="obras-imagenes"
                      multiple={true}
                      label="Fotografías de la Obra"
                      onImagesUploaded={(urls) => setImagenesObra(urls)}
                    />

                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                      <label className="text-xs text-amber-200 font-medium cursor-pointer flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={aceptaConsignacion}
                          onChange={(e) => setAceptaConsignacion(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400"
                        />
                        <span>Acepto publicar esta obra bajo Consignación Exclusiva ({artistPayoutPct}% Artista / {galleryFeePct}% Galería)</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!aceptaConsignacion}
                      className="w-full py-3 rounded-xl gold-button text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform mt-3 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar y Publicar Obra Exclusiva</span>
                    </button>
                  </form>
                )}

                {/* Lista de Obras Existentes */}
                {misObras.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-slate-900/30">
                    <Palette className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-300">Aún no tienes obras publicadas</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Haz clic en &quot;Publicar Nueva Obra&quot; para añadir tu primera creación.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {misObras.map((obra) => (
                      <div
                        key={obra.id}
                        className="p-4 rounded-xl bg-slate-900 border border-white/10 flex gap-3 group hover:border-amber-500/30 transition-all"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-950 border border-white/10 shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={obra.imagenes[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'}
                            alt={obra.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-serif font-bold text-white truncate">
                              {obra.titulo}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {obra.tecnica || 'Técnica mixta'}{obra.año ? `, ${obra.año}` : ''}
                            </p>
                            {obra.precio_referencia && (
                              <p className="text-xs font-semibold text-emerald-400 mt-1">
                                ${obra.precio_referencia.toLocaleString()} USD
                                <span className="text-[10px] text-slate-400 ml-1 font-normal">(80%: ${Math.round(obra.precio_referencia * 0.8).toLocaleString()})</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => onToggleObraDisponibilidad(obra.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 transition-colors ${
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
                              onClick={() => onDeleteObra(obra.id)}
                              title="Eliminar obra"
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'perfil' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-white">Editar Perfil Multimedia & Biografía</h3>
                    <p className="text-xs text-slate-400">Sin límite de longitud. Sube tus videos, fotos de estudio y PDFs.</p>
                  </div>
                  {perfilSaved && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> ¡Perfil actualizado!
                    </span>
                  )}
                </div>

                {/* Ubicación y Contacto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Provincia / Ciudad</label>
                    <input
                      type="text"
                      placeholder="Ej: La Habana, Cuba"
                      value={provincia}
                      onChange={(e) => setProvincia(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Contacto Personal (WhatsApp o Correo)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: +53 52000000 o miperfil@arte.cu"
                      value={contacto}
                      onChange={(e) => setContacto(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Biografía Ilimitada */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400 font-medium">Biografía & Trayectoria (Sin límite de texto)</label>
                    <span className="text-[10px] text-slate-500">{bio.length} caracteres</span>
                  </div>
                  <textarea
                    rows={5}
                    placeholder="Escribe tu trayectoria artística en detalle, influencias, exposiciones internacionales, distinciones y colecciones..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-y"
                  />
                </div>

                {/* Notas de Taller & Storytelling */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">
                    Notas de Taller & Narrativa del Artista (Storytelling para Coleccionistas)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Comparte una cita o reflexión personal sobre lo que buscas transmitir en tu estudio..."
                    value={notasTaller}
                    onChange={(e) => setNotasTaller(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-amber-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-y italic"
                  />
                </div>

                {/* Video de Presentación */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    Enlace de Video de Presentación / Entrevista (YouTube / Vimeo / MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... o URL de video"
                    value={videoPresentacion}
                    onChange={(e) => setVideoPresentacion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Foto de Perfil */}
                <ImageUploader
                  bucket="artistas-imagenes"
                  multiple={false}
                  label="Foto de Perfil del Artista"
                  currentImages={fotoPerfil ? [fotoPerfil] : []}
                  onImagesUploaded={(urls) => setFotoPerfil(urls[0] || '')}
                />

                {/* Fotos del Taller / Proceso Creativo */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Fotos del Taller & Estudio (Galería del Artista)
                  </label>
                  <ImageUploader
                    bucket="artistas-imagenes"
                    multiple={true}
                    label="Subir fotos de estudio / taller"
                    currentImages={fotosGaleria}
                    onImagesUploaded={(urls) => setFotosGaleria(urls)}
                  />
                </div>

                {/* Archivos PDF (Dossier / CV) */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Documentos PDF (Dossier Artístico, CV, Catálogos)
                  </label>

                  {documentosPdf.length > 0 && (
                    <div className="space-y-2">
                      {documentosPdf.map((doc, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-red-400 shrink-0" />
                            <span className="font-medium text-slate-200 truncate">{doc.titulo}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePdfDocument(idx)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Título (Ej: Dossier 2026.pdf)"
                      value={nuevoPdfTitulo}
                      onChange={(e) => setNuevoPdfTitulo(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL del PDF (https://...)"
                      value={nuevoPdfUrl}
                      onChange={(e) => setNuevoPdfUrl(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddPdfDocument}
                      className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
                    >
                      + Añadir Documento
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl gold-button text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform mt-6"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios de Perfil Completo</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal del Contrato de Consignación */}
      <ConsignmentContractModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        artista={artista}
      />
    </>
  );
}
