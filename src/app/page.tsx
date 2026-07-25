'use client';

import React, { useState } from 'react';
import { MOCK_ARTISTAS, MOCK_OBRAS, MOCK_CONTACTOS_PLATAFORMA } from '@/lib/mockData';
import { Artista, Obra, ContactoPlataforma } from '@/types/database';
import { CatalogSection } from '@/components/CatalogSection';
import { ArtistSection } from '@/components/ArtistSection';
import { AdminPreviewPanel } from '@/components/AdminPreviewPanel';
import { Sparkles, ArrowRight, ShieldCheck, Palette, Award } from 'lucide-react';

export default function Home() {
  const [artistas, setArtistas] = useState<Artista[]>(MOCK_ARTISTAS);
  const [obras, setObras] = useState<Obra[]>(MOCK_OBRAS);
  const [platformContacts, setPlatformContacts] = useState<ContactoPlataforma[]>(
    MOCK_CONTACTOS_PLATAFORMA
  );

  // Handler para alternar contacto_directo de un artista
  const handleToggleContactoDirecto = (artistaId: string) => {
    setArtistas((prevArtistas) =>
      prevArtistas.map((art) => {
        if (art.id === artistaId) {
          const updatedState = !art.contacto_directo;
          return { ...art, contacto_directo: updatedState };
        }
        return art;
      })
    );

    // Actualizar también en el estado de obras relacionales
    setObras((prevObras) =>
      prevObras.map((obra) => {
        if (obra.artista_id === artistaId && obra.artista) {
          return {
            ...obra,
            artista: {
              ...obra.artista,
              contacto_directo: !obra.artista.contacto_directo,
            },
          };
        }
        return obra;
      })
    );
  };

  // Handler para añadir nuevo contacto de plataforma
  const handleAddPlatformContact = (nombre: string, contacto: string) => {
    const newContact: ContactoPlataforma = {
      id: `plat-${Date.now()}`,
      nombre_encargado: nombre,
      whatsapp_email: contacto,
      activo: true,
      fecha_creacion: new Date().toISOString(),
    };
    setPlatformContacts((prev) => [...prev, newContact]);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#0e1017] to-[#0a0b0e] border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plataforma Virtual de Arte Cubano</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Descubre la Grandeza del <span className="gold-gradient-text">Arte Cubano</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Catálogo oficial de piezas maestras y artistas contemporáneos de Cuba.
              Garantizamos contacto directo con artistas de confianza o negociación asistida
              transparente por el equipo de la plataforma.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#obras"
                className="px-6 py-3.5 rounded-xl gold-button flex items-center gap-2 text-sm font-semibold shadow-lg hover:scale-105 transition-all"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contacto-info"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-sm font-semibold transition-colors"
              >
                Modelo de Transparencia
              </a>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Catálogo Curado</h4>
              <p className="text-[11px] text-slate-400">Obras auténticas con fichas técnicas detalladas</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Artistas de Confianza</h4>
              <p className="text-[11px] text-slate-400">Trato directo sin intermediarios según habilitación</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Asistencia Oficial</h4>
              <p className="text-[11px] text-slate-400">Coordinación de envíos y consultas con la plataforma</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <CatalogSection
        obras={obras}
        artistas={artistas}
        platformContacts={platformContacts}
      />

      {/* Artist Showcase Section */}
      <ArtistSection artistas={artistas} />

      {/* Admin Panel Simulator */}
      <AdminPreviewPanel
        artistas={artistas}
        platformContacts={platformContacts}
        onToggleContactoDirecto={handleToggleContactoDirecto}
        onAddPlatformContact={handleAddPlatformContact}
      />
    </div>
  );
}
