import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Palette, ShieldCheck, Phone, Sparkles } from 'lucide-react';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Galería Virtual de Arte Cubano | Catálogo Oficial',
  description:
    'Catálogo público de obras maestras y artistas contemporáneos de Cuba. Descubre pinturas, esculturas y obras originales con contacto transparente.',
  keywords: ['Arte Cubano', 'Galería de Arte', 'Artistas Cubanos', 'Pintura Cubana', 'Venta de Arte'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-[#0a0b0e] text-slate-100 flex flex-col min-h-screen antialiased">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#0a0b0e]/85 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="text-xl font-serif tracking-wider font-bold gold-gradient-text block">
                  GALERÍA CUBANA
                </span>
                <span className="text-[10px] tracking-[0.2em] text-slate-400 uppercase font-medium">
                  Arte Virtual & Curaduría
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="#obras"
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
              >
                Catálogo de Obras
              </Link>
              <Link
                href="#artistas"
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
              >
                Artistas
              </Link>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <Link
                href="#contacto-info"
                className="text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Contacto Directo</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-[#060709] border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-serif font-semibold text-amber-300 mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  Galería Virtual de Arte Cubano
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Espacio curado para la difusión de artistas cubanos y sus obras originales.
                  Conexión directa y transparente entre coleccionistas y creadores.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                  Transparencia & Confianza
                </h4>
                <div className="space-y-2 text-xs text-slate-400">
                  <p className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Contacto Directo:</strong> Comunicación directa vía WhatsApp o Email habilitado.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Catálogo General:</strong> Gestión facilitada por el equipo de la plataforma.
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                  Contacto Oficial
                </h4>
                <p className="text-xs text-slate-400">
                  Coordinación de ventas y exposiciones:
                  <br />
                  <span className="text-amber-300 font-medium">+53 5200 1122</span>
                  <br />
                  <span className="text-slate-300">contacto@galeriacubana.art</span>
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Galería Virtual de Arte Cubano. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
