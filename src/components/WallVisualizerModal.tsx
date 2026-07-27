'use client';

import React, { useState } from 'react';
import { Obra } from '@/types/database';
import { X, Maximize2, Palette, Sparkles, Check, Move } from 'lucide-react';
import Image from 'next/image';

interface WallVisualizerModalProps {
  obra: Obra | null;
  onClose: () => void;
}

// Opciones de ambientes de habitaciones
const ROOM_ENVIRONMENTS = [
  {
    id: 'living',
    name: 'Salón Moderno',
    bg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600',
    wallYPercent: 42,
  },
  {
    id: 'office',
    name: 'Estudio Ejecutivo',
    bg: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600',
    wallYPercent: 40,
  },
  {
    id: 'dining',
    name: 'Comedor Minimalista',
    bg: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1600',
    wallYPercent: 44,
  },
  {
    id: 'bedroom',
    name: 'Dormitorio Principal',
    bg: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600',
    wallYPercent: 38,
  },
];

// Opciones de Marcos
const FRAME_STYLES = [
  { id: 'none', name: 'Sin Marco (Lienzo Expuesto)', style: '' },
  { id: 'black', name: 'Marco Negro Flotante', style: 'ring-8 ring-black shadow-2xl' },
  { id: 'gold', name: 'Marco Dorado Galería', style: 'ring-8 ring-amber-500/80 shadow-2xl' },
  { id: 'wood', name: 'Marco Madera Nogal', style: 'ring-8 ring-amber-900 shadow-2xl' },
];

// Colores de Pared de Referencia
const WALL_TINTS = [
  { id: 'default', name: 'Original', color: 'transparent' },
  { id: 'warm', name: 'Blanco Cálido', color: 'rgba(254, 243, 199, 0.08)' },
  { id: 'gray', name: 'Gris Galería', color: 'rgba(100, 116, 139, 0.15)' },
  { id: 'blue', name: 'Azul Noche', color: 'rgba(15, 23, 42, 0.25)' },
  { id: 'green', name: 'Verde Oliva', color: 'rgba(20, 83, 45, 0.15)' },
];

export function WallVisualizerModal({ obra, onClose }: WallVisualizerModalProps) {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_ENVIRONMENTS[0]);
  const [customWallBg, setCustomWallBg] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [selectedTint, setSelectedTint] = useState(WALL_TINTS[0]);

  if (!obra) return null;

  const mainImage = obra.imagenes[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000';

  const parseDimensions = (dimStr?: string | null) => {
    if (!dimStr) return { widthCm: 100, heightCm: 120 };
    const numbers = dimStr.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const w = parseInt(numbers[0], 10);
      const h = parseInt(numbers[1], 10);
      return { widthCm: w, heightCm: h };
    }
    return { widthCm: 100, heightCm: 120 };
  };

  const { widthCm, heightCm } = parseDimensions(obra.medidas);

  const referenceWallWidthCm = 240;
  const widthPercent = Math.min(Math.max((widthCm / referenceWallWidthCm) * 65, 18), 75);
  const aspectRatio = heightCm / widthCm;

  const handleCustomWallUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomWallBg(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f1117] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-4 glass-card flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#12141a]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                Simulador "Ver en mi Pared"
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-sans font-medium">
                  Escala 1:1 Proporcional
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {obra.titulo} — {obra.artista?.nombre} ({obra.medidas || '100 x 120 cm'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-amber-500/20 border border-white/10 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Viewport Canvas */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* Fondo de Habitación (Predeterminado o Foto Subida por el Cliente) */}
          <Image
            src={customWallBg || selectedRoom.bg}
            alt={customWallBg ? 'Pared Real del Cliente' : selectedRoom.name}
            fill
            className="object-cover transition-all duration-700 select-none"
            unoptimized
          />

          {!customWallBg && (
            <div
              className="absolute inset-0 transition-colors duration-500 pointer-events-none"
              style={{ backgroundColor: selectedTint.color }}
            />
          )}

          {/* Obra Colgada Proporcionalmente */}
          <div
            className="absolute transition-all duration-500 ease-out flex items-center justify-center group"
            style={{
              width: `${widthPercent}%`,
              aspectRatio: `${1 / aspectRatio}`,
              top: `${selectedRoom.wallYPercent}%`,
              transform: 'translateY(-50%)',
            }}
          >
            {/* Sombra de pared proyectada realista */}
            <div className="absolute inset-0 bg-black/60 blur-xl translate-y-4 scale-95 opacity-80" />

            <div className={`relative w-full h-full ${selectedFrame.style} transition-all duration-300`}>
              <Image
                src={mainImage}
                alt={obra.titulo}
                fill
                className="object-cover shadow-2xl"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
            </div>

            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-950/90 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] text-amber-300 font-semibold shadow-xl whitespace-nowrap backdrop-blur-md flex items-center gap-1.5">
              <Move className="w-3 h-3 text-amber-400" />
              <span>{widthCm} cm ancho × {heightCm} cm alto</span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-[#12141a] border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Custom Wall Upload Button */}
          <div className="col-span-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-amber-300 font-semibold block text-[11px] mb-1">
              📸 ¿Probar en tu propia pared?
            </span>
            <label className="cursor-pointer py-1.5 px-2 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold rounded-lg text-center transition-all block text-[10px] uppercase tracking-wider">
              Subir Foto de Mi Salón
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomWallUpload}
                className="hidden"
              />
            </label>
            {customWallBg && (
              <button
                onClick={() => setCustomWallBg(null)}
                className="text-[9px] text-red-400 hover:underline mt-1 text-center"
              >
                Volver a Fondos de Estudio
              </button>
            )}
          </div>
          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1. Seleccionar Espacio / Habitación:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {ROOM_ENVIRONMENTS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoom(r)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left truncate transition-all ${
                    selectedRoom.id === r.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              2. Tipo de Marco:
            </label>
            <select
              value={selectedFrame.id}
              onChange={(e) => {
                const found = FRAME_STYLES.find((f) => f.id === e.target.value);
                if (found) setSelectedFrame(found);
              }}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {FRAME_STYLES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              3. Tono de Pared Personalizado:
            </label>
            <div className="flex items-center gap-1.5">
              {WALL_TINTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTint(t)}
                  title={t.name}
                  className={`flex-1 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${
                    selectedTint.id === t.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
