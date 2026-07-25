'use client';

import React from 'react';
import { Obra } from '@/types/database';
import { ShieldCheck, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface ArtworkCardProps {
  obra: Obra;
  onSelect: (obra: Obra) => void;
}

export function ArtworkCard({ obra, onSelect }: ArtworkCardProps) {
  const isContactoDirecto = obra.artista?.contacto_directo ?? false;
  const mainImage = obra.imagenes[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800';

  return (
    <div
      onClick={() => onSelect(obra)}
      className="group relative bg-[#12141a] rounded-2xl overflow-hidden border border-white/10 glass-card-hover cursor-pointer flex flex-col justify-between"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
        <Image
          src={mainImage}
          alt={obra.titulo}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-transparent to-transparent opacity-80" />

        {/* Badge: Contacto Directo vs Gestión Asistida */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isContactoDirecto ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Contacto Directo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Gestión Asistida
            </span>
          )}
        </div>

        {/* Quick view button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
          <button className="px-4 py-2 rounded-full gold-button text-xs font-semibold flex items-center gap-2 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4" />
            Ver Ficha Completa
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{obra.tecnica || 'Técnica Mixta'}</span>
            {obra.año && <span>{obra.año}</span>}
          </div>

          <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {obra.titulo}
          </h3>

          <p className="text-xs text-amber-400 font-medium mt-1">
            {obra.artista?.nombre || 'Artista Cubano'}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {obra.medidas ? obra.medidas : 'Dimensiones bajo consulta'}
          </span>
          {obra.precio_referencia ? (
            <span className="text-sm font-semibold text-emerald-400">
              ${obra.precio_referencia.toLocaleString()} USD
            </span>
          ) : (
            <span className="text-xs text-amber-300 italic">Consultar precio</span>
          )}
        </div>
      </div>
    </div>
  );
}
