import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Environment, Sparkles, Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { range, lerp, S_BASE } from '../data/stormConfig'
import WindParticles from './WindParticles'

function Director({ progress, sceneRef, nameRef, sRef, ambientRef, lightningRef }) {
  const flash = useRef(0)

  useFrame((state, delta) => {
    const camera = state.camera          // ← read from frame state (fixes the lint error)
    const p = progress.current
    const build = range(p, 0.0, 0.4)
    const peak  = range(p, 0.4, 0.65)
    const tear  = range(p, 0.65, 0.85)

    // 1. STRONG cursor tilt — rotate the whole scene (reads as a real 3D page tilt)
    const calm = 1 - build * 0.7
    if (sceneRef.current) {
      const tx = state.pointer.y * 0.28 * calm    // look up/down  (~16°)
      const ty = state.pointer.x * 0.45 * calm    // turn left/right (~26°)
      sceneRef.current.rotation.x = lerp(sceneRef.current.rotation.x, tx, 0.05)
      sceneRef.current.rotation.y = lerp(sceneRef.current.rotation.y, ty, 0.05)
    }

    // 2. camera shakes at the peak, then drops to follow the "s" during the tear
    const shake = peak * 0.3 * (1 - tear)
    camera.position.x = lerp(camera.position.x, (Math.random() - 0.5) * shake, 0.2)
    camera.position.y = lerp(camera.position.y, 1 + (Math.random() - 0.5) * shake - tear * 6, 0.08)
    camera.lookAt(0, -tear * 6, 0)

    // 3. world darkens as the storm builds
    if (ambientRef.current) ambientRef.current.intensity = lerp(0.6, 0.05, build)

    // 4. LIGHTNING — a white flash lights the whole scene at the peak
    if (peak > 0 && tear < 1 && Math.random() < 0.01 + peak * 0.04) flash.current = 1
    flash.current = Math.max(0, flash.current - delta * 5)
    if (lightningRef.current) lightningRef.current.intensity = flash.current * 9

    // 5. the WHOLE NAME trembles (harder as storm builds)
    const tremor = (build + peak) * 0.06
    if (nameRef.current) {
      nameRef.current.position.x = (Math.random() - 0.5) * tremor
      nameRef.current.position.y = (Math.random() - 0.5) * tremor
      nameRef.current.rotation.z = (Math.random() - 0.5) * tremor * 0.25
    }

    // 6. the "s" trembles EXTRA, then loses grip and tumbles away
    if (sRef.current) {
      const extra = (build + peak) * 0.13
      sRef.current.position.x = S_BASE.x + tear * 8 + (Math.random() - 0.5) * extra
      sRef.current.position.y = S_BASE.y - tear * 16 + (Math.random() - 0.5) * extra
      sRef.current.position.z = S_BASE.z + tear * 4
      sRef.current.rotation.z -= tear * 0.6
      sRef.current.rotation.x += tear * 0.2
    }
  })
  return null
}

export default function StormScene({ progress }) {
  const sceneRef     = useRef()
  const nameRef      = useRef()
  const sRef         = useRef()
  const ambientRef   = useRef()
  const lightningRef = useRef()

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1, 12], fov: 40 }} gl={{ antialias: true }}>
      <color attach="background" args={['#05070E']} />
      <fog attach="fog" args={['#070b18', 14, 32]} />

      {/* Reflections — THE biggest upgrade. Makes the text look polished and 3D. */}
      <Environment preset="night" />

      <ambientLight ref={ambientRef} intensity={0.6} />
      {/* Key light rakes across the bevels from the upper-left → reveals the 3D form */}
      <directionalLight position={[-6, 8, 6]} intensity={2.4} color="#cfe0ff" />
      <pointLight position={[6, -2, 4]} intensity={1.2} color="#3B82F6" />
      {/* Lightning flash light — normally off, spikes during the peak */}
      <directionalLight ref={lightningRef} position={[2, 6, 8]} intensity={0} color="#dbe7ff" />

      {/* Drifting dark clouds (lighter colour + closer so they're actually visible) */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud seed={1} segments={26} bounds={[18, 5, 5]} volume={10} color="#2a3550" opacity={0.5} position={[-4, 1, -6]} speed={0.2} />
        <Cloud seed={2} segments={22} bounds={[16, 4, 5]} volume={8}  color="#1e2840" opacity={0.4} position={[6, -1, -8]} speed={0.15} />
      </Clouds>

      {/* Fine floating dust haze (two layers for depth) */}
      <Sparkles count={280} scale={[24, 13, 9]} size={1.6} speed={0.5} color="#aebfd8" opacity={0.6} />
      <Sparkles count={120} scale={[20, 11, 7]} size={3.2} speed={0.3} color="#ffffff" opacity={0.22} />

      {/* The whole tiltable scene */}
      <group ref={sceneRef}>
        {/* Name group: trembles as a whole. TUNE the x in position to centre it. */}
        <group ref={nameRef} position={[-5.6, -0.65, 0]}>
          <Text3D font="/fonts/Inter_Bold.json" size={1.3} height={0.6}
                  bevelEnabled bevelSize={0.04} bevelThickness={0.08} bevelSegments={4} curveSegments={6}>
            The Resolute
            <meshStandardMaterial color="#2f7fef" emissive="#1e40af" emissiveIntensity={0.18}
                                  metalness={0.65} roughness={0.22} envMapIntensity={1.4} />
          </Text3D>

          {/* The kickable "s". TUNE S_BASE.x in stormConfig until it sits right after "Resolute". */}
          <Text3D ref={sRef} position={[S_BASE.x, S_BASE.y, S_BASE.z]} font="/fonts/Inter_Bold.json"
                  size={1.3} height={0.6} bevelEnabled bevelSize={0.04} bevelThickness={0.08} bevelSegments={4} curveSegments={6}>
            s
            <meshStandardMaterial color="#2f7fef" emissive="#1e40af" emissiveIntensity={0.18}
                                  metalness={0.65} roughness={0.22} envMapIntensity={1.4} />
          </Text3D>
        </group>

        {/* Neeraj's debris */}
        <WindParticles kind="leaf"  count={90}  progress={progress} />
        <WindParticles kind="paper" count={55}  progress={progress} />
        <WindParticles kind="dust"  count={300} progress={progress} />
      </group>

      <Director progress={progress} sceneRef={sceneRef} nameRef={nameRef}
                sRef={sRef} ambientRef={ambientRef} lightningRef={lightningRef} />
    </Canvas>
  )
}