'use client';

import React, { useState } from 'react';
import { Obra, ContactoPlataforma } from '@/types/database';
import {
  X,
  CheckCircle,
  PhoneCall,
  Mail,
  Ruler,
  Calendar,
  DollarSign,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Award,
  ZoomIn,
} from 'lucide-react';
import Image from 'next/image';
import { WallVisualizerModal } from './WallVisualizerModal';
import { CertificateModal } from './CertificateModal';

interface ArtworkModalProps {
  obra: Obra | null;
  platformContacts: ContactoPlataforma[];
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (obraId: string) => void;
}

export function ArtworkModal({
  obra,
  platformContacts,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}: ArtworkModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados de Vanguardia (Fase 5)
  const [showWallVisualizer, setShowWallVisualizer] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Lupa Ultra-HD Zoom
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  if (!obra) return null;

  const isContactoDirecto = obra.artista?.contacto_directo ?? false;
  const activePlatformContact = platformContacts.find((c) => c.activo) || platformContacts[0];
  const mainImage = obra.imagenes[currentImageIndex] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000';

  const handleNextImage = () => {
    if (obra.imagenes.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % obra.imagenes.length);
    }
  };

  const handlePrevImage = () => {
    if (obra.imagenes.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + obra.imagenes.length) % obra.imagenes.length);
    }
  };

  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const getWhatsAppLink = () => {
    const artistaNombre = obra.artista?.nombre || 'Artista Cubano';
    if (isContactoDirecto && obra.artista?.whatsapp_email_contacto) {
      const contactInfo = obra.artista.whatsapp_email_contacto;
      if (!contactInfo.includes('@')) {
        const cleanNum = contactInfo.replace(/[^0-9+]/g, '');
        const text = `Hola ${artistaNombre}, vi tu obra "${obra.titulo}" (${obra.tecnica || 'Arte Cubano'}${obra.año ? `, ${obra.año}` : ''}) en la Galería Virtual de Arte Cubano. Me gustaría ponerme en contacto directo contigo para consultar su disponibilidad y adquisición.`;
        return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
      }
    }

    if (activePlatformContact) {
      const cleanNum = activePlatformContact.whatsapp_email.replace(/[^0-9+]/g, '');
      const gestorNombre = activePlatformContact.nombre_encargado;
      const text = `Hola ${gestorNombre} (Galería Virtual de Arte Cubano), estoy interesado en recibir asistencia oficial para negociar y adquirir la obra "${obra.titulo}" del artista ${artistaNombre}.`;
      return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
    }

    return '#';
  };

  const getEmailLink = () => {
    const artistaNombre = obra.artista?.nombre || 'Artista Cubano';
    const subject = `Consulta sobre obra: ${obra.titulo} - Galería de Arte Cubano`;
    const body = `Hola ${isContactoDirecto ? artistaNombre : 'Galería de Arte Cubano'},\n\nEstoy interesado(a) en obtener más detalles y disponibilidad de la obra "${obra.titulo}" (${obra.tecnica || 'Arte Cubano'}) por ${artistaNombre}.\n\nSaludos.`;

    if (isContactoDirecto && obra.artista?.whatsapp_email_contacto?.includes('@')) {
      return `mailto:${obra.artista.whatsapp_email_contacto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    return `mailto:contacto@galeriacubana.art?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-[#12141a] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden my-8 glass-card">
          {/* Action Header: Favorite + Close */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(obra.id)}
                title={isFavorite ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  isFavorite
                    ? 'bg-red-500/20 border-red-500/50 text-red-500'
                    : 'bg-slate-900/80 text-slate-300 hover:text-red-400 border-white/10'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-amber-500/20 border border-white/10 flex items-center justify-center transition-all"
              aria-label="Cerrar vista"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery View Column */}
            <div className="relative bg-slate-950 flex flex-col justify-between min-h-[350px] md:min-h-[500px]">
              {/* Image Container with Zoom Loupe */}
              <div
                className="relative flex-1 flex items-center justify-center overflow-hidden cursor-crosshair group p-4"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMoveZoom}
              >
                <Image
                  src={mainImage}
                  alt={obra.titulo}
                  fill
                  className="object-contain p-4 transition-transform duration-300"
                  unoptimized
                />

                {/* Magnifying Glass Zoom Overlay (Lupa Ultra-HD) */}
                {isZooming && (
                  <div
                    className="absolute w-36 h-36 rounded-full border-2 border-amber-400 shadow-2xl pointer-events-none overflow-hidden bg-slate-950"
                    style={{
                      left: `calc(${zoomPos.x}% - 72px)`,
                      top: `calc(${zoomPos.y}% - 72px)`,
                      backgroundImage: `url(${mainImage})`,
                      backgroundSize: '300%',
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    }}
                  />
                )}

                {/* Zoom Hint Badge */}
                <div className="absolute top-3 left-3 opacity-80 group-hover:opacity-100 transition-opacity bg-slate-900/80 border border-white/10 px-2.5 py-1 rounded-full text-[10px] text-slate-300 flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-amber-400" />
                  <span>Pasa el cursor para Lupa HD</span>
                </div>

                {obra.imagenes.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-amber-500/30 text-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-amber-500/30 text-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full">
                      {obra.imagenes.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-amber-400 w-4' : 'bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Vanguard Interactive Bar (Ver en mi Pared & Certificado) */}
              <div className="p-3 bg-[#0c0d12] border-t border-white/10 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowWallVisualizer(true)}
                  className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Ver en mi Pared</span>
                </button>

                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Certificado PDF</span>
                </button>
              </div>
            </div>

            {/* Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Disponibilidad badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                    {obra.tecnica || 'Arte Cubano'}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      obra.disponible
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-700/40 text-slate-400'
                    }`}
                  >
                    {obra.disponible ? '✓ Disponible' : 'Reservada'}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
                  {obra.titulo}
                </h2>
                <p className="text-sm font-semibold text-amber-400 mb-4">
                  por {obra.artista?.nombre || 'Artista Cubano'}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {obra.descripcion ||
                    'Pieza original autenticada. Creada por destacados artistas de las artes plásticas cubanas contemporáneas.'}
                </p>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Dimensiones</span>
                      <span className="font-medium">{obra.medidas || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Año</span>
                      <span className="font-medium">{obra.año || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 text-slate-300 pt-2 border-t border-white/5">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Precio de Referencia</span>
                      <span className="font-semibold text-emerald-400 text-sm">
                        {obra.precio_referencia
                          ? `$${obra.precio_referencia.toLocaleString()} USD`
                          : 'Consultar directamente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Action Footer */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Modalidad de contacto:</span>
                  {isContactoDirecto ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Trato Directo con Artista
                    </span>
                  ) : (
                    <span className="text-amber-300 font-semibold">
                      Atención Asistida por Galería
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-4 rounded-xl gold-button flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-semibold"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>
                      {isContactoDirecto
                        ? `WhatsApp Directo (${obra.artista?.nombre})`
                        : `Consultar WhatsApp con Galería`}
                    </span>
                  </a>

                  <a
                    href={getEmailLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center justify-center gap-2 transition-colors text-xs font-semibold"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Simulador 'Ver en mi Pared' */}
      {showWallVisualizer && (
        <WallVisualizerModal
          obra={obra}
          onClose={() => setShowWallVisualizer(false)}
        />
      )}

      {/* Modal Certificado Digital de Autenticidad */}
      {showCertificateModal && (
        <CertificateModal
          obra={obra}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </>
  );
}

