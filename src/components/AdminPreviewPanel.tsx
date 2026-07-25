'use client';

import React, { useState } from 'react';
import { Artista, ContactoPlataforma } from '@/types/database';
import { Shield, ToggleLeft, ToggleRight, UserCheck, Plus, CheckCircle } from 'lucide-react';

interface AdminPreviewPanelProps {
  artistas: Artista[];
  platformContacts: ContactoPlataforma[];
  onToggleContactoDirecto: (artistaId: string) => void;
  onAddPlatformContact: (nombre: string, contacto: string) => void;
}

export function AdminPreviewPanel({
  artistas,
  platformContacts,
  onToggleContactoDirecto,
  onAddPlatformContact,
}: AdminPreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoContacto, setNuevoContacto] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoNombre.trim() && nuevoContacto.trim()) {
      onAddPlatformContact(nuevoNombre, nuevoContacto);
      setNuevoNombre('');
      setNuevoContacto('');
    }
  };

  return (
    <div id="contacto-info" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#12141a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 glass-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Panel de Administración & Reglas de Contacto</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              Gestión de Permisos "Contacto Directo" & Plataforma
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Solo un administrador (Ramiro) puede autorizar a un artista como "De Confianza".
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shrink-0"
          >
            {isOpen ? 'Ocultar Simulador Admin' : 'Probar Panel de Admin'}
          </button>
        </div>

        {isOpen && (
          <div className="mt-6 space-y-8 animate-fadeIn">
            {/* Control 1: Toggling contacto_directo */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                (1) Activar / Desactivar `contacto_directo` por Artista:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artistas.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm font-medium text-white block">{art.nombre}</span>
                      <span className="text-xs text-slate-400">
                        {art.contacto_directo ? 'Muestra su propio WhatsApp/Email' : 'Muestra contacto Plataforma'}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleContactoDirecto(art.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {art.contacto_directo ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ToggleRight className="w-6 h-6" /> Directo
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <ToggleLeft className="w-6 h-6" /> Plataforma
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Control 2: Platform Contacts */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-3">
                (2) Responsables de Contacto por Defecto de la Plataforma (`contactos_plataforma`):
              </h4>
              <div className="space-y-2 mb-4">
                {platformContacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-white/5 text-xs flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-amber-300 block">{c.nombre_encargado}</strong>
                      <span className="text-slate-400">{c.whatsapp_email}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                      Activo
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Add Contact */}
              <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Nombre de encargado..."
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="WhatsApp o Email..."
                  value={nuevoContacto}
                  onChange={(e) => setNuevoContacto(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg gold-button text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Agregar Responsable
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
