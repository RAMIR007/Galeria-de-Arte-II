'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MOCK_OBRAS } from '@/lib/mockData';
import { Obra } from '@/types/database';
import { ShieldCheck, Award, AlertTriangle, ArrowLeft, CheckCircle2, Sparkles, Clock, FileCheck } from 'lucide-react';
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
      <div className="w-full max-w-2xl bg-[#12141a] border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-center glass-card relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
            Verificando registro criptográfico en la base de datos oficial...
          </div>
        ) : obra ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Valid Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold text-xs uppercase tracking-wider shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Certificado Auditado & Auténtico</span>
            </div>

            {/* Sello Holográfico Interactivo de Autenticidad Digital */}
            <div className="relative w-28 h-28 mx-auto my-2 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-2xl flex items-center justify-center group cursor-pointer animate-pulse">
              <div className="w-full h-full rounded-full border-2 border-dashed border-slate-950 bg-gradient-to-tr from-slate-950 via-amber-950 to-slate-900 flex flex-col items-center justify-center text-amber-300 p-1 text-center font-bold relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full" />
                <ShieldCheck className="w-8 h-8 text-amber-400 mb-0.5" />
                <span className="text-[8px] uppercase tracking-wider leading-none font-extrabold text-amber-200">
                  SELLO HOLOGRÁFICO
                </span>
                <span className="text-[6px] tracking-tighter text-slate-400">INALTERABLE</span>
              </div>
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
                <span className="text-slate-400 font-medium">ID de Registro Hash:</span>
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
                    Estado de Consignación
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {obra.disponible ? '✓ Consignación Exclusiva' : 'Reservada / Colección'}
                  </span>
                </div>
              </div>
            </div>

            {/* Línea de Tiempo de Procedencia Auditable (Provenance Trail) */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-white/10 text-left space-y-3">
              <h3 className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Línea de Tiempo de Procedencia & Historial Auditable
              </h3>
              <div className="relative pl-5 border-l-2 border-amber-500/40 space-y-4 text-xs">
                {/* Evento 1 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950" />
                  <p className="font-semibold text-white">Creación & Atelier del Artista ({obra.año})</p>
                  <p className="text-[11px] text-slate-400">Pieza única concebida y creada en el estudio de {obra.artista?.nombre}.</p>
                </div>

                {/* Evento 2 */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                  <p className="font-semibold text-white">Consignación Exclusiva en Galería (2026)</p>
                  <p className="text-[11px] text-slate-400">Acuerdo de representación y custodia legal expedido por la Galería Virtual de Arte Cubano.</p>
                </div>

                {/* Evento 3 (Exposiciones si existen) */}
                {obra.historial_exposiciones && obra.historial_exposiciones.length > 0 && (
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-3 h-3 rounded-full bg-sky-400 border-2 border-slate-950" />
                    <p className="font-semibold text-white">Historial de Exhibiciones & Muestras</p>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 mt-1">
                      {obra.historial_exposiciones.map((expo, idx) => (
                        <li key={idx}>{expo}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
                  Esta pieza forma parte del inventario auditado. La autenticidad está garantizada de forma permanente por la Dirección General de la Galería y el artista autor.
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
