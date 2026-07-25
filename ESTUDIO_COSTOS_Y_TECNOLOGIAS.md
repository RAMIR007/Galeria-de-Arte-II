# 📊 Estudio de Costos, Tecnologías & Infraestructura
## Galería Virtual de Arte Cubano - Innovaciones de Vanguardia

Este documento analiza los costos de operación, licencias, infraestructuras y posibles plataformas/tecnologías para integrar las características de vanguardia (**Visualizador en Pared 2D/3D**, **Certificados Digitales con QR**, **Lupa Ultra-HD** y **Salas 3D**).

---

## 🛠️ 1. Desglose Tecnológico y Opciones de Implementación

### A. Visualizador "Ver en mi Pared" (View in Room / Mockup Proporcional)

| Alternativa Tecnológica | Descripción y Plataformas | Costo Mensual | Ventajas / Desventajas |
| :--- | :--- | :---: | :--- |
| **Opción 1: Desarrollo Propio a Medida (Recomendado)** | Motor en **HTML5 Canvas 2D + React** con cálculo proporcional de escala en tiempo real (relación cm/px), sombras dinámicas y fondos de interiores modernos (salón, estudio, oficina). | **$0 / mes** *(100% Gratuito)* | ✅ Sin costos recurrentes.<br>✅ Control total de diseño y branding.<br>✅ Carga ultrarrápida en móviles. |
| **Opción 2: ArtPlacer API / Widget** | Servicio externo especializado ([artplacer.com](https://www.artplacer.com)). Permite integración vía widget precompilado o AR móvil. | **$19 - $79 / mes** | ✅ Motor AR nativo listo.<br>❌ Dependencia de terceros.<br>❌ Suscripción mensual en dólares. |
| **Opción 3: WebXR / Three.js 3D** | Renderizado 3D inmersivo con Three.js donde el usuario navega en un espacio 3D interactivo. | **$0 / mes** *(Librería Open-Source)* | ✅ Muy vistoso.<br>❌ Requiere mayor procesamiento en móviles antiguos. |

> 💡 **Recomendación:** Implementar la **Opción 1 (Motor Canvas 2D + React a medida)**. Proporciona una experiencia fluida, profesional y cero costos de suscripción mensual.

---

### B. Certificados Digitales de Autenticidad & Verificación QR

| Tecnología | Herramientas / Librerías | Costo Mensual | Descripción |
| :--- | :--- | :---: | :--- |
| **Generador PDF & QR Nativo** | `jspdf` + `qrcode` + `html2canvas` | **$0 / mes** *(100% Gratuito)* | Generación instantánea en el navegador de un documento elegante en PDF con firma del artista, sello dorado de la galería y código QR escaneable desde teléfonos inteligentes. |
| **Blockchain NFT / Verificación (Opcional Futuro)** | Polygon / Ethereum / Thirdweb | **$0 - $0.05 / cert.** | Permite registrar la autenticidad en la blockchain. No es imprescindible para la fase actual. |

> 💡 **Recomendación:** **Generador PDF & QR Nativo**. Es 100% gratuito, instantáneo para el comprador e imprime o descarga un documento con estética de lujo.

---

### C. Lupa de Inspección de Textura & Ultra-Zoom HD (Gigapixel)

| Tecnología | Herramientas / Librerías | Costo Mensual | Descripción |
| :--- | :--- | :---: | :--- |
| **Visor Zoom Interactivo** | `OpenSeadragon` / `React-Image-Magnify` | **$0 / mes** *(Open-Source)* | Permite ampliar zonas de la obra para examinar la firma del artista y pinceladas del lienzo en alta resolución sin degradar la página. |

---

### D. Servidor, Base de Datos & Almacenamiento de Imágenes

| Servicio | Proveedor | Plan Gratuito (Hobby) | Plan Pro (Producción Comercial) |
| :--- | :--- | :--- | :--- |
| **Hosting Web & CDN** | **Vercel** | **$0 / mes** (Hasta 100GB ancho de banda/mes, SSL gratis, despliegues ilimitados) | **$20 / usuario / mes** (Para alto tráfico masivo internacional). |
| **Base de Datos & Auth** | **Supabase Cloud** | **$0 / mes** (Hasta 50,000 usuarios activos, 500MB DB Postgres, 1GB Storage) | **$25 / mes** (Almacenamiento ilimitado, backups diarios automáticos). |
| **Dominio Personalizado** | Namecheap / GoDaddy / Porkbun | N/A | **$10 - $15 / año** (Ejemplo: `galeriacubana.art` o `.com`). |

---

## 💰 2. Cuadro Comparativo de Presupuesto Mensual Estimado

### Escenario A: Estrategia "Zero-Cost" (Recomendado para Inicio)
Utilizando desarrollo a medida Open-Source, Vercel Free y Supabase Free Tier.

- **Visualizador en Pared (Canvas 2D):** $0
- **Certificados PDF + QR:** $0
- **Zoom Ultra-HD:** $0
- **Vercel Hosting:** $0
- **Supabase Cloud:** $0
- **Dominio `.art` / `.com`:** ~$1.20 / mes ($14/año)
- --------------------------------------------------
- 💳 **COSTO TOTAL ESTIMAO:** **~$1.20 USD / mes**

---

### Escenario B: Estrategia Corporativa / Alto Tráfico
Para cuando la galería maneje miles de visitas diarias y transacciones internacionales masivas.

- **Visualizador ArtPlacer API:** $29 / mes
- **Vercel Pro:** $20 / mes
- **Supabase Pro (Backups + 8GB DB):** $25 / mes
- **Dominio `.art`:** ~$1.20 / mes
- --------------------------------------------------
- 💳 **COSTO TOTAL ESTIMADO:** **~$75.20 USD / mes**

---

## 📋 3. Resumen y Conclusión Estratégica

1. **Inversión Mínima, Máximo Impacto:** Con nuestro plan de arquitectura nativa en Next.js, puedes integrar **todas las funcionalidades de vanguardia sin pagar suscripciones de terceros**, manteniendo un costo operativo de **~$0 a $1.20 USD al mes**.
2. **Escalabilidad:** Si el tráfico de compradores crece exponencialmente en el futuro, la migración a planes Pro de Vercel/Supabase es transparente y sin rehacer código.

---

*Estudio preparado para Ramiro - Director General, Galería Virtual de Arte Cubano.*
