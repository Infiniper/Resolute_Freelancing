// src/3d/ParticleField.jsx

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'

// ─────────────────────────────────────────────────────
// GlowingSphere lives INSIDE the Canvas.
// It cannot use HTML, CSS, or Tailwind.
// It speaks Three.js through JSX.
// ─────────────────────────────────────────────────────
function GlowingSphere() {
  const meshRef = useRef(null)

  // useFrame runs ~60 times per second
  // delta = seconds since last frame (keeps speed consistent on all devices)
  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.07
    meshRef.current.rotation.y += delta * 0.11
  })

  return (
    // Float = gentle floating/bobbing animation, handled automatically by drei
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.9}>
      <mesh ref={meshRef}>
        {/* icosahedronGeometry: args = [radius, detail]
            detail=1 → medium facets, looks like a gem/crystal */}
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          color="#3B82F6"
          wireframe={true}
          emissive="#3B82F6"
          emissiveIntensity={0.45}
        />
      </mesh>
    </Float>
  )
}

// ─────────────────────────────────────────────────────
// ParticleField is a normal React component.
// It renders a <div> with a <Canvas> inside.
// The Canvas sets up the 3D scene.
// ─────────────────────────────────────────────────────
export default function ParticleField() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Lighting — meshStandardMaterial needs light to show emissive glow */}
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 4]} color="#3B82F6" intensity={4} />
        <pointLight position={[4, 4, 0]} color="#60A5FA" intensity={1} />

        {/* Star field — 4000 stars, slow rotation, fade at edges */}
        <Stars
          radius={90}
          depth={60}
          count={4000}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />

        {/* Your glowing sphere */}
        <GlowingSphere />
      </Canvas>
    </div>
  )
}