'use client';

import React, { useState } from 'react';
import { Obra, ContactoPlataforma } from '@/types/database';
import { X, CheckCircle, PhoneCall, Mail, Ruler, Calendar, DollarSign, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ArtworkModalProps {
  obra: Obra | null;
  platformContacts: ContactoPlataforma[];
  onClose: () => void;
}

export function ArtworkModal({ obra, platformContacts, onClose }: ArtworkModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!obra) return null;

  const isContactoDirecto = obra.artista?.contacto_directo ?? false;
  const activePlatformContact = platformContacts.find((c) => c.activo) || platformContacts[0];

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

  const getContactLink = () => {
    if (isContactoDirecto && obra.artista?.whatsapp_email_contacto) {
      const contactInfo = obra.artista.whatsapp_email_contacto;
      if (contactInfo.includes('@')) {
        return `mailto:${contactInfo}?subject=Consulta sobre obra: ${encodeURIComponent(obra.titulo)}`;
      }
      const cleanNum = contactInfo.replace(/[^0-9+]/g, '');
      return `https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hola, me interesa la obra "${obra.titulo}" del artista ${obra.artista.nombre}.`)}`;
    } else if (activePlatformContact) {
      const cleanNum = activePlatformContact.whatsapp_email.replace(/[^0-9+]/g, '');
      return `https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hola Galería Cubana, deseo consultar la disponibilidad de "${obra.titulo}" por ${obra.artista?.nombre || 'el artista'}.`)}`;
    }
    return '#';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#12141a] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden my-8 glass-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-amber-500/20 border border-white/10 flex items-center justify-center transition-all"
          aria-label="Cerrar vista"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View Column */}
          <div className="relative bg-slate-950 flex items-center justify-center min-h-[350px] md:min-h-[500px]">
            <Image
              src={obra.imagenes[currentImageIndex] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'}
              alt={obra.titulo}
              fill
              className="object-contain p-4"
              unoptimized
            />

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

              <p className="text-base text-amber-400/90 font-medium mb-4">
                {obra.artista?.nombre || 'Artista Cubano'}
              </p>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {obra.descripcion || 'Sin descripción disponible.'}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-white/5 mb-6">
                {obra.medidas && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-slate-400 block">Dimensiones</strong>
                      {obra.medidas}
                    </span>
                  </div>
                )}
                {obra.año && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-slate-400 block">Año</strong>
                      {obra.año}
                    </span>
                  </div>
                )}
                {obra.precio_referencia && (
                  <div className="col-span-2 flex items-center gap-2 text-slate-300 pt-2 border-t border-white/5">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-slate-400 block">Precio de referencia</strong>
                      <span className="text-base font-semibold text-emerald-400">
                        ${obra.precio_referencia.toLocaleString()} USD
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Contact Banner & Button */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 flex items-start gap-3">
                {isContactoDirecto ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 block mb-0.5">Artista de Confianza (Directo)</strong>
                      <span>
                        Al pulsar contactar, te comunicarás directamente con el artista ({obra.artista?.nombre}).
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5">Atención vía Plataforma</strong>
                      <span>
                        Negociación asistida por el equipo oficial ({activePlatformContact?.nombre_encargado || 'Ramiro'}).
                      </span>
                    </div>
                  </>
                )}
              </div>

              <a
                href={getContactLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl gold-button flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isContactoDirecto ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Contactar al Artista Directamente</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Consultar Disponibilidad con Plataforma</span>
                  </>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
