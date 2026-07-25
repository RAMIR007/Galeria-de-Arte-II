import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Palette, ShieldCheck, Sparkles } from 'lucide-react';

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
