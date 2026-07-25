import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-[#0a0b0e] text-slate-100 flex flex-col min-h-screen antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {/* Responsive Navigation Header */}
        <header className="sticky top-0 z-40 bg-[#0a0b0e]/90 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-serif tracking-wider font-bold gold-gradient-text leading-tight">
                  GALERÍA CUBANA
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.18em] text-slate-400 uppercase font-medium hidden xs:block">
                  Arte Virtual & Curaduría
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link
                href="#obras"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="#artistas"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
              >
                Artistas
              </Link>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <Link
                href="#contacto-info"
                className="text-[11px] sm:text-xs uppercase tracking-wider px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Contacto Directo</span>
                <span className="sm:hidden">Contacto</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>

        {/* Footer */}
        <footer className="bg-[#060709] border-t border-white/10 py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-semibold text-amber-300 mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  Galería Virtual de Arte Cubano
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Espacio curado para la difusión de artistas cubanos y sus obras originales.
                  Conexión directa y transparente entre coleccionistas y creadores.
                </p>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
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

              <div id="contacto-info">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
                  Contacto Oficial
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Coordinación de ventas y exposiciones:
                  <br />
                  <span className="text-amber-300 font-medium text-sm">+53 5000 0000</span>
                  <br />
                  <span className="text-slate-300">contacto@galeriacubana.art</span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-center text-[11px] sm:text-xs text-slate-500">
              © {new Date().getFullYear()} Galería Virtual de Arte Cubano. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
