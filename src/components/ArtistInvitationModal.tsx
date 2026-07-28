'use client';

import React, { useState } from 'react';
import { Artista } from '@/types/database';
import { X, Mail, Copy, Check, Sparkles, Send, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/data';

interface ArtistInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  artista: Artista | null;
}

export function ArtistInvitationModal({ isOpen, onClose, artista }: ArtistInvitationModalProps) {
  const [copied, setCopied] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  if (!isOpen || !artista) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://galeriacubana.art';
  const token = artista.token_invitacion || `inv-${artista.id}-${Date.now().toString(36)}`;
  const emailContacto = artista.whatsapp_email_contacto || '';
  const invitationLink = `${origin}/?invitacion=${token}&email=${encodeURIComponent(emailContacto)}`;

  const subject = `Invitación Oficial: Gestiona tu Perfil de Artista en Galería Virtual de Arte Cubano`;
  const emailBody = `Hola ${artista.nombre},

Has sido invitado(a) por la Dirección de la Galería Virtual de Arte Cubano para formar parte del catálogo oficial de artistas destacados.

Para acceder a tu Portal de Autogestión, modificar tu biografía, subir tus fotografías de taller y auditar tu portafolio de obras, haz clic en el siguiente enlace de invitación único:

${invitationLink}

Si tienes alguna duda o necesitas asistencia técnica, el equipo de coordinación está a tu entera disposición.

Atentamente,
Dirección General & Coordinación Curatorial
Galería Virtual de Arte Cubano
contacto@galeriacubana.art`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendMailto = async () => {
    setSendingEmail(true);

    // Si Supabase está configurado, podemos disparar la invitación auth oficial en segundo plano
    if (isSupabaseConfigured() && emailContacto.includes('@')) {
      try {
        const supabase = createClient();
        await supabase.auth.admin.inviteUserByEmail(emailContacto, {
          redirectTo: invitationLink,
        });
      } catch (err) {
        console.warn('Nota: Envío auth Supabase omitido o en modo desarrollo:', err);
      }
    }

    // Abrir cliente de correo por defecto
    const mailtoUrl = `mailto:${encodeURIComponent(emailContacto)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');

    setSendingEmail(false);
    setEmailSentNotice(true);
    setTimeout(() => setEmailSentNotice(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#12141a] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl glass-card overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Invitación Creada Exitosamente</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Invitación para {artista.nombre}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Permite al artista acceder a su portal privado y modificar su perfil de creador
          </p>
        </div>

        {/* Notificación de envío */}
        {emailSentNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>¡Cliente de correo abierto!</strong> Se ha preparado el mensaje con el enlace oficial de invitación.
            </span>
          </div>
        )}

        {/* Tarjeta de Información del Artista Registrado */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-amber-500/30 overflow-hidden shrink-0">
              <img
                src={artista.foto_perfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'}
                alt={artista.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{artista.nombre}</h4>
              <span className="text-xs text-amber-400 block">{artista.provincia_ciudad || 'Cuba'}</span>
              <span className="text-[11px] text-slate-400 block">{emailContacto || 'Sin correo asignado'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Estado: <strong className="text-amber-300">Invitación Pendiente</strong></span>
            <span>Acceso: <strong>Portal Privado de Artista</strong></span>
          </div>
        </div>

        {/* Enlace Directo de Invitación */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-slate-300 block">Enlace Único de Acceso & Reclamo de Perfil:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={invitationLink}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-amber-200 focus:outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Copiar Enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Vista previa de carta de invitación */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs space-y-2 mb-6 max-h-36 overflow-y-auto custom-scrollbar">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
            Vista Previa de la Invitación:
          </span>
          <p className="text-slate-300 leading-relaxed italic whitespace-pre-line text-[11px]">
            {emailBody}
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleSendMailto}
            disabled={sendingEmail}
            className="py-3 px-4 rounded-xl gold-button text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Invitación por Correo</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center transition-colors"
          >
            Concluir y Volver al Panel
          </button>
        </div>
      </div>
    </div>
  );
}
