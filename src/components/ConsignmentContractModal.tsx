'use client';

import React from 'react';
import { Artista } from '@/types/database';
import { ShieldCheck, Printer, X, FileText, Award, DollarSign } from 'lucide-react';

interface ConsignmentContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  artista: Artista;
}

export function ConsignmentContractModal({
  isOpen,
  onClose,
  artista,
}: ConsignmentContractModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-[#12141a] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden glass-card my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header (Oculto al imprimir si se desea) */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Contrato de Consignación Exclusiva
              </h2>
              <p className="text-xs text-slate-400">
                Acuerdo de Representación Comercial & Curaduría (Norma Internacional)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Contrato */}
        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible print:text-black print:p-8">
          {/* Cabecera Impresa */}
          <div className="text-center pb-6 border-b border-white/10 print:border-slate-300">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold print:text-amber-700 block mb-1">
              Galería Virtual de Arte Cubano
            </span>
            <h1 className="text-2xl font-serif font-bold text-white print:text-black">
              CONTRATO DE CONSIGNACIÓN Y REPRESENTACIÓN EXCLUSIVA DE OBRAS DE ARTE
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-2">
              Ref. Expediente Artista: <strong className="text-white print:text-black">{artista.id}</strong> | Fecha: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Resumen Interactivo de Condiciones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center print:border-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1 print:text-emerald-700" />
              <span className="text-[11px] text-slate-400 print:text-slate-600 block">Comisión Galería</span>
              <strong className="text-base text-emerald-400 font-serif font-bold print:text-emerald-800">20% Fee</strong>
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center print:border-slate-300">
              <Award className="w-4 h-4 text-amber-400 mx-auto mb-1 print:text-amber-700" />
              <span className="text-[11px] text-slate-400 print:text-slate-600 block">Liquidación Artista</span>
              <strong className="text-base text-amber-300 font-serif font-bold print:text-amber-800">80% Neto</strong>
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-center print:border-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400 mx-auto mb-1 print:text-sky-700" />
              <span className="text-[11px] text-slate-400 print:text-slate-600 block">Régimen Obras</span>
              <strong className="text-base text-sky-300 font-serif font-bold print:text-sky-800">Exclusividad Estricta</strong>
            </div>
          </div>

          {/* Cláusulas */}
          <div className="space-y-4 text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-amber-300 print:text-black text-base border-b border-amber-500/20 pb-1">
              CLÁUSULA PRIMERA: OBJETO Y ALCANCE DE LA EXCLUSIVIDAD
            </h3>
            <p>
              El artista <strong className="text-white print:text-black">{artista.nombre}</strong> consigna en favor de la <strong className="text-white print:text-black">Galería Virtual de Arte Cubano</strong> el derecho exclusivo de representación comercial, exhibición digital y venta de las obras consignadas y publicadas en el catálogo oficial de la plataforma. El artista garantiza que las piezas consignadas no estarán simultáneamente ofrecidas en otras galerías o canales sin acuerdo previo.
            </p>

            <h3 className="font-serif font-bold text-amber-300 print:text-black text-base border-b border-amber-500/20 pb-1">
              CLÁUSULA SEGUNDA: ESTRUCTURA FINANCIERA Y LIQUIDACIÓN (80% / 20%)
            </h3>
            <p>
              Sobre el precio final de venta acordado entre la Galería y el comprador:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300 print:text-black">
              <li><strong>Comisión de Galería (20%):</strong> Retenido por la plataforma para cubrir los gastos de curaduría, certificación de autenticidad, marketing digital y gestión al coleccionista.</li>
              <li><strong>Monto Neto del Artista (80%):</strong> Liquidado al artista en un plazo no mayor a 7 a 14 días hábiles posteriores a la confirmación del pago del coleccionista.</li>
            </ul>

            <h3 className="font-serif font-bold text-amber-300 print:text-black text-base border-b border-amber-500/20 pb-1">
              CLÁUSULA TERCERA: CERTIFICACIÓN Y GARANTÍA DE AUTENTICIDAD
            </h3>
            <p>
              Toda obra vendida contará con un Certificado de Autenticidad respaldado por la <strong className="text-white print:text-black">Dirección General de la Galería</strong> con código QR de verificación auditada. El artista garantiza la autoría original e inalienable de las obras publicadas.
            </p>
          </div>

          {/* Firmas al pie */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center border-t border-white/10 print:border-slate-400 mt-6">
            <div>
              <div className="h-12 flex items-end justify-center mb-1">
                <span className="font-serif italic text-amber-400 print:text-black text-lg">Dirección General</span>
              </div>
              <div className="border-t border-slate-600 print:border-black pt-1">
                <p className="text-xs font-semibold text-white print:text-black">Dirección General de Curaduría</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">Galería Virtual de Arte Cubano</p>
              </div>
            </div>
            <div>
              <div className="h-12 flex items-end justify-center mb-1">
                <span className="font-serif italic text-white print:text-black text-lg">{artista.nombre}</span>
              </div>
              <div className="border-t border-slate-600 print:border-black pt-1">
                <p className="text-xs font-semibold text-white print:text-black">{artista.nombre}</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">Artista Consignante</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Ocultos al imprimir) */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Contrato Registrado Digitalmente
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
