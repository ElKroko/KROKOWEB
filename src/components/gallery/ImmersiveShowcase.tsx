"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Text, 
  PerspectiveCamera,
  Html,
  MeshDistortMaterial,
  OrbitControls
} from '@react-three/drei';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import * as THREE from 'three';
import { colors } from '@/styles/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiArrowRight, FiX, FiInfo, FiCode, FiMap } from 'react-icons/fi';
import { useAccentColor } from '@/providers/AccentColorProvider';
import Typography from '../ui/Typography';

// Nuevos tipos de exhibición
const SHOWCASE_TYPES = {
  GALLERY: 'gallery',
  FLOATING_TEXT: 'floating_text',
  TOPOGRAPHIC: 'topographic'
};

// Shader personalizado para el fondo mejorado
const BackgroundShader = {
  uniforms: {
    time: { value: 0 },
    color1: { value: new THREE.Color(colors.primary.dark) },
    color2: { value: new THREE.Color(colors.secondary) },
    color3: { value: new THREE.Color(colors.accent.DEFAULT) },
    resolution: { value: new THREE.Vector2() },
    mousePosition: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec2 resolution;
    uniform vec2 mousePosition;
    varying vec2 vUv;
    
    // Función de ruido mejorada (Perlin-like)
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
    
    float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);
      
      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);
      
      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);
      
      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));
      
      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
      
      return o4.y * d.y + o4.x * (1.0 - d.y);
    }
    
    void main() {
      // Coordenadas normalizadas y centradas
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      
      // Distancia desde el mouse para efecto de interacción
      vec2 mouseOffset = vUv - mousePosition;
      float mouseDistance = length(mouseOffset) * 2.0;
      
      // Cálculo de ruido con múltiples octavas
      float n1 = noise(vec3(uv * 3.0, time * 0.1));
      float n2 = noise(vec3(uv * 6.0, time * 0.2 + 10.0));
      float n3 = noise(vec3(uv * 12.0, time * 0.3 + 20.0));
      
      // Combinar ruido para efecto de flujo
      float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      // Distancia radial con perturbación
      float d = length(uv * 0.8 + mouseOffset * 0.2) + finalNoise * 0.3;
      
      // Mezcla de tres colores para más riqueza visual
      vec3 finalColor;
      if (d < 0.5) {
        finalColor = mix(color1, color2, smoothstep(0.2, 0.5, d + finalNoise * 0.2));
      } else {
        finalColor = mix(color2, color3, smoothstep(0.5, 0.9, d + finalNoise * 0.2));
      }
      
      // Efecto de resplandor en el centro
      float glow = smoothstep(mouseDistance + 0.2, mouseDistance, 0.4) * 0.6;
      finalColor += color3 * glow;
      
      // Viñeta mejorada
      float vignette = smoothstep(1.3, 0.5, length(uv * 0.7));
      finalColor *= mix(0.7, 1.0, vignette);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

// Interfaz para la definición de proyectos
export interface Project {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  category: string;
  technologies?: string[];
  url?: string;
}

interface FloatingSphereProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  size?: number;
}

// Efecto de esfera flotante para decoración
function FloatingSphere({ position, color, speed = 1, size = 1 }: FloatingSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.5;
      meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.3;
      meshRef.current.position.z = position[2] + Math.cos(t * 0.7) * 0.2;
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.z = t * 0.3;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

interface FloatingWordProps {
  text: string;
  position: [number, number, number];
  speed: number;
  rotationAxis: [number, number, number];
}

// Componente para cada palabra flotante
function FloatingWord({ text, position, speed, rotationAxis }: FloatingWordProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const randomColor = useMemo(() => {
    const colorOptions = [
      colors.primary.light,
      colors.primary.mid,
      colors.accent.DEFAULT,
      colors.secondary,
      "#ffffff"
    ];
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  }, []);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      
      // Aplicar rotación lenta
      ref.current.rotation.x = rotationAxis[0] * t * speed;
      ref.current.rotation.y = rotationAxis[1] * t * speed;
      ref.current.rotation.z = rotationAxis[2] * t * speed;
      
      // Pequeña animación cuando está en hover
      if (hovered) {
        ref.current.scale.setScalar(1.2 + Math.sin(t * 5) * 0.1);
      } else {
        ref.current.scale.setScalar(1);
      }
    }
  });
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={1.5}
      position={position}
    >
      <Text
        ref={ref}
        color={hovered ? colors.accent.DEFAULT : randomColor}
        fontSize={0.5}
        maxWidth={2}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {text}
      </Text>
    </Float>
  );
}

