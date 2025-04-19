"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  useTexture,
  useGLTF,
  Environment,
  Preload,
  Stats
} from '@react-three/drei';
import * as THREE from 'three';

// Evitar que THREE.WebGLRenderer pierda el contexto fácilmente
THREE.WebGLRenderer.prototype.lose = null;

// Definición de los tipos para las obras de arte
interface Artwork {
  title: string;
  imagePath: string;
  description: string;
}

// Componente fallback para cuando las texturas no cargan
function FallbackMaterial({ title }: { title: string }) {
  const canvasSize = 512;
  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Gradiente
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize);
      gradient.addColorStop(0, '#3730a3');
      gradient.addColorStop(1, '#6d28d9');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Texto
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(title, canvasSize / 2, canvasSize / 2);
    }
    return canvas;
  }, [title]);
  
  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
  return texture;
}

// Elemento individual de obra de arte con manejo de errores
function ArtworkElement({ 
  artwork, 
  position, 
  rotation = [0, 0, 0],
  audioIntensity = 0 
}: { 
  artwork: Artwork, 
  position: [number, number, number], 
  rotation?: [number, number, number],
  audioIntensity: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [textureError, setTextureError] = useState(false);
  
  // Intentar cargar la textura con manejo de errores
  let texture;
  try {
    texture = useTexture(artwork.imagePath);
    // Configurar propiedades básicas de la textura para mejor rendimiento
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.premultiplyAlpha = true;
    }
  } catch (error) {
    console.warn(`Error cargando textura para ${artwork.title}:`, error);
    setTextureError(true);
  }
  
  // Usar textura de fallback en caso de error
  const fallbackTexture = useMemo(() => {
    if (textureError) {
      return <FallbackMaterial title={artwork.title} />;
    }
    return null;
  }, [textureError, artwork.title]);
  
  // Animar la obra con requestAnimationFrame para mejor rendimiento
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Usar delta para animaciones independientes de la tasa de cuadros
      const scaleTarget = 1 + (hovered ? 0.1 : 0) + audioIntensity * 0.2;
      
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scaleTarget, 0.1 * delta * 60);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scaleTarget, 0.1 * delta * 60);
      
      // Movimiento de flotación más suave
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Rotación más sutil cuando hay audio
      if (audioIntensity > 0.1) {
        meshRef.current.rotation.y += 0.0005 * audioIntensity * delta * 60;
      }
    }
  });
  
  // Material optimizado
  const material = useMemo(() => {
    return (
      <meshStandardMaterial 
        map={textureError ? fallbackTexture : texture}
        emissive={new THREE.Color(hovered ? 0x333333 : 0x000000)}
        metalness={0.5}
        roughness={0.5}
        transparent={true}
        alphaTest={0.5}
      />
    );
  }, [texture, fallbackTexture, textureError, hovered]);
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        rotation={rotation}
        onClick={() => setActive(!active)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[3, 3, 0.1]} />
        {material}
      </mesh>
      
      {/* Título */}
      <Text
        position={[0, -1.8, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {artwork.title}
      </Text>
      
      {/* Descripción cuando está activo */}
      {active && (
        <group position={[0, 0, 0.3]}>
          <mesh>
            <planeGeometry args={[3.2, 1.5]} />
            <meshBasicMaterial color="black" transparent opacity={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.1]}
            fontSize={0.15}
            maxWidth={3}
            lineHeight={1.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
          >
            {artwork.description}
          </Text>
        </group>
      )}
    </group>
  );
}

