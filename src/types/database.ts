export type RolUsuario = 'superadmin' | 'gestor' | 'artista';

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  email_whatsapp: string;
  rol: RolUsuario;
  activo: boolean;
  fecha_creacion: string;
}

export interface DocumentoPDF {
  titulo: string;
  url: string;
}

export type Divisa = 'USD' | 'EUR';

export interface Artista {
  id: string;
  user_id?: string | null;
  nombre: string;
  bio?: string | null;
  notas_taller?: string | null; // Storytelling & Notas de estudio
  provincia_ciudad?: string | null;
  foto_perfil?: string | null;
  redes_sociales?: Record<string, string> | null;
  whatsapp_email_contacto?: string | null;
  contacto_directo: boolean;
  video_presentacion?: string | null;
  fotos_galeria?: string[] | null;
  documentos_pdf?: DocumentoPDF[] | null;
  contrato_firmado?: boolean;
  rol?: RolUsuario;
  invitacion_enviada?: boolean;
  fecha_invitacion?: string;
  token_invitacion?: string;
  estado_invitacion?: 'pendiente' | 'aceptado';
  fecha_registro: string;
}

export interface Obra {
  id: string;
  artista_id: string;
  titulo: string;
  descripcion?: string | null;
  analisis_curatorial?: string | null; // Ficha de análisis curatorial firmada por la galería
  opciones_envio?: string | null; // Especificación logística de envío
  historial_exposiciones?: string[] | null; // Procedencia & Exhibiciones anteriores
  tecnica?: string | null;
  medidas?: string | null;
  año?: number | null;
  precio_referencia?: number | null;
  comision_porcentaje?: number; // Por defecto 20%
  es_exclusiva?: boolean; // Por defecto true (Consignación exclusiva)
  disponible: boolean;
  imagenes: string[];
  fecha_creacion: string;
  // Campos opcionales para JOINs
  artista?: Artista;
}

export interface ContactoPlataforma {
  id: string;
  nombre_encargado: string;
  whatsapp_email: string;
  foto_perfil?: string;
  activo: boolean;
  fecha_creacion: string;
  rol?: RolUsuario;
}

export interface FiltrosCatalogo {
  tecnica?: string;
  artista_id?: string;
  busqueda?: string;
  disponibleOnly?: boolean;
}

