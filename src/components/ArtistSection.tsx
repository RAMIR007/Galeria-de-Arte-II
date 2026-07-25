'use client';

import React from 'react';
import { Artista } from '@/types/database';
import { ShieldCheck, MapPin, Sparkles, UserCheck, Edit3 } from 'lucide-react';
import Image from 'next/image';

interface ArtistSectionProps {
  artistas: Artista[];
  onOpenDashboard?: (artista: Artista) => void;
}

export function ArtistSection({ artistas, onOpenDashboard }: ArtistSectionProps) {
  return (
    <section id="artistas" className="py-16 bg-[#07080b] border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2 block">
            Creadores & Maestros
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
            Nuestros Artistas Cubanos
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Conoce a los creadores detrás de cada obra. Las piezas cuentan con opción de{' '}
            <strong className="text-emerald-400">Contacto Directo</strong> habilitado o{' '}
            <strong className="text-amber-300">Gestión Asistida</strong> coordinada por nuestro equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artistas.map((art) => (
            <div
              key={art.id}
              className="bg-[#12141a] p-6 rounded-2xl border border-white/10 glass-card-hover flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber-500/30 shadow-lg">
                  <Image
                    src={art.foto_perfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'}
                    alt={art.nombre}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="text-center mb-3">
                  <h3 className="text-lg font-serif font-bold text-white">{art.nombre}</h3>
                  {art.provincia_ciudad && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {art.provincia_ciudad}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 text-center leading-relaxed mb-4">
                  {art.bio || 'Sin biografía disponible.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2 text-center">
                <div>
                  {art.contacto_directo ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Contacto Directo Habilitado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      Gestión Asistida por Plataforma
                    </span>
                  )}
                </div>

                {onOpenDashboard && (
                  <button
                    onClick={() => onOpenDashboard(art)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors mt-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Mi Dashboard ({art.nombre.split(' ')[0]})</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
