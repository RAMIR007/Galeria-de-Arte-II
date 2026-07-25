'use client';

import React, { useState } from 'react';
import { Artista, Obra } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import {
  X,
  Palette,
  User,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  PhoneCall,
  Mail,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Save,
  ImageIcon,
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

  // Formulario de edición de perfil
  const [bio, setBio] = useState(artista.bio || '');
  const [provincia, setProvincia] = useState(artista.provincia_ciudad || 'La Habana');
  const [contacto, setContacto] = useState(artista.whatsapp_email_contacto || '');
  const [fotoPerfil, setFotoPerfil] = useState(artista.foto_perfil || '');
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

  if (!isOpen) return null;

  // Obras específicas del artista
  const misObras = obras.filter((o) => o.artista_id === artista.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateArtista(artista.id, {
      bio,
      provincia_ciudad: provincia,
      whatsapp_email_contacto: contacto,
      foto_perfil: fotoPerfil,
    });
    setPerfilSaved(true);
    setTimeout(() => setPerfilSaved(false), 2500);
  };

  const handleCreateObra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo) return;

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
    });

    // Resetear formulario
    setTitulo('');
    setPrecio('');
    setDescripcion('');
    setImagenesObra([]);
    setShowAddForm(false);
  };

  return (
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
                  Artista Autenticado
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {artista.provincia_ciudad || 'Cuba'} • {misObras.length} Obra(s) en Catálogo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:static w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
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
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
            }`}
          >
            {artista.contacto_directo ? (
              <>
                <ToggleRight className="w-4 h-4 text-amber-400" />
                <span>Contacto Directo Habilitado (WhatsApp/Email propio)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-indigo-400" />
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
            <span>Mi Perfil & Datos de Contacto</span>
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'obras' && (
            <div className="space-y-6">
              {/* Botón para Mostrar Formulario de Nueva Obra */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Portafolio de Colección</h3>
                  <p className="text-xs text-slate-400">
                    Administra tus creaciones activas en la Galería Virtual.
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
                    <Plus className="w-4 h-4" /> Registrar Nueva Creación
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

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Precio de Referencia (USD)
                      </label>
                      <input
                        type="number"
                        placeholder="Ej: 1500"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <label className="text-xs text-slate-300 font-medium cursor-pointer flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={disponible}
                          onChange={(e) => setDisponible(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400"
                        />
                        <span>Disponible para Venta / Reserva</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Descripción / Historia de la Obra</label>
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
                    label="Fotografías de la Obra (Supabase Storage / Local)"
                    onImagesUploaded={(urls) => setImagenesObra(urls)}
                  />

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl gold-button text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform mt-3"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar y Publicar Obra</span>
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
                            <p className="text-xs font-semibold text-amber-400 mt-1">
                              ${obra.precio_referencia.toLocaleString()} USD
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
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-200">Editar Información Personal</h3>
                {perfilSaved && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> ¡Perfil actualizado!
                  </span>
                )}
              </div>

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

              <div>
                <label className="text-xs text-slate-400 block mb-1">Biografía del Artista</label>
                <textarea
                  rows={4}
                  placeholder="Reseña sobre tu trayectoria artística, estilo y exhibiciones principales..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              {/* Subida de foto de perfil */}
              <ImageUploader
                bucket="artistas-imagenes"
                multiple={false}
                label="Foto de Perfil (Supabase Storage / Local)"
                currentImages={fotoPerfil ? [fotoPerfil] : []}
                onImagesUploaded={(urls) => setFotoPerfil(urls[0] || '')}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-button text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform mt-4"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de Perfil</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
