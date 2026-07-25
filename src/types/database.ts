export type RolUsuario = 'superadmin' | 'gestor' | 'artista';

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  email_whatsapp: string;
  rol: RolUsuario;
  activo: boolean;
  fecha_creacion: string;
}

export interface Artista {
  id: string;
  user_id?: string | null;
  nombre: string;
  bio?: string | null;
  provincia_ciudad?: string | null;
  foto_perfil?: string | null;
  redes_sociales?: Record<string, string> | null;
  whatsapp_email_contacto?: string | null;
  contacto_directo: boolean;
  rol?: RolUsuario;
  fecha_registro: string;
}

export interface Obra {
  id: string;
  artista_id: string;
  titulo: string;
  descripcion?: string | null;
  tecnica?: string | null;
  medidas?: string | null;
  año?: number | null;
  precio_referencia?: number | null;
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

