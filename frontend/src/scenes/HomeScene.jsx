import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import { signals } from './signals'
import {
  lerp, range, easeInOut, stormIntensity,
  S_BASE, S_LAND, URPRISE_Y, NAME_BASE_Y,
} from '../data/stormConfig'
import GlowParticles from '../3d/GlowParticles'
import WindParticles from '../3d/WindParticles'
import Asteroids from '../3d/Asteroids'
import Lightning from '../3d/Lightning'

// Shared Text3D geometry options for the wordmark.
const TEXT_OPTS = {
  font: '/fonts/Clash_Display.json',
  size: 0.9, height: 0.5,
  bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.06, bevelSegments: 4,
  curveSegments: 6,
}

// The signature electric-blue emissive material, shared by every letter.
const MAT = {
  color: '#2f7fef', emissive: '#1e63d6', emissiveIntensity: 0.7,
  metalness: 0.6, roughness: 0.25, envMapIntensity: 1.2,
}

// A live `progress.current` view onto the shared scroll signal — lets the
// existing storm particle components keep their `progress` ref API unchanged.
const liveProgress = { get current() { return signals.homeScroll } }

// Drives the object animation (camera lives in CameraRig). Reads the shared
// scroll signal so it stays in lock-step with the camera pan.
function HomeDirector({ sceneRef, nameRef, sRef, ambientRef }) {
  useFrame(() => {
    const p = signals.homeScroll
    const build = range(p, 0.0, 0.35)
    const peak = range(p, 0.35, 0.55)
    const fly = range(p, 0.55, 1.0)
    const e = easeInOut(fly)
    const tremor = (build + peak) * 0.05 * (1 - fly)
    const calm = (1 - build * 0.6) * (1 - fly)

    // Cursor tilt of the whole title group (off during the fall).
    if (sceneRef.current) {
      sceneRef.current.rotation.x = lerp(sceneRef.current.rotation.x, signals.pointer.y * 0.22 * calm, 0.05)
      sceneRef.current.rotation.y = lerp(sceneRef.current.rotation.y, signals.pointer.x * 0.35 * calm, 0.05)
    }

    // Storm darkens the scene as it peaks, then lifts for the reveal.
    if (ambientRef.current) ambientRef.current.intensity = lerp(0.55, 0.06, stormIntensity(p))

    // "The Resolute" trembles under the storm.
    if (nameRef.current) {
      nameRef.current.position.x = (Math.random() - 0.5) * tremor
      nameRef.current.position.y = NAME_BASE_Y + (Math.random() - 0.5) * tremor
      nameRef.current.rotation.z = (Math.random() - 0.5) * tremor * 0.25
    }

    // The "s": rests with the name, then swoops on a bezier into "urprise".
    if (sRef.current) {
      if (fly <= 0) {
        sRef.current.position.set(
          S_BASE.x + (Math.random() - 0.5) * tremor * 2,
          NAME_BASE_Y + S_BASE.y + (Math.random() - 0.5) * tremor * 2,
          S_BASE.z
        )
        sRef.current.rotation.set(0, 0, 0)
        sRef.current.scale.setScalar(1)
      } else {
        const P0 = { x: S_BASE.x, y: NAME_BASE_Y + S_BASE.y, z: S_BASE.z }
        const P2 = S_LAND
        const P1 = { x: (P0.x + P2.x) / 2 - 3, y: (P0.y + P2.y) / 2 + 5, z: 4 } // swoop up & toward camera
        const mt = 1 - e
        sRef.current.position.set(
          mt * mt * P0.x + 2 * mt * e * P1.x + e * e * P2.x,
          mt * mt * P0.y + 2 * mt * e * P1.y + e * e * P2.y,
          mt * mt * P0.z + 2 * mt * e * P1.z + e * e * P2.z
        )
        sRef.current.rotation.z = mt * -6 // spins, settles upright on landing
        sRef.current.rotation.x = mt * 3
        const land = range(fly, 0.88, 1.0)
        const dip = Math.sin(land * Math.PI) * 0.28 // squish on impact
        sRef.current.scale.set(1 + dip * 0.4, 1 - dip, 1 + dip * 0.4)
      }
    }
  })
  return null
}

/**
 * The Home focal scene — "The Resolute", the breakaway "s", the waiting
 * "urprise!", and the storm that drives them. Anchored at the world origin.
 */
export default function HomeScene({ mobile }) {
  const sceneRef = useRef()
  const nameRef = useRef()
  const sRef = useRef()
  const ambientRef = useRef()

  return (
    <group ref={sceneRef}>
      {/* Storm-driven lighting (dims as the storm peaks). */}
      <ambientLight ref={ambientRef} intensity={0.55} />
      <directionalLight position={[-6, 8, 6]} intensity={2.2} color="#cfe0ff" />
      <pointLight position={[6, -2, 4]} intensity={1.2} color="#3B82F6" />

      {/* "The Resolute" — the "s" is a separate, animated mesh. */}
      <group ref={nameRef} position={[0, NAME_BASE_Y, 0]}>
        <Center>
          <Text3D {...TEXT_OPTS}>
            The Resolute
            <meshStandardMaterial {...MAT} />
          </Text3D>
        </Center>
      </group>

      {/* The breakaway "s". */}
      <Text3D ref={sRef} position={[S_BASE.x, NAME_BASE_Y + S_BASE.y, S_BASE.z]} {...TEXT_OPTS}>
        s
        <meshStandardMaterial {...MAT} />
      </Text3D>

      {/* "urprise!" waiting below — the s lands at its left → "surprise!". */}
      <group position={[-3.2, URPRISE_Y, 0]}>
        <Text3D {...TEXT_OPTS}>
          urprise!
          <meshStandardMaterial {...MAT} />
        </Text3D>
      </group>

      {/* Storm */}
      <GlowParticles count={mobile ? 200 : 600} progress={liveProgress} />
      <WindParticles count={mobile ? 6 : 16} progress={liveProgress} />
      <Asteroids count={mobile ? 5 : 9} progress={liveProgress} />
      <Lightning progress={liveProgress} />

      <HomeDirector sceneRef={sceneRef} nameRef={nameRef} sRef={sRef} ambientRef={ambientRef} />
    </group>
  )
}
