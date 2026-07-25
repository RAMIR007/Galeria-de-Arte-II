import { createClient } from './client';
import { isSupabaseConfigured } from './data';

export async function uploadImageToBucket(
  file: File,
  bucket: 'obras-imagenes' | 'artistas-imagenes'
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.info('Supabase no configurado con credenciales reales. Omitiendo subida a Cloud Storage.');
    return null;
  }

  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error(`Error al subir imagen al bucket ${bucket}:`, error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Excepción al subir imagen a Supabase Storage:', err);
    return null;
  }
}
