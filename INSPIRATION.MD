## Plan de desarrollo del sitio web personal

### 1. Objetivos

- Consolidar todas tus facetas (música, arte visual, programación, trading, EMED) en un único hub accesible.
- Ofrecer una experiencia atractiva y profesional que refleje tu marca personal.
- Facilitar la actualización y escalabilidad a medida que crecen tus proyectos.

### 2. Público objetivo

- Fans y seguidores de tu música.
- Galerías, coleccionistas y entusiastas de tu arte visual.
- Empleadores y clientes potenciales para proyectos de programación.
- Comunidad y aprendices de trading.
- Colaboradores y contactos de EMED.

### 3. Funcionalidades clave

- **Página de inicio (Home):** presentación breve y enlaces a secciones principales.
- **Sobre mí:** biografía, habilidades y trayectoria profesional.
- **Portafolio Musical:** reproductores embebidos (Spotify, YouTube), playlists y descargas.
- **Galería de Arte:** carruseles de imágenes con lightbox y descripciones.
- **Proyectos de Programación:** demos en vivo, enlaces a repositorios GitHub, documentación.
- **Blog de Trading:** artículos en Markdown, categorización y etiquetas.
- **Sección EMED:** descripción de tu rol, proyectos destacados y enlaces internos o externos.
- **Contacto:** formulario integrado (email), links a redes sociales (@kroksart, LinkedIn, GitHub).
- **Footer global:** enlaces de redes, política de privacidad y derechos de autor.

### 4. Arquitectura de la información (Sitemap)

```
- Home
- Sobre mí
- Música
- Arte Visual
- Programación
- Blog de Trading
- EMED
- Contacto
```

### 5. Tecnologías recomendadas

- **Framework / SSG:** Next.js (React) con generación estática (SSG) o Hugo para máxima velocidad.
- **Estilos:** Tailwind CSS para rapidez y coherencia.
- **Contenido:** Markdown con front matter para blogs y galerías.
- **Control de versiones:** Git + GitHub (repositorio público/privado según convenga).
- **Automatización de builds:** GitHub Actions o hooks de cPanel.

### 6. Estructura de carpetas propuesta

```
/src
  /components       # Componentes reutilizables
  /pages            # Rutas: index.js, sobre.js, musica.js, arte.js, programacion.js, trading.js, emed.js, contacto.js
  /public/assets    # Imágenes, logos, audio
  /content          # Markdown de blog y galerías
/config
  tailwind.config.js
  next.config.js    # (si Next.js)
package.json
```

### 7. Despliegue en cPanel (bluehosting.cl)

1. **Build estático:** `npm run build && npm run export` (Next.js) o `hugo`.
2. **Subida:** copiar carpeta `out` o `public` al `public_html` vía FTP o File Manager.
3. **Configuración:** en cPanel, establecer ruta de inicio si usas Node.js (opcional para SSR).
4. **SSL:** activar Let's Encrypt desde "SSL/TLS Status".
5. **Automatización:** crear script de despliegue o usar Git Push to Deploy si está disponible.

### 8. Cronograma sugerido

| Semana | Tareas principales                                                     |
| ------ | ---------------------------------------------------------------------- |
| 1      | Diseño de prototipos en Figma y validación de sitemap                  |
| 2      | Inicialización del proyecto, configuración de Tailwind y rutas básicas |
| 3      | Desarrollo de Home, Sobre mí y Música                                  |
| 4      | Implementación de Galería de Arte y Proyectos de Programación          |
| 5      | Blog de Trading, sección EMED y formulario de contacto                 |
| 6      | Pruebas, optimización SEO, accesibilidad y despliegue final            |

### 9. Diseño Tipográfico Minimalista

**Paleta de color y acentos**

