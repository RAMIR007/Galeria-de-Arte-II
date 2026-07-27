'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MOCK_OBRAS } from '@/lib/mockData';
import { Obra } from '@/types/database';
import { ShieldCheck, Award, AlertTriangle, ArrowLeft, CheckCircle2, Sparkles, Calendar, Ruler, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function VerificarObraPage() {
  const params = useParams();
  const obraId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [obra, setObra] = useState<Obra | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (obraId) {
      // Buscar obra en el catálogo (coincidencia por ID o prefijo de ID)
      const found = MOCK_OBRAS.find(
        (o) => o.id === obraId || o.id.substring(0, 8).toUpperCase() === obraId.toUpperCase()
      );
      setObra(found || null);
      setLoading(false);
    }
  }, [obraId]);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-[#12141a] border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-center glass-card">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <Link
            href="/"
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Galería Virtual</span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Sistema Oficial de Autenticidad
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-slate-400 text-sm animate-pulse">
            Verificando registro en base de datos de la Galería...
          </div>
        ) : obra ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Valid Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold text-xs uppercase tracking-wider shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Certificado Verificado & Auténtico</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
                {obra.titulo}
              </h1>
              <p className="text-sm font-semibold text-amber-400">
                Obra original por {obra.artista?.nombre || 'Artista Cubano'}
              </p>
            </div>

            {/* Obra Thumbnail */}
            <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border-2 border-amber-500/30 shadow-xl bg-slate-950">
              <Image
                src={obra.imagenes[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'}
                alt={obra.titulo}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Official Technical Sheet Data */}
            <div className="bg-slate-900/90 border border-white/10 rounded-xl p-5 text-left text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400 font-medium">ID de Registro:</span>
                <span className="font-mono text-amber-400 font-bold">
                  CERT-CUB-{obra.id.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Técnica
                  </span>
                  <span className="text-slate-200 font-medium">{obra.tecnica}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Medidas
                  </span>
                  <span className="text-slate-200 font-medium">{obra.medidas}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Año de Creación
                  </span>
                  <span className="text-slate-200 font-medium">{obra.año}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Estado
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {obra.disponible ? 'Disponible / Auténtica' : 'Reservada / Colección'}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Seal Info */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 font-semibold mb-0.5">
                  Respaldo Oficial de la Galería Virtual de Arte Cubano
                </strong>
                <span>
                  Esta pieza forma parte del inventario auditado. La autenticidad está garantizada de forma permanente por Ramiro Mantilla (Director General) y el artista autor.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-white">
              Certificado No Encontrado o Inválido
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              El código escaneado no coincide con ningún registro activo en la base de datos oficial. Si cree que se trata de un error, contacte a la dirección de la galería.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
