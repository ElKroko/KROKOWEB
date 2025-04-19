"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { colors } from '@/styles/theme';

// Definición de los tipos para las obras de arte
interface Artwork {
  title: string;
  imagePath: string;
  description: string;
}

// Componente para textura fallback separado
function FallbackArtwork({ artwork, position, rotation, audioIntensity, hovered }) {
  const meshRef = useRef();

  // Crear textura de fallback
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, colors.primary.light);
      gradient.addColorStop(1, colors.accent.DEFAULT);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(artwork.title, 256, 256);
    }

    return new THREE.CanvasTexture(canvas);
  }, [artwork.title]);

  // Animar igual que el original
  useFrame((state, delta) => {
    if (meshRef.current) {
      const scaleTarget = 1 + (hovered ? 0.1 : 0) + audioIntensity * 0.2;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scaleTarget, 0.1 * delta * 60);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scaleTarget, 0.1 * delta * 60);
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      if (audioIntensity > 0.1) {
        meshRef.current.rotation.y += 0.0005 * audioIntensity * delta * 60;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
    >
      <boxGeometry args={[3, 3, 0.1]} />
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(hovered ? 0x333333 : 0x000000)}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}

// Componente para cargar texturas separado
function TexturedArtwork({ artwork, position, rotation = [0, 0, 0], audioIntensity = 0 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // IMPORTANTE: useTexture debe ser llamado en el nivel superior del componente, nunca dentro de otro hook
  // Cualquier error debe manejarse con try/catch alrededor del componente, no alrededor del hook
  let texture;
  try {
    texture = useTexture(artwork.imagePath);
  } catch (error) {
    // Mostraremos un fallback si hay error, pero esto no debería ejecutarse
    // ya que useTexture lanzará un error asíncrono, no síncrono
    console.error("Error loading texture:", error);
    // Usaremos el componente FallbackArtwork en su lugar
    return <FallbackArtwork
      artwork={artwork}
      position={position}
      rotation={rotation}
      audioIntensity={audioIntensity}
      hovered={hovered}
    />;
  }

  // Actualizar propiedades de la textura si es necesario
  if (texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }

  useFrame((state, delta) => {
    if (meshRef.current) {
      const scaleTarget = 1 + (hovered ? 0.1 : 0) + audioIntensity * 0.2;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scaleTarget, 0.1 * delta * 60);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scaleTarget, 0.1 * delta * 60);
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      if (audioIntensity > 0.1) {
        meshRef.current.rotation.y += 0.0005 * audioIntensity * delta * 60;
      }
    }
  });

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
        <meshStandardMaterial
          map={texture}
          emissive={new THREE.Color(hovered ? 0x333333 : 0x000000)}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Título */}
      <Text
        position={[0, -1.8, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
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

// Componente ErrorBoundary para capturar errores de carga
class ArtworkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackArtwork
        artwork={this.props.artwork}
        position={this.props.position}
        rotation={this.props.rotation}
        audioIntensity={this.props.audioIntensity}
        hovered={false}
      />;
    }

    return this.props.children;
  }
}

// Componente contenedor para cada obra
function ArtworkElement(props) {
  return (
    <ArtworkErrorBoundary {...props}>
      <TexturedArtwork {...props} />
    </ArtworkErrorBoundary>
  );
}

// Componente principal corregido
export default function ImmersiveGallery({
  artworks,
  audioEnabled,
  currentTrack
}) {
  const [audioIntensity, setAudioIntensity] = useState(0);

  // Manejar la intensidad del audio
  useEffect(() => {
    if (!audioEnabled) {
      setAudioIntensity(0);
      return;
    }

    // Usar RAF o intervalos en lugar de setTimeout anidados
    const interval = setInterval(() => {
      setAudioIntensity(0.3 + Math.random() * 0.4);
    }, 200);

    return () => clearInterval(interval);
  }, [audioEnabled, currentTrack]);

  // Calcular posiciones una sola vez
  const artworkPositions = useMemo(() => {
    return artworks.map((_, index) => {
      const angle = (index / artworks.length) * Math.PI * 2;
      const radius = 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const rotY = Math.atan2(x, z) + Math.PI;

      return {
        position: [x, 0, z],
        rotation: [0, rotY, 0]
      };
    });
  }, [artworks.length]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        depth: true,
      }}
    >
      <color attach="background" args={[colors.primary.dark]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {audioEnabled && (
        <>
          <pointLight
            position={[0, 5, 0]}
            intensity={0.8 + audioIntensity * 1.5}
            color={colors.primary.light}
            distance={25}
          />
          <pointLight
            position={[5, 0, 5]}
            intensity={0.6 + audioIntensity * 1}
            color={colors.accent.DEFAULT}
            distance={20}
          />
        </>
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={6}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />

      {artworks.map((artwork, index) => (
        <ArtworkElement
          key={index}
          artwork={artwork}
          position={artworkPositions[index].position}
          rotation={artworkPositions[index].rotation}
          audioIntensity={audioEnabled ? audioIntensity : 0}
        />
      ))}
    </Canvas>
  );
}