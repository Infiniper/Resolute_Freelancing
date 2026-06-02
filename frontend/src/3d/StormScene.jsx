import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text3D, Sparkles, Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { range, lerp } from '../data/stormConfig'
import WindParticles from './WindParticles'   // Neeraj's component (stub it until ready)

// ───────────────────────────────────────────────
// The Director reads scroll progress every frame
// and drives the camera, lighting, lightning, and
// the "s" tear-off. This is the brain of the scene.
// ───────────────────────────────────────────────
function Director({ progress, sRef, ambientRef, keyRef }) {
  const { camera } = useThree()
  const flash = useRef(0)

  useFrame((state, delta) => {
    const p = progress.current
    const build = range(p, 0.0, 0.4)    // 0→1 as storm builds
    const peak  = range(p, 0.4, 0.65)   // 0→1 during full fury
    const tear  = range(p, 0.65, 0.85)  // 0→1 as "s" flies off

    // 1. CAMERA — mouse parallax when calm, fades out as storm builds
    const calm = 1 - build
    const shakeAmt = peak * 0.25 * (1 - tear)            // shake at peak only
    const targetX = state.pointer.x * 0.8 * calm + (Math.random() - 0.5) * shakeAmt
    const targetY = state.pointer.y * 0.4 * calm
                    + (Math.random() - 0.5) * shakeAmt
                    - tear * 5                            // follow "s" down during tear
    camera.position.x = lerp(camera.position.x, targetX, 0.1)
    camera.position.y = lerp(camera.position.y, targetY, 0.1)
    camera.lookAt(0, -tear * 5, 0)

    // 2. LIGHTING — world darkens as storm builds; text stays glowing (emissive)
    if (ambientRef.current) ambientRef.current.intensity = lerp(0.5, 0.04, build)

    // 3. LIGHTNING — random cool flashes during the peak
    if (peak > 0 && tear < 1 && Math.random() < 0.012 + peak * 0.03) flash.current = 1
    flash.current = Math.max(0, flash.current - delta * 4)
    if (keyRef.current) keyRef.current.intensity = 2 + flash.current * 10

    // 4. THE "s" — shivers more and more, then tears off and spins away
    if (sRef.current) {
      const shiver = (build + peak) * 0.05
      sRef.current.position.x = 8.4 + tear * 7 + (Math.random() - 0.5) * shiver
      sRef.current.position.y = 0 - tear * 16 + (Math.random() - 0.5) * shiver
      sRef.current.rotation.z -= tear * 0.5
    }
  })

  return null
}

export default function StormScene({ progress }) {
  const sRef       = useRef()
  const ambientRef = useRef()
  const keyRef     = useRef()

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 9], fov: 50 }}>
      <color attach="background" args={['#05070E']} />
      <fog attach="fog" args={['#05070E', 7, 22]} />

      {/* Lighting */}
      <ambientLight ref={ambientRef} intensity={0.5} />
      <pointLight ref={keyRef} position={[0, 2, 6]} intensity={2} color="#3B82F6" />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />

      {/* Dark drifting clouds far behind (nice-to-have; remove if finicky) */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={30} bounds={[14, 4, 4]} volume={9} color="#141d2e" position={[0, 0, -7]} opacity={0.6} />
      </Clouds>

      {/* Fine dust haze */}
      <Sparkles count={120} scale={[16, 9, 6]} size={2} speed={0.4} color="#9fb3d0" opacity={0.5} />

      {/* THE NAME — "The Resolute" + a separate, kickable "s".
          Both in one group so the whole name sits centered.
          TUNE: the size and the s position[0] (8.4) until it reads
          "The Resolutes" perfectly and the s sits right after "Resolute". */}
      <group position={[-4.4, -0.55, 0]}>
        <Text3D font="/fonts/Inter_Bold.json" size={1.3} height={0.35}
                bevelEnabled bevelSize={0.015} bevelThickness={0.03}>
          The Resolute
          <meshStandardMaterial color="#3B82F6" emissive="#3B82F6"
                                emissiveIntensity={0.6} metalness={0.3} roughness={0.4} />
        </Text3D>

        <Text3D ref={sRef} position={[8.4, 0, 0]} font="/fonts/Inter_Bold.json"
                size={1.3} height={0.35} bevelEnabled bevelSize={0.015} bevelThickness={0.03}>
          s
          <meshStandardMaterial color="#60A5FA" emissive="#3B82F6"
                                emissiveIntensity={0.6} metalness={0.3} roughness={0.4} />
        </Text3D>
      </group>

      {/* Neeraj's wind-blown debris */}
      <WindParticles kind="leaf"  count={70} progress={progress} />
      <WindParticles kind="paper" count={45} progress={progress} />

      <Director progress={progress} sRef={sRef} ambientRef={ambientRef} keyRef={keyRef} />
    </Canvas>
  )
}