// Componente de exhibición de texto flotante 3D
function FloatingTextExhibit() {
  const words = [
    'Three.js', 'WebGL', 'GLSL', 'React', 'Desarrollo', 'Creativo', 
    'Diseño', 'Arte', 'Visual', 'Experiencia', 'Inmersiva', 'Interactivo',
    'Animación', 'UI/UX', 'Tecnología', 'Futurista', 'Innovación', 'Digital',
    'Efectos', 'KROKO', '3D', 'Programación', 'Creatividad', 'Web'
  ];
  
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={colors.primary.light} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={colors.accent.DEFAULT} />
      
      {words.map((word, i) => {
        // Posicionar palabras en una esfera virtual
        const phi = Math.acos(-1 + (2 * i) / words.length);
        const theta = Math.sqrt(words.length * Math.PI) * phi;
        const radius = 8 + Math.random() * 2;
        
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        return (
          <FloatingWord 
            key={i} 
            text={word} 
            position={[x, y, z]} 
            speed={0.2 + Math.random() * 0.3}
            rotationAxis={[
              Math.random() - 0.5, 
              Math.random() - 0.5, 
              Math.random() - 0.5
            ]}
          />
        );
      })}
      
      <CameraController enableZoom={false} autoRotate={true} autoRotateSpeed={0.5} />
    </>
  );
}

interface TerrainMeshProps {
  seed: number;
}

// Mesh de terreno para el mapa topográfico
function TerrainMesh({ seed }: TerrainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Opciones de personalización del terreno
  const width = 10;
  const height = 10;
  const segments = 64;
  const heightMultiplier = 1.5;
  
  // Generar geometría del terreno con ruido
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    const noise = createNoise(seed);
    
    const vertices = geo.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      
      // Usar ruido Perlin para generar altura
      vertices[i + 1] = noise(x * 0.2, z * 0.2) * heightMultiplier;
    }
    
    // Necesario para calcular normales correctamente
    geo.computeVertexNormals();
    return geo;
  }, [seed, width, height, segments, heightMultiplier]);
  
  // Función simplificada de ruido Perlin para la altura
  function createNoise(seed: number) {
    return function(x: number, z: number): number {
      const X = Math.floor(x) & 255;
      const Z = Math.floor(z) & 255;
      
      x -= Math.floor(x);
      z -= Math.floor(z);
      
      // En una implementación completa de Perlin estos valores se utilizarían
      // para la interpolación, pero en nuestra implementación simplificada
      // los mantenemos comentados para evitar errores de linter
      // const u = fade(x);
      // const v = fade(z);
      
      // Valor de ruido basado en coordenadas y seed
      const n1 = Math.sin(X * 0.1 + seed) * Math.cos(Z * 0.1 + seed) * 0.5;
      const n2 = Math.sin(X * 0.05 + seed * 2) * Math.cos(Z * 0.05 + seed * 2) * 0.25;
      const n3 = Math.sin(X * 0.02 + seed * 4) * Math.cos(Z * 0.02 + seed * 4) * 0.125;
      
      return (n1 + n2 + n3) / 0.875; // Normalizar a rango -1 a 1 aproximadamente
    };
    
    function fade(t: number): number {
      return t * t * t * (t * (t * 6 - 15) + 10); // Función de suavizado
    }
  }
  
  // Calcular los colores del terreno basados en altura
  const colorArray = useMemo(() => {
    const colorValues = [];
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const height = positions[i + 1];
      
      // Mapear altura a colores
      const color = new THREE.Color();
      if (height < -0.5) {
        color.set(colors.primary.dark); // Agua profunda
      } else if (height < 0) {
        color.set(colors.primary.mid); // Agua poco profunda
      } else if (height < 0.3) {
        color.set(colors.secondary); // Tierras bajas
      } else if (height < 0.7) {
        color.set('#006633'); // Bosques
      } else if (height < 1.0) {
        color.set('#A0522D'); // Montañas bajas
      } else {
        // Mezcla para picos nevados
        const mix = Math.min((height - 1.0) * 2, 1);
        color.set('#A0522D').lerp(new THREE.Color('#FFFFFF'), mix);
      }
      
      colorValues.push(color.r, color.g, color.b);
    }
    
    return new Float32Array(colorValues);
  }, [geometry]);
  
  // Añadir colores a la geometría
  useEffect(() => {
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  }, [geometry, colorArray]);
  
  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial 
        vertexColors={true}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

