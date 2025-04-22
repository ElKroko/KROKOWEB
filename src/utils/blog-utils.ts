// File: blog-utils.ts
import { BlogPost } from '@/types/blog';

// Datos de ejemplo para el blog (en una aplicación real, esto vendría de una API o CMS)
const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'introduccion-react-hooks',
    title: 'Introducción a React Hooks',
    date: '2025-04-15',
    excerpt: 'Los React Hooks revolucionaron el desarrollo de componentes en React. Aprende cómo utilizarlos eficientemente.',
    content: `
      # Introducción a React Hooks

      Los React Hooks fueron introducidos en la versión 16.8 y cambiaron completamente la forma en que escribimos componentes en React.

      ## ¿Qué son los Hooks?

      Los Hooks son funciones que permiten "engancharse" al estado y ciclo de vida de React desde componentes funcionales.

      ### useState

      \`\`\`jsx
      function Counter() {
        const [count, setCount] = useState(0);
        
        return (
          <div>
            <p>Has hecho clic {count} veces</p>
            <button onClick={() => setCount(count + 1)}>
              Haz clic
            </button>
          </div>
        );
      }
      \`\`\`

      ### useEffect

      \`\`\`jsx
      function Example() {
        const [count, setCount] = useState(0);
        
        useEffect(() => {
          document.title = \`Has hecho clic \${count} veces\`;
        });
        
        return (
          <div>
            <p>Has hecho clic {count} veces</p>
            <button onClick={() => setCount(count + 1)}>
              Haz clic
            </button>
          </div>
        );
      }
      \`\`\`
      
      Los Hooks permiten reutilizar lógica de estado sin cambiar la jerarquía de componentes.
    `,
    coverImage: '/placeholders/blog-react.jpg',
    author: {
      name: 'KROKO',
      image: '/placeholders/author.jpg',
    },
    tags: ['React', 'JavaScript', 'Frontend']
  },
  {
    slug: 'diseno-interfaces-modernas',
    title: 'Diseño de Interfaces Modernas',
    date: '2025-04-10',
    excerpt: 'Principios y técnicas para crear interfaces de usuario modernas, minimalistas y funcionales.',
    content: `
      # Diseño de Interfaces Modernas

      El diseño de interfaces ha evolucionado significativamente en los últimos años. Las tendencias actuales favorecen interfaces limpias, espaciadas y funcionales.

      ## Principios de Diseño

      - **Simplicidad**: Menos es más. Elimina elementos innecesarios.
      - **Jerarquía**: Establece una jerarquía visual clara.
      - **Consistencia**: Mantén patrones consistentes en toda la interfaz.
      - **Feedback**: Proporciona retroalimentación clara sobre las acciones del usuario.

      ## Tendencias Actuales

      ### Modo Oscuro

      El modo oscuro no es solo una tendencia estética, sino que también puede reducir la fatiga visual y ahorrar batería en dispositivos con pantallas OLED.

      ### Diseño Neumórfico

      El neumorfismo combina elementos del skeuomorfismo y el diseño plano para crear interfaces que parecen extruidas del fondo.

      ### Glassmorphism

      El glassmorphism utiliza efectos de transparencia y desenfoque para crear la sensación de vidrio esmerilado.
      
      El buen diseño no solo se ve bien, sino que también mejora la experiencia del usuario y la usabilidad del producto.
    `,
    coverImage: '/placeholders/blog-ui.jpg',
    author: {
      name: 'KROKO',
      image: '/placeholders/author.jpg',
    },
    tags: ['Diseño UI', 'UX', 'Tendencias']
  },
  {
    slug: 'inteligencia-artificial-arte',
    title: 'IA en la Creación Artística',
    date: '2025-04-05',
    excerpt: 'Cómo la inteligencia artificial está transformando el proceso creativo y abriendo nuevas posibilidades en el arte digital.',
    content: `
      # IA en la Creación Artística

      La inteligencia artificial está redefiniendo lo que es posible en el arte digital, desdibujando la línea entre la creación humana y la asistida por máquinas.

      ## Herramientas de IA para Artistas

      - **Generación de Imágenes**: Midjourney, DALL-E, Stable Diffusion
      - **Edición de Imágenes**: Adobe Firefly, Runway ML
      - **Generación de Música**: AIVA, Amper Music
      - **Animación**: Runway Gen-2, D-ID

      ## El Debate Ético

      La llegada de estas herramientas ha generado un intenso debate sobre la autoría, originalidad y el valor del arte generado por IA.

      ### Colaboración vs. Reemplazo

      La IA no reemplaza al artista, sino que ofrece nuevas herramientas para expandir su creatividad. La combinación de la visión humana con las capacidades de la IA puede resultar en obras que no serían posibles de otra manera.

      ## Casos de Estudio

      ### Refik Anadol

      Sus instalaciones de arte utilizan algoritmos de aprendizaje automático para transformar grandes conjuntos de datos en experiencias inmersivas.

      ### Sougwen Chung

      Su proyecto D.O.U.G. explora la colaboración entre humanos y robots en el proceso de pintura.
      
      La IA está abriendo nuevas fronteras en el arte, permitiendo a los artistas explorar territorios creativos previamente inaccesibles.
    `,
    coverImage: '/placeholders/blog-ai.jpg',
    author: {
      name: 'KROKO',
      image: '/placeholders/author.jpg',
    },
    tags: ['Inteligencia Artificial', 'Arte Digital', 'Creatividad']
  }
];

/**
 * Obtiene todos los posts del blog
 */
export function getAllPosts(): BlogPost[] {
  // Ordenar por fecha, del más reciente al más antiguo
  return [...BLOG_POSTS].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Obtiene un post específico por su slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

/**
 * Obtiene los posts destacados
 */
export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(post => post.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Obtiene posts por etiqueta
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return BLOG_POSTS.filter(post => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}