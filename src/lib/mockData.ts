import { Artista, Obra, ContactoPlataforma } from '@/types/database';

export const MOCK_CONTACTOS_PLATAFORMA: ContactoPlataforma[] = [
  {
    id: 'plat-1',
    nombre_encargado: 'Ramiro - Dirección Galería',
    whatsapp_email: '+53 5200 1122 | contacto@galeriacubana.art',
    activo: true,
    fecha_creacion: '2026-07-24T10:00:00Z',
  },
  {
    id: 'plat-2',
    nombre_encargado: 'Atención al Coleccionista',
    whatsapp_email: 'ventas@galeriacubana.art',
    activo: true,
    fecha_creacion: '2026-07-24T10:00:00Z',
  },
];

export const MOCK_ARTISTAS: Artista[] = [
  {
    id: 'art-1',
    nombre: 'Zaida del Río',
    bio: 'Pintora, dibujante y grabadora cubana nacida en Villa Clara. Su obra explora la espiritualidad, el folclore, el cuerpo humano y la mitología tropical.',
    provincia_ciudad: 'La Habana / Villa Clara',
    foto_perfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
    whatsapp_email_contacto: '+53 5288 9900 | zaida@artecubanostudio.com',
    contacto_directo: true, // Artista de confianza (contacto directo activo)
    fecha_registro: '2026-07-20T12:00:00Z',
  },
  {
    id: 'art-2',
    nombre: 'Tomás Sánchez',
    bio: 'Maestro de la pintura de paisaje cubano contemporáneo. Sus lienzos hiperrealistas y espacios de meditación son aclamados internacionalmente.',
    provincia_ciudad: 'Cienfuegos / La Habana',
    foto_perfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
    whatsapp_email_contacto: '+53 5299 4433 | tsanchez@estudioarte.cu',
    contacto_directo: true, // Artista de confianza
    fecha_registro: '2026-07-21T14:00:00Z',
  },
  {
    id: 'art-3',
    nombre: 'Wifredo Lam',
    bio: 'Obra inspirada en la herencia afrocubana y el vanguardismo del siglo XX. Figura cumbre del arte abstracto y surrealista del Caribe.',
    provincia_ciudad: 'Sagua la Grande, Villa Clara',
    foto_perfil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop',
    whatsapp_email_contacto: 'contacto@galeriacubana.art',
    contacto_directo: false, // Contacto a través de la plataforma por defecto
    fecha_registro: '2026-07-22T09:00:00Z',
  },
  {
    id: 'art-4',
    nombre: 'Amelia Peláez',
    bio: 'Pionera del arte moderno en Cuba. Famosa por la integración de motivos arquitectónicos coloniales, medio-puntos y vitrofusión.',
    provincia_ciudad: 'La Habana',
    foto_perfil: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop',
    whatsapp_email_contacto: 'info@galeriacubana.art',
    contacto_directo: false, // Contacto plataforma
    fecha_registro: '2026-07-23T11:00:00Z',
  },
];

export const MOCK_OBRAS: Obra[] = [
  {
    id: 'obra-1',
    artista_id: 'art-1',
    titulo: 'Danza Nocturna y la Luna de Agua',
    descripcion: 'Pintura expresiva de gran formato en tonos azur y dorado. Obra emblemática de la serie de metamorfosis figurativa.',
    tecnica: 'Acrílico y tinta sobre lienzo',
    medidas: '140 x 180 cm',
    año: 2024,
    precio_referencia: 4500,
    disponible: true,
    imagenes: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    ],
    fecha_creacion: '2026-07-24T11:00:00Z',
    artista: MOCK_ARTISTAS[0],
  },
  {
    id: 'obra-2',
    artista_id: 'art-2',
    titulo: 'Meditación en la Laguna Azul',
    descripcion: 'Paisaje monumental que transmite silencio, escala épica y serenidad espiritual en la naturaleza exuberante.',
    tecnica: 'Óleo sobre lienzo',
    medidas: '160 x 220 cm',
    año: 2023,
    precio_referencia: 8500,
    disponible: true,
    imagenes: [
      'https://images.unsplash.com/photo-1582561624796-7a71f008cb4d?q=80&w=1200&auto=format&fit=crop',
    ],
    fecha_creacion: '2026-07-24T11:05:00Z',
    artista: MOCK_ARTISTAS[1],
  },
  {
    id: 'obra-3',
    artista_id: 'art-3',
    titulo: 'Ritmos Tropicales V',
    descripcion: 'Composición icónica donde conviven formas totémicas, vegetación autóctona y misticismo figurativo.',
    tecnica: 'Óleo y carboncillo sobre tela',
    medidas: '120 x 100 cm',
    año: 2022,
    precio_referencia: 12000,
    disponible: true,
    imagenes: [
      'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=1200&auto=format&fit=crop',
    ],
    fecha_creacion: '2026-07-24T11:10:00Z',
    artista: MOCK_ARTISTAS[2],
  },
  {
    id: 'obra-4',
    artista_id: 'art-4',
    titulo: 'Vitral Colonial y Frutas',
    descripcion: 'Juego de geometrías, líneas gruesas en negro y matices vivos inspirados en los vitreaux habaneros.',
    tecnica: 'Óleo sobre lienzo',
    medidas: '110 x 90 cm',
    año: 2024,
    precio_referencia: 3800,
    disponible: true,
    imagenes: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop',
    ],
    fecha_creacion: '2026-07-24T11:15:00Z',
    artista: MOCK_ARTISTAS[3],
  },
];