interface LocationMarkerProps {
  position: [number, number, number];
  label: string;
}

// Marcador de ubicación para el mapa
function LocationMarker({ position, label }: LocationMarkerProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={[position[0], position[1] + 0.5, position[2]]}>
      {/* Pin */}
      <mesh 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={hovered ? colors.accent.DEFAULT : colors.primary.light} />
      </mesh>
      
      {/* Línea desde el terreno hasta el pin */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color={colors.primary.light} />
      </mesh>
      
      {/* Etiqueta de texto */}
      {hovered && (
        <Html center position={[0, 0.3, 0]}>
          <div className="bg-primary-dark/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

interface RegionIndicatorProps {
  position: [number, number, number];
  color: string;
  radius: number;
  label: string;
}

// Indicador de región para el mapa
function RegionIndicator({ position, color, radius, label }: RegionIndicatorProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ringGeometry args={[radius - 0.1, radius, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {hovered && (
        <Html center position={[0, 0.5, 0]}>
          <div className="bg-primary-dark/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Componente de mapa topográfico
function TopographicMapExhibit() {
  const groupRef = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, 10, -5]} intensity={0.4} color={colors.accent.DEFAULT} />
      
      <group ref={groupRef} position={[0, -2, 0]} rotation={[-Math.PI / 5, 0, 0]}>
        <TerrainMesh seed={seed} />
        
        {/* Marcadores en puntos de interés */}
        <LocationMarker position={[3, 2, 2]} label="Punto A" />
        <LocationMarker position={[-2, 1, -3]} label="Punto B" />
        <LocationMarker position={[-4, 0.5, 1]} label="Punto C" />
        <LocationMarker position={[0, 3, -2]} label="Punto D" />
        
        {/* Regiones coloreadas para diferentes áreas */}
        <RegionIndicator 
          position={[2, 0.1, 2]} 
          color={colors.accent.DEFAULT} 
          radius={1.5} 
          label="Región 1" 
        />
        <RegionIndicator 
          position={[-3, 0.1, -1]} 
          color={colors.primary.light} 
          radius={2} 
          label="Región 2" 
        />
      </group>
      
      <CameraController minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}

interface CameraControllerProps {
  minPolarAngle?: number;
  maxPolarAngle?: number;
  enableZoom?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  [key: string]: unknown; // Cambiado de 'any' a 'unknown' para mejor tipado
}

// Controlador de cámara para poder navegar en la escena
function CameraController(props: CameraControllerProps) {
  const { camera, gl } = useThree();
  
  // OrbitControls no acepta 'args' como prop, aunque lo usamos en la instanciación
  // Creamos un objeto con todas las props excepto 'args' para pasarlas al componente
  const { 
    minPolarAngle, 
    maxPolarAngle, 
    enableZoom, 
    autoRotate, 
    autoRotateSpeed,
    ...otherProps 
  } = props;
  
  return (
    <OrbitControls 
      camera={camera} 
      domElement={gl.domElement}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      enableZoom={enableZoom}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      {...otherProps}
    />
  );
}

// Componente para fondo animado con interacción
function AnimatedBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, mouse } = useThree();
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime() * 0.2;
      materialRef.current.uniforms.resolution.value.set(
        viewport.width * viewport.dpr, 
        viewport.height * viewport.dpr
      );
      
      // Actualizar posición del mouse (normalizada)
      materialRef.current.uniforms.mousePosition.value.set(
        (mouse.x + 1) / 2, 
        (mouse.y + 1) / 2
      );
    }
  });
  
  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial 
        ref={materialRef} 
        args={[BackgroundShader]}
        attach="material"
      />
    </mesh>
  );
}

// Definimos los tipos para el estilo de variantes en createProjectTexture
interface StyleVariant {
  background: () => CanvasGradient | string;
  decoration: () => void;
}

// Generador de textura para proyectos
function createProjectTexture(project: Project, index: number): THREE.CanvasTexture | null {
  // Crear canvas para generar una textura procedural
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;
  
  // Variaciones de estilo según el índice
  const styleVariants: StyleVariant[] = [
    {
      // Estilo 1: Gradiente diagonal con formas geométricas
      background: () => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, colors.primary.light);
        gradient.addColorStop(1, colors.accent.DEFAULT);
        return gradient;
      },
      decoration: () => {
        // Formas geométricas
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        for (let i = 0; i < 12; i++) {
          const size = 100 + Math.random() * 200;
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.random() * Math.PI);
          ctx.beginPath();
          
          // Alternar entre rectángulos y círculos
          if (i % 2 === 0) {
            ctx.rect(-size/2, -size/2, size, size);
          } else {
            ctx.arc(0, 0, size/2, 0, Math.PI * 2);
          }
          
          ctx.fill();
          ctx.restore();
        }
      }
    },
    {
      // Estilo 2: Gradiente radial con círculos concéntricos
      background: () => {
        const gradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, canvas.width * 0.7
        );
        gradient.addColorStop(0, colors.accent.DEFAULT);
        gradient.addColorStop(1, colors.primary.dark);
        return gradient;
      },
      decoration: () => {
        // Círculos concéntricos
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 5;
        const center = { x: canvas.width/2, y: canvas.height/2 };
        
        for (let i = 1; i < 10; i++) {
          const radius = i * 80;
          ctx.beginPath();
          ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Líneas radiales
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const length = 800;
          
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(
            center.x + Math.cos(angle) * length,
            center.y + Math.sin(angle) * length
          );
          ctx.stroke();
        }
      }
    },
    {
      // Estilo 3: Gradiente vibrante con patrón de ondas
      background: () => {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors.primary.mid);
        gradient.addColorStop(0.5, colors.secondary);
        gradient.addColorStop(1, colors.accent.DEFAULT);
        return gradient;
      },
      decoration: () => {
        // Ondas horizontales
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 3;
        
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          
          for (let x = 0; x < canvas.width; x += 5) {
            const amplitude = 20;
            const frequency = 0.02;
            const offset = Math.sin(x * frequency) * amplitude;
            
            if (x === 0) {
              ctx.moveTo(x, y + offset);
            } else {
              ctx.lineTo(x, y + offset);
            }
          }
          
          ctx.stroke();
        }
        
        // Partículas
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 4 + 1;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  ];
  
  // Seleccionar estilo basado en el índice
  const style = styleVariants[index % styleVariants.length];
  
  // Aplicar fondo
  ctx.fillStyle = style.background();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Aplicar decoraciones
  style.decoration();
  
  // Añadir overlay sutil para mejorar legibilidad del texto
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Añadir título del proyecto con sombra
  ctx.font = "bold 70px 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Sombra
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillText(project.title, canvas.width / 2 + 4, canvas.height / 2 + 4);
  
  // Texto principal
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fillText(project.title, canvas.width / 2, canvas.height / 2);
  
  // Añadir categoría
  ctx.font = "normal 34px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText(project.category.toUpperCase(), canvas.width / 2, canvas.height / 2 + 80);
  
  // Crear textura a partir del canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface ProjectItemProps {
  project: Project;
  index: number;
  active: boolean;
}