// Versión optimizada de partículas reactivas al audio
function AudioReactiveParticles({ audioIntensity = 0 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Reducir el número de partículas para mejor rendimiento
  const particleCount = 1500; 
  
  // Memoizar las posiciones y colores para evitar recrearlos
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Crear una distribución esférica
      const radius = 5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Colores degradados
      const hue = (Math.random() * 0.1) + 0.6; // Púrpura-azul
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, [particleCount]);
  
  // Optimizar la animación para que sea menos intensiva
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Rotación más suave
      pointsRef.current.rotation.y += 0.0005;
      
      // Escalar según intensidad de audio
      const scale = 1 + audioIntensity * 2;
      pointsRef.current.scale.set(scale, scale, scale);
      
      // Limitar actualizaciones de vértices para mejorar rendimiento
      if (audioIntensity > 0.3 && Math.random() > 0.7) {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        // Actualizar solo una fracción de partículas por frame
        const updateCount = Math.floor(particleCount * 0.1);
        const startIdx = Math.floor(Math.random() * (particleCount - updateCount));
        
        for (let i = startIdx; i < startIdx + updateCount; i++) {
          const i3 = i * 3;
          const x = positions[i3];
          const y = positions[i3 + 1];
          const z = positions[i3 + 2];
          
          // Movimiento más sutil
          positions[i3] = x + Math.sin(state.clock.elapsedTime * 0.1 + i * 0.01) * 0.01 * audioIntensity;
          positions[i3 + 1] = y + Math.cos(state.clock.elapsedTime * 0.1 + i * 0.01) * 0.01 * audioIntensity;
          positions[i3 + 2] = z + Math.sin(state.clock.elapsedTime * 0.1 + i * 0.02) * 0.01 * audioIntensity;
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Componente principal optimizado
export default function ImmersiveGallery({ 
  artworks, 
  audioEnabled,
  currentTrack 
}: {
  artworks: Artwork[];
  audioEnabled: boolean;
  currentTrack: number;
}) {
  const [audioIntensity, setAudioIntensity] = useState(0);
  
  // Simular análisis de audio con menos actualizaciones
  useEffect(() => {
    if (!audioEnabled) {
      setAudioIntensity(0);
      return;
    }
    
    // Intervalos más largos para reducir la presión en el sistema
    const intervalId = setInterval(() => {
      const baseIntensity = 0.3;
      const randomVariation = Math.random() * 0.4;
      setAudioIntensity(baseIntensity + randomVariation);
    }, 200); // Intervalo más largo
    
    return () => clearInterval(intervalId);
  }, [audioEnabled, currentTrack]);
  
  return (
    <Canvas 
      shadows 
      dpr={[1, 1.5]} // Reducir DPR para mejor rendimiento
      gl={{ 
        antialias: true,
        alpha: false, // Deshabilitar alpha para rendimiento
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      onCreated={({ gl }) => {
        // Configuraciones para mejorar rendimiento
        gl.setClearColor(new THREE.Color('#050505'));
        gl.physicallyCorrectLights = true;
      }}
    >
      <color attach="background" args={['#050505']} />
      
      {/* Luces con intensidad reducida */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* Luces reactivas al audio */}
      {audioEnabled && (
        <>
          <pointLight
            position={[0, 5, 0]}
            intensity={0.8 + audioIntensity * 1.5}
            color="#7030a0"
            distance={25} // Limitar distancia para rendimiento
          />
          <pointLight
            position={[5, 0, 5]}
            intensity={0.6 + audioIntensity * 1}
            color="#3060a0"
            distance={20}
          />
        </>
      )}
      
      {/* Controles optimizados */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={6}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enableZoom={true}
        enablePan={false} // Deshabilitar pan para evitar problemas
        rotateSpeed={0.5} // Rotación más lenta
        zoomSpeed={0.5} // Zoom más lento
      />
      
      {/* Partículas solo si el audio está habilitado */}
      {audioEnabled && (
        <Suspense fallback={null}>
          <AudioReactiveParticles audioIntensity={audioIntensity} />
        </Suspense>
      )}
      
      {/* Artworks dispuestos en círculo */}
      <Suspense fallback={null}>
        {artworks.map((artwork, index) => {
          const totalArtworks = artworks.length;
          const angle = (index / totalArtworks) * Math.PI * 2;
          
          // Disposición circular
          const radius = 10;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          // Rotación para que miren hacia el centro
          const rotY = Math.atan2(x, z) + Math.PI;
          
          return (
            <ArtworkElement
              key={index}
              artwork={artwork}
              position={[x, 0, z]}
              rotation={[0, rotY, 0]}
              audioIntensity={audioEnabled ? audioIntensity : 0}
            />
          );
        })}
      </Suspense>
      
      {/* Precargar texturas y otros recursos */}
      <Preload all />
      
      {/* Ambiente básico para reducir la carga */}
      <Environment preset="night" />
    </Canvas>
  );
}