- Base monocromática: blanco (#ffffff), negro (#000000) y escala de grises para fondos y líneas.
- Acentos por sección: variable CSS `--accent-color`, que cambia al cargar cada ruta (por query param o slug), con un tono suave complementario.

**Jerarquía y escala tipográfica**

- Usar tipografía sans-serif moderna de alto contraste (por ejemplo, Inter o Neue Haas Grotesk) con ejes de peso (Light, Regular, Medium, Bold).
- Escala fluida con `clamp()`:
  - `h1 { font-size: clamp(2.5rem, 8vw, 6rem); }`
  - `h2 { font-size: clamp(2rem, 6vw, 4rem); }`
  - `p  { font-size: clamp(1rem, 2.5vw, 1.25rem); }`
- Letter-spacing y line-height generosos para aportar aire:
  - `letter-spacing: 0.02em; line-height: 1.4;`

**Espaciado y composición**

- Grid minimalista: unión de columnas CSS Grid (`grid-template-columns: 1fr min(60ch, 100%);`).
- Margin vertical amplio (`margin-block: 4rem;`) para separar secciones.

**Interacciones hover**

- Component `<Highlight word="texto" contentType="image" src="..." alt="..." />`:
  - Al hover muestra un `<div>` absoluto con transición `opacity .3s` y `transform: translateY(-10px)`.
  - Contenido dinámico: imagen o `<audio>` con `autoplay muted` hasta que el usuario interactúe.
- Implementar con React Hook (`useState`) y CSS modules o Tailwind:
  ```jsx
  <span className="relative group">
    {word}
    <div className="opacity-0 group-hover:opacity-100 transition ease-out absolute ...">
      {type === 'image' ? <img src={src}/> : <audio src={src} controls/>}
    </div>
  </span>
  ```

**Navegación por secciones y estado de color**

- Cada sección es una ruta estática Next.js `/seccion` con parámetro opcional de color.
- On click, `router.push({ pathname, query: { accent: '#ab34f2' } })` y en `Layout` leer `router.query.accent` para actualizar `--accent-color` del `<html>`.
- Para “refrescar” y mantener scroll, usar `router.replace()` y fragmento `#seccion`.

**Componentes clave**

- `Typography` (wrapper para aplicar variables CSS)
- `Highlight` (interactivo)
- `SectionLayout` (recibe props `title`, `accentColor`, `children`)

> Con este enfoque tipográfico, minimalista y de interacciones sutiles, tu web potenciará el foco en el contenido y tu marca personal.

### 10. Contexto del Proyecto KROKOWEB

KROKOWEB es tu portafolio web inmersivo que combina:

- **Landing Page Tipográfica:** presentación de cada área creativa (música, programación, arte digital) con títulos grandes y transiciones monocromáticas.
- **Galería WebGL Inmersiva:** tres experiencias 3D (tarjetas flotantes, texto 3D interactivo, mapa topográfico procedural) integradas como secciones, cada una con un color de acento.
- **Stack Moderno:** Next.js + TypeScript, TailwindCSS, React Three Fiber/Drei, Framer Motion y GLSL.

**Estado Actual:**

- Componentes WebGL funcionales y refinados.
- PWA responsiva con navegación limpia.
- Optimización de rendimiento en curso.

### 11. Fusión de Diseño Tipográfico y WebGL

1. **Overlay Tipográfico:** cada escena 3D tendrá un `<h1>` o `<h2>` con `position: absolute` y tipografías grandes usando la escala fluida descrita.
2. **Hover Semántico:** en los textos de la landing, palabras clave disparan efectos en la escena (e.g., destacar un modelo 3D o reproducir un clip de audio).
3. **Acentos de Color Dinámicos:** al cambiar de sección 3D, leer `--accent-color` y aplicar a texto y luces de la escena.
4. **Transición entre Rutas:** usar Framer Motion para fade-in/out del canvas WebGL y del contenido tipográfico.

### 12. Próximos Pasos para el Equipo de Desarrollo

-

Con este merge tendrás una hoja de ruta clara para avanzar el código.

### 13. Boceto de Landing: Prompt de Diseño

**Descripción del boceto:**

- Logo/título en la esquina superior izquierda: `kroko` (principal) y `XKLOKON` (sub).
- Lista vertical en el lado izquierdo: `ART`, `CODE`, `TRADE`, `CREATE`.
- Texto central grande: `me` sobre `work`.
- Barra social vertical en el lado derecho: `socials` (columna con letras individuales).
- Fondo blanco, tipografía negra, espacio generoso.

**Prompt sugerido para el equipo de diseño o generador de prototipos:**

```
Crea una landing page web minimalista y tipográfica siguiendo este boceto:
- Fondo completamente blanco y uso exclusivo de negro para la tipografía.
- En la esquina superior izquierda, coloca el logo/título con texto grande y limpio: “kroko” en mayúscula/minúscula y justo debajo, en tamaño más pequeño, “XKLOKON”.
- En el lado izquierdo, un menú vertical con las palabras ART, CODE, TRADE y CREATE, cada una en la misma tipografía sans-serif, espaciadas uniformemente.
- En el centro, dos líneas de texto grandes y centradas: “me” encima de “work”, con un interlineado amplio.
- En el lado derecho, una sección vertical para enlaces sociales, mostrando la palabra “socials” con cada letra en una fila, de arriba hacia abajo.
- Todos los textos usan una fuente sans-serif de alto contraste (ej. Inter), escala tipográfica fluida y letter-spacing generoso.
- Incluye efectos de hover minimalistas: al pasar el cursor sobre cada palabra del menú izquierdo, aparece suavemente una imagen o un fragmento de audio relacionado.
- Al hacer click en cada sección (ART, CODE, TRADE, CREATE, me work o socials), la página se recarga o navega a esa sección, cambiando sutilmente el color de acento (definido vía CSS variable) aplicado a los textos activos.
- El resultado debe ser un prototipo interactivo en HTML/CSS/JS o un mockup en Figma.
```

### 14. Integración de Arte ASCII

Para incorporar elementos de arte ASCII al estilo de fauux.neocities.org y mantener la estética tipográfica minimalista:

1. **Encabezados ASCII generados dinámicamente**

   - Usa una librería como [figlet.js](https://github.com/patorjk/figlet.js) para renderizar títulos o secciones clave en ASCII art.
   - Ejemplo: al cargar la sección “CODE”, ejecuta `figlet.text('CODE', { font: 'Standard' }, callback)` y muestra el resultado en un `<pre>` estilizado.

2. **Fondos o separadores en ASCII**

   - Inserta bloques `<pre class="ascii-bg">` con patrones simples (líneas punteadas, bloques geométricos) como separadores de secciones.
   - Aplica `opacity` baja y `position: absolute` para que queden sutiles, detrás de los textos principales.

3. **Hover y animaciones ASCII**

   - En el componente `Highlight`, añade un modo `contentType: 'ascii'` que introduzca animaciones en texto:
     ```jsx
     <span className="relative group ascii-hover">
       {word}
       <pre className="opacity-0 group-hover:opacity-100 ascii-content">
         {asciiArt}
       </pre>
     </span>
     ```
   - Genera `asciiArt` con plantillas predefinidas o desde un endpoint que sirva arte ASCII personalizado.

4. **Modo nocturno retro**

   - Añade un toggle para “modo terminal” donde todo el sitio use una fuente monoespaciada y fondo negro, mostrando encabezados ASCII en verde estilo terminal.
   - Cambia variables CSS en `:root[data-theme='terminal'] { --bg: #000; --text: #0f0; font-family: 'Courier New', monospace; }`

5. **Integración en WebGL**

   - Renderiza texturas ASCII sobre planos en Three.js usando un canvas 2D donde dibujes el texto en la textura.
   - Asigna estas texturas a materiales para dar un efecto “pantalla antigua” flotante en la escena.

Con estas ideas, sumarás un toque de nostalgia y originalidad que dialoga con la pureza tipográfica y las interacciones inmersivas de tu portafolio.

### 15. Modo Dual: Kroko vs XKLOKON

**Objetivo:** ofrecer dos experiencias de landing según tu alter ego:

- **Kroko (modo predeterminado):** fondo blanco, tipografía negra, minimalismo puro.
- **XKLOKON (modo negativo):** fondo negro, tipografía blanca, aparición de imágenes sutiles como fondo.

**Implementación técnica:**

1. **Toggle en el Layout:**

   - Gestionar estado `mode` en React Context (`'kroko' | 'xklokon'`), inicializado en `'kroko'`.
   - En el header, al hacer click en el logo/título secundario (`XKLOKON`), disparar `setMode('xklokon')` y `router.replace({ query: { mode: 'xklokon' } })`.
   - Para volver a Kroko, click en `kroko` o detectar `mode='kroko'` desde `router.query`.

2. **Variables CSS dinámicas:**

   ```css
   :root[data-mode='kroko'] {
     --bg: #ffffff;
     --text: #000000;
     --link: #000000;
   }
   :root[data-mode='xklokon'] {
     --bg: #000000;
     --text: #ffffff;
     --link: #ffffff;
     --bg-image-opacity: 0.1;
   }
   body {
     background-color: var(--bg);
     color: var(--text);
   }
   a { color: var(--link); }
   .bg-image { opacity: var(--bg-image-opacity); }
   ```

3. **Carga de imágenes de fondo en XKLOKON:**

   - En `Layout`, si `mode === 'xklokon'`, renderizar un contenedor `.bg-image` con imágenes posicionadas en `absolute` y `z-index:-1`.
   - Aplicar `transition: opacity .5s` para que aparezcan al entrar al modo.

4. **Hover y salida de modo:**

   - Opcionalmente, al hacer hover fuera del header, ocultar las imágenes de fondo tras `mouseleave`.
   - Mantener `mode` en la URL para persistencia hasta que el usuario cambie.

5. **Sección ART diferenciada:**

   - Dentro de `/arte`, subdividir contenido en dos pestañas o “cards”: **Kroko Art** y **XKLOKON Art**.
   - Al cambiar `mode`, precargar la pestaña correspondiente.
   - Añadir filtros de etiquetas: `data-mode="kroko"` o `data-mode="xklokon"` para mostrar/ocultar galerías.

> Con este modo dual, tu portafolio rendirá homenaje a ambos personajes: un espacio limpio y blanco para Kroko y una atmósfera invertida, más densa, para XKLOKON.

### 16. Colores por Pestaña y Hover en el Sidebar

**Objetivo:** asignar un color de acento único a cada sección y aplicar preview al pasar el cursor sobre los enlaces del sidebar.

1. **Variables CSS de acento**
   ```css
   :root {
     --accent-home: #ff6f61;
     --accent-art:  #6b5b95;
     --accent-code: #88b04b;
     --accent-trade: #f7cac9;
     --accent-create:#92a8d1;
     --accent-current: var(--accent-home);
     --accent-hover:   var(--accent-home);
   }
   [data-mode] {
     --accent-current: var(--accent-home);
   }
   [data-page='arte']   { --accent-current: var(--accent-art); }
   [data-page='programacion'] { --accent-current: var(--accent-code); }
   [data-page='trading']{ --accent-current: var(--accent-trade); }
   [data-page='create'] { --accent-current: var(--accent-create); }

   body {
     background-color: var(--bg);
     color: var(--text);
   }
   a, .sidebar-item {
     color: var(--accent-current);
   }
   ```

2. **Cambio de color al navegar**
   - En cada página, setear en el `<html>` o contenedor root atributo `data-page="arte"`, `data-page="programacion"`, etc.
   - Al cargar la ruta, Next.js en el `Layout` puede usar `router.pathname` para determinar el valor de `data-page`.

3. **Hover en el Sidebar**
```jsx
// Código existente...
```

4. **Transiciones suaves**
```css
* {
  transition: color .3s ease, background-color .3s ease;
}
```

> Con esta configuración, cada sección brilla con su propio tono y el sidebar ofrece un preview dinámico de los colores al pasar el cursor.

---

### 17. Sistema de Triple Color por Sección

**Objetivo:** para cada sección define tres variables: color fuerte (textos principales), color de fondo (background), color complementario (botones, cards, highlights).

1. **Definición de variables CSS**
```css
:root {
  --home-strong:  #ff6f61;
  --home-bg:      #fff1f0;
  --home-comp:    #d64541;

  --art-strong:   #6b5b95;
  --art-bg:       #ece7f2;
  --art-comp:     #4e3a71;

  --code-strong:  #88b04b;
  --code-bg:      #f0f4e6;
  --code-comp:    #6b8440;

  --trade-strong: #f7cac9;
  --trade-bg:     #fff2f2;
  --trade-comp:   #e69c9b;

  --create-strong:#92a8d1;
  --create-bg:    #ebf0fa;
  --create-comp:  #6f8fb0;
}

/* Variables dinámicas actuales según data-page o data-page-hover */
:root {
  --accent-strong: var(--home-strong);
  --accent-bg:     var(--home-bg);
  --accent-comp:   var(--home-comp);
}
[data-page='arte'], [data-page-hover='arte'] {
  --accent-strong: var(--art-strong);
  --accent-bg:     var(--art-bg);
  --accent-comp:   var(--art-comp);
}
/* Repetir para code, trading, create */
```

2. **Aplicación de variables**
```css
body {
  background-color: var(--accent-bg);
  color: var(--accent-strong);
}
a, .sidebar-item {
  color: var(--accent-strong);
}
button, .card {
  background-color: var(--accent-comp);
  color: var(--accent-bg);
}
.highlight {
  background-color: var(--accent-strong);
  color: var(--accent-bg);
}
```

3. **Configuración en el Layout**
- Al cambiar `data-page` o `data-page-hover`, el `:root` recogerá las variables correspondientes.
- Asegura que no existan conflictos de herencia: utiliza selectores globales o un wrapper `.app-root[data-page]`.

> Así tendrás un esquema completo de tres tonos para cada sección, lo que facilita estilizar textos, fondos y elementos destacados de forma coherente.




rEFERENCIAS.
https://fauux.neocities.org/