// Componente para cada proyecto con efecto flotante
function ProjectItem({ project, index, active }: ProjectItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const imgRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Crear textura procedural para el proyecto, evitando problemas de carga
  const texture = useMemo(() => createProjectTexture(project, index), [project, index]);
  
  // Determinar proporción de aspecto para la imagen
  const aspectRatio = 16 / 9; // Proporción predeterminada
  const scaleX = 2.5;
  const scaleY = scaleX / aspectRatio;
  const scaleZ = 1;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Animar basado en si está activo
    const targetY = active ? 0 : 20;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.05
    );
    
    // Efecto al hacer hover
    if (imgRef.current) {
      const targetScale = hovered && active ? 1.05 : 1;
      imgRef.current.scale.x = THREE.MathUtils.lerp(imgRef.current.scale.x, targetScale * scaleX, 0.1);
      imgRef.current.scale.y = THREE.MathUtils.lerp(imgRef.current.scale.y, targetScale * scaleY, 0.1);
    }
    
    // Movimiento sutil incluso cuando está activo
    if (active) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={[0, active ? 0 : 20, 0]}
    >
      <Float
        speed={2} // Velocidad de animación
        rotationIntensity={0.1} // Intensidad de rotación XYZ
        floatIntensity={0.2} // Fuerza de la flotación
        enabled={active} // Solo flotar cuando está activo
      >
        {/* Proyectos como marcos con imágenes */}
        <group>
          {/* Marco del proyecto */}
          <mesh 
            position={[0, 0, -0.05]} 
            scale={[scaleX + 0.2, scaleY + 0.2, 0.05]}
            receiveShadow
          >
            <boxGeometry />
            <meshStandardMaterial 
              color={colors.primary.mid} 
              metalness={0.5}
              roughness={0.5}
              emissive={colors.primary.dark}
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Imagen del proyecto */}
          <mesh 
            ref={imgRef}
            onPointerOver={() => active && setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={[scaleX, scaleY, scaleZ]}
            castShadow
          >
            <planeGeometry />
            <meshBasicMaterial 
              map={texture} 
              transparent={true}
            />
          </mesh>
          
          {/* Título */}
          <Text
            position={[0, -scaleY/2 - 0.3, 0]}
            fontSize={0.2}
            color={colors.accent.DEFAULT}
            anchorX="center"
            anchorY="top"
            maxWidth={scaleX * 0.9}
            font="/fonts/Inter-Bold.woff"
          >
            {project.title}
          </Text>
          
          {/* Categoría */}
          <Text
            position={[0, scaleY/2 + 0.25, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="bottom"
            font="/fonts/Inter-Regular.woff"
          >
            {project.category.toUpperCase()}
          </Text>
        </group>
      </Float>
      
      {/* Mostrar tecnologías cuando está activo */}
      {active && project.technologies && project.technologies.length > 0 && (
        <Html position={[scaleX/2 + 0.3, 0, 0]} center>
          <div className="bg-primary-dark/80 backdrop-blur-md p-3 rounded-lg border border-primary-mid/30 hidden md:block">
            <h4 className="text-sm font-medium mb-2 text-accent">Tecnologías</h4>
            <ul className="space-y-1">
              {project.technologies.map((tech: string, idx: number) => (
                <li key={idx} className="text-xs text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block"></span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </Html>
      )}
    </group>
  );
}

interface ImmersiveShowcaseProps {
  projects: Project[];
}

// Componente principal modificado 
export default function ImmersiveShowcase({ projects }: ImmersiveShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  // Nuevo estado para cambiar entre tipos de exhibición
  const [showcaseType, setShowcaseType] = useState(SHOWCASE_TYPES.GALLERY);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const accentColor = useAccentColor();
  
  const currentProject = projects[currentIndex];
  
  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      } else if (e.key === 'Escape') {
        router.push('/');
      } else if (e.key === 'i') {
        setShowDetails(prev => !prev);
      } else if (e.key === '1') {
        setShowcaseType(SHOWCASE_TYPES.GALLERY);
      } else if (e.key === '2') {
        setShowcaseType(SHOWCASE_TYPES.FLOATING_TEXT);
      } else if (e.key === '3') {
        setShowcaseType(SHOWCASE_TYPES.TOPOGRAPHIC);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projects.length, router]);
  
  // Navegación entre proyectos
  const navigateToProject = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary-dark">
      {/* Canvas 3D a pantalla completa */}
      <Canvas
        ref={canvasRef}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
      >
        {/* Renderizar contenido según el tipo de exhibición */}
        {showcaseType === SHOWCASE_TYPES.GALLERY && (
          <>
            <AnimatedBackground />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
            <spotLight position={[0, 5, 5]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
            
            {/* Esferas decorativas flotantes */}
            <FloatingSphere position={[-4, 2, -5]} color={colors.primary.light} speed={0.8} size={0.5} />
            <FloatingSphere position={[4, -2, -4]} color={colors.accent.DEFAULT} speed={0.6} size={0.3} />
            <FloatingSphere position={[-5, -3, -6]} color={colors.secondary} speed={1.2} size={0.4} />
            
            {/* Renderizar todos los proyectos, pero solo mostrar el actual */}
            {projects.map((project, index) => (
              <ProjectItem
                key={project.id}
                project={project}
                index={index}
                active={index === currentIndex}
              />
            ))}
            
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 4]}
              fov={50}
            />
            
            {/* Efectos de postprocesamiento */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                height={300}
                intensity={0.3}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.3} />
            </EffectComposer>
          </>
        )}
        
        {showcaseType === SHOWCASE_TYPES.FLOATING_TEXT && (
          <>
            <color attach="background" args={[colors.primary.dark]} />
            <FloatingTextExhibit />
            
            {/* Efectos de postprocesamiento para texto */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                height={300}
                intensity={0.5}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.5} />
            </EffectComposer>
          </>
        )}
        
        {showcaseType === SHOWCASE_TYPES.TOPOGRAPHIC && (
          <>
            <color attach="background" args={[colors.primary.dark]} />
            <fog attach="fog" args={[colors.primary.dark, 5, 20]} />
            <TopographicMapExhibit />
          </>
        )}
      </Canvas>
      
      {/* Controles de navegación para galería */}
      {showcaseType === SHOWCASE_TYPES.GALLERY && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6 z-10">
          <button
            onClick={() => navigateToProject('prev')}
            className="bg-primary-dark/80 backdrop-blur-md p-4 rounded-full border border-primary-mid/30 hover:bg-primary-mid/50 transition-colors"
            aria-label="Proyecto anterior"
          >
            <FiArrowLeft className="text-white" size={24} />
          </button>
          
          <div className="bg-primary-dark/80 backdrop-blur-md px-6 py-3 rounded-full border border-primary-mid/30">
            <span className="text-white font-medium">{currentIndex + 1} / {projects.length}</span>
          </div>
          
          <button
            onClick={() => navigateToProject('next')}
            className="bg-primary-dark/80 backdrop-blur-md p-4 rounded-full border border-primary-mid/30 hover:bg-primary-mid/50 transition-colors"
            aria-label="Proyecto siguiente"
          >
            <FiArrowRight className="text-white" size={24} />
          </button>
        </div>
      )}
      
      {/* Botones superiores */}
      <div className="absolute top-8 right-8 flex space-x-4 z-10">
        {/* Selector de tipo de visualización */}
        <div className="bg-primary-dark/80 backdrop-blur-md p-2 rounded-lg border border-primary-mid/30 flex space-x-2 mr-4">
          <button
            onClick={() => setShowcaseType(SHOWCASE_TYPES.GALLERY)}
            className={`p-2 rounded ${showcaseType === SHOWCASE_TYPES.GALLERY 
              ? 'bg-accent text-white' 
              : 'text-white/70 hover:text-white'}`}
            aria-label="Mostrar galería"
            title="Galería de proyectos"
          >
            <FiArrowRight className="text-current" size={18} />
          </button>
          
          <button
            onClick={() => setShowcaseType(SHOWCASE_TYPES.FLOATING_TEXT)}
            className={`p-2 rounded ${showcaseType === SHOWCASE_TYPES.FLOATING_TEXT 
              ? 'bg-accent text-white' 
              : 'text-white/70 hover:text-white'}`}
            aria-label="Mostrar texto flotante"
            title="Visualización de texto flotante"
          >
            <FiCode className="text-current" size={18} />
          </button>
          
          <button
            onClick={() => setShowcaseType(SHOWCASE_TYPES.TOPOGRAPHIC)}
            className={`p-2 rounded ${showcaseType === SHOWCASE_TYPES.TOPOGRAPHIC 
              ? 'bg-accent text-white' 
              : 'text-white/70 hover:text-white'}`}
            aria-label="Mostrar mapa topográfico"
            title="Mapa topográfico"
          >
            <FiMap className="text-current" size={18} />
          </button>
        </div>
        
        {showcaseType === SHOWCASE_TYPES.GALLERY && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-primary-dark/80 backdrop-blur-md p-3 rounded-full border border-primary-mid/30 hover:bg-primary-mid/50 transition-colors"
            aria-label={showDetails ? "Ocultar detalles" : "Mostrar detalles"}
            title="Información del proyecto"
          >
            <FiInfo className="text-white" size={20} />
          </button>
        )}
        
        <button
          onClick={() => router.push('/')}
          className="bg-primary-dark/80 backdrop-blur-md p-3 rounded-full border border-primary-mid/30 hover:bg-primary-mid/50 transition-colors"
          aria-label="Cerrar y volver"
          title="Volver al inicio"
        >
          <FiX className="text-white" size={20} />
        </button>
      </div>
      
      {/* Panel de detalles (solo en modo galería) */}
      {showcaseType === SHOWCASE_TYPES.GALLERY && (
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute left-8 bottom-28 max-w-md bg-primary-dark/90 backdrop-blur-md p-6 rounded-lg border border-primary-mid/30 z-10"
            >
              <Typography variant="h2" className="text-primary-light mb-2">{currentProject.title}</Typography>
              <Typography variant="body1" className="text-white/80 mb-4">{currentProject.description}</Typography>
              
              {currentProject.url && (
                <a 
                  href={currentProject.url}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/80 transition-colors"
                >
                  Ver proyecto
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Instrucciones basadas en el tipo de showcase */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ 
          duration: 4,
          times: [0, 0.7, 1],
          delay: 2 
        }}
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center text-white/80 text-sm z-0 pointer-events-none bg-primary-dark/40 backdrop-blur-sm px-4 py-2 rounded-lg"
      >
        {showcaseType === SHOWCASE_TYPES.GALLERY && (
          <p className="text-center">
            <span className="p-1 px-2 rounded bg-primary-dark/50 border border-primary-mid/20 mr-2">←</span>
            <span className="p-1 px-2 rounded bg-primary-dark/50 border border-primary-mid/20">→</span>
            <span className="ml-3">para navegar entre proyectos</span>
          </p>
        )}
        
        {showcaseType === SHOWCASE_TYPES.FLOATING_TEXT && (
          <p className="text-center">
            Arrastra para rotar • Usa el mouse para interactuar con el texto
          </p>
        )}
        
        {showcaseType === SHOWCASE_TYPES.TOPOGRAPHIC && (
          <p className="text-center">
            Arrastra para rotar • Zoom para acercar • Haz click en marcadores
          </p>
        )}
      </motion.div>
    </div>
  );
}