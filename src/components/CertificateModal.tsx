'use client';

import React from 'react';
import { Obra } from '@/types/database';
import { X, Printer, ShieldCheck, Award, Sparkles, QrCode, Download } from 'lucide-react';

interface CertificateModalProps {
  obra: Obra | null;
  onClose: () => void;
}

export function CertificateModal({ obra, onClose }: CertificateModalProps) {
  if (!obra) return null;

  const certificateId = `CERT-CUB-${obra.id.substring(0, 8).toUpperCase()}`;
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verificar/${obra.id}`
    : `https://galeriavirtual.art/verificar/${obra.id}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    verificationUrl
  )}&color=d97706&bgcolor=0a0b0e`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-[#0e1017] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-4 glass-card flex flex-col print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none">
        {/* Header (hidden in print) */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#12141a] print:hidden">
          <div className="flex items-center gap-2 text-amber-400">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-serif font-bold text-white">
              Certificado Digital de Autenticidad
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl gold-button text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Descargar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Printable Area) */}
        <div className="p-8 sm:p-12 relative bg-gradient-to-b from-[#12141a] via-[#0b0c10] to-[#08090c] border-8 border-amber-500/20 m-4 rounded-xl print:m-0 print:border-4 print:border-amber-600 print:bg-white print:text-black">
          {/* Inner Decorative Border */}
          <div className="absolute inset-3 border border-amber-500/30 rounded-lg pointer-events-none print:border-amber-600" />

          <div className="relative z-10 space-y-8 text-center">
            {/* Title Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold uppercase tracking-widest mb-3 print:border-amber-600 print:text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Documento Oficial de Garantía
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold gold-gradient-text tracking-wide uppercase print:text-amber-900">
                Certificado de Autenticidad
              </h2>
              <p className="text-xs text-slate-400 font-serif italic mt-1 print:text-slate-600">
                Galería Virtual de Arte Cubano — Registro Oficial de Curaduría
              </p>
            </div>

            {/* Statement */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed print:text-slate-800">
              Por la presente se certifica que la siguiente obra de arte plástica es una pieza original, auténtica y producida por el creador cubano indicado a continuación.
            </p>

            {/* Artwork Details Box */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-6 text-left max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs print:bg-slate-50 print:border-amber-600 print:text-slate-900">
              <div className="col-span-2 border-b border-white/10 pb-3 print:border-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold print:text-slate-600">
                  Título de la Obra
                </span>
                <strong className="text-base font-serif text-white block mt-0.5 print:text-black">
                  {obra.titulo}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold print:text-slate-600">
                  Artista Autor
                </span>
                <strong className="text-amber-300 font-medium block mt-0.5 print:text-amber-900">
                  {obra.artista?.nombre || 'Artista Cubano'}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold print:text-slate-600">
                  Técnica & Materiales
                </span>
                <strong className="text-slate-200 block mt-0.5 print:text-slate-900">
                  {obra.tecnica || 'Técnica Mixta'}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold print:text-slate-600">
                  Dimensiones Reales
                </span>
                <strong className="text-slate-200 block mt-0.5 print:text-slate-900">
                  {obra.medidas || '100 x 120 cm'}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold print:text-slate-600">
                  Año de Creación
                </span>
                <strong className="text-slate-200 block mt-0.5 print:text-slate-900">
                  {obra.año || new Date().getFullYear()}
                </strong>
              </div>

              <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600">Código de Certificado:</span>
                <span className="font-mono text-amber-400 font-semibold print:text-amber-900">
                  {certificateId}
                </span>
              </div>
            </div>

            {/* Seal & QR Footer Grid */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center max-w-xl mx-auto text-center border-t border-white/10 print:border-slate-300">
              {/* QR Verification */}
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/40 shadow-md print:bg-white">
                  <img
                    src={qrImageUrl}
                    alt="Verificación QR"
                    className="w-20 h-20 object-contain rounded"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-mono print:text-slate-600">
                  Escanear para Verificación
                </span>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-slate-950 flex flex-col items-center justify-center text-slate-950 p-1 text-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-slate-950" />
                    <span className="text-[7px] uppercase tracking-tighter leading-none mt-0.5 font-extrabold">
                      Galería Cubana
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-300 font-semibold mt-2 uppercase tracking-wider print:text-amber-900">
                  Sello Oficial
                </span>
              </div>

              {/* Digital Signature */}
              <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                <div className="h-16 flex flex-col justify-end">
                  <span className="font-serif italic text-amber-300 text-lg font-bold block leading-none print:text-amber-900">
                    Ramiro
                  </span>
                  <div className="w-32 h-px bg-amber-500/50 mt-1" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold mt-1 print:text-slate-700">
                  Dirección General
                </span>
                <span className="text-[9px] text-slate-500 print:text-slate-500">
                  Galería Virtual de Arte Cubano
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
