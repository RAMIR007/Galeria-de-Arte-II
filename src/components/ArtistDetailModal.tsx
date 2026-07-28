'use client';

import React, { useState } from 'react';
import { Artista, Obra } from '@/types/database';
import {
  X,
  MapPin,
  ShieldCheck,
  Sparkles,
  Video,
  FileText,
  Download,
  Image as ImageIcon,
  Palette,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';

interface ArtistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  artista: Artista | null;
  obras: Obra[];
  onSelectObra?: (obra: Obra) => void;
}

export function ArtistDetailModal({
  isOpen,
  onClose,
  artista,
  obras,
  onSelectObra,
}: ArtistDetailModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen || !artista) return null;

  const obrasDelArtista = obras.filter((o) => o.artista_id === artista.id);

  // Helper para embeber videos de YouTube
  const getEmbedVideoUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedVideoUrl(artista.video_presentacion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#12141a] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden glass-card my-auto">
        {/* Header con foto de portada / perfil */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400 shadow-xl shrink-0 bg-slate-900">
              <Image
                src={artista.foto_perfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'}
                alt={artista.nombre}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {artista.nombre}
                </h2>
                {artista.contacto_directo ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Contacto Directo Habilitado
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Gestión Asistida Galería
                  </span>
                )}
              </div>

              {artista.provincia_ciudad && (
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {artista.provincia_ciudad} • {obrasDelArtista.length} Obra(s) Exclusivas en Catálogo
                </p>
              )}

              {artista.whatsapp_email_contacto && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  {artista.whatsapp_email_contacto}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:static w-9 h-9 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Principal con Scroll */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Biografía Ilimitada */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Biografía & Trayectoria Artística
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 bg-white/5 p-5 rounded-xl border border-white/5 whitespace-pre-line">
              {artista.bio || 'El artista no ha registrado una biografía detallada.'}
            </div>
          </div>

          {/* Notas de Taller / Storytelling del Creador */}
          {artista.notas_taller && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Notas de Taller & Narrativa de Creación (Storytelling)
              </h3>
              <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 text-amber-100 text-sm italic leading-relaxed relative">
                <span className="text-4xl font-serif text-amber-500/30 absolute top-2 left-3 leading-none select-none">“</span>
                <p className="relative z-10 pl-4">{artista.notas_taller}</p>
                <span className="text-[11px] text-amber-400/80 block mt-3 text-right font-serif not-italic font-semibold">
                  — Palabras directas de {artista.nombre} desde su estudio
                </span>
              </div>
            </div>
          )}

          {/* Video de Presentación */}
          {embedUrl && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400" />
                Video de Presentación / Entrevista
              </h3>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                <iframe
                  src={embedUrl}
                  title={`Video de presentación - ${artista.nombre}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Galería de Fotos del Taller / Proceso Creativo */}
          {artista.fotos_galeria && artista.fotos_galeria.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Fotos del Taller & Proceso Creativo
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artista.fotos_galeria.map((fotoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(fotoUrl)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer group shadow-md"
                  >
                    <Image
                      src={fotoUrl}
                      alt={`Foto de estudio ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-white bg-black/60 px-2 py-1 rounded-md">Ampliar</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentos PDF (Dossier, CV, Catálogo) */}
          {artista.documentos_pdf && artista.documentos_pdf.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                Documentos & Dossier Artístico (PDF)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {artista.documentos_pdf.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-200 font-medium group-hover:text-amber-300 transition-colors">
                        {doc.titulo}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Obras Consignadas en Catálogo */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              Obras Representadas en Galería ({obrasDelArtista.length})
            </h3>

            {obrasDelArtista.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay obras registradas en este momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {obrasDelArtista.map((obra) => (
                  <div
                    key={obra.id}
                    onClick={() => {
                      if (onSelectObra) {
                        onSelectObra(obra);
                        onClose();
                      }
                    }}
                    className="bg-[#181b24] rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-amber-500/50 transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        src={obra.imagenes[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=500'}
                        alt={obra.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Consignación Exclusiva
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {obra.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {obra.tecnica} • {obra.año}
                      </p>
                      {obra.precio_referencia && (
                        <p className="text-xs font-bold text-emerald-400 mt-2">
                          ${obra.precio_referencia.toLocaleString()} USD
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de foto ampliada */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-3xl max-h-[85vh] w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto}
                alt="Foto ampliada del taller"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
