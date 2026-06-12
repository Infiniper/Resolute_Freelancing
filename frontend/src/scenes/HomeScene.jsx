import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import { signals } from './signals'
import { tune } from './tune'
import {
  lerp, range, easeInOut, stormIntensity, clamp01,
  S_BASE, S_LAND, S_FLY_START, URPRISE_Y, NAME_BASE_Y,
} from '../data/stormConfig'
import WindParticles from '../3d/WindParticles'
import Asteroids from '../3d/Asteroids'
import Lightning from '../3d/Lightning'

// Shared Text3D geometry options for the wordmark. Shallow extrusion + a small
// letter gap so the letters read cleanly (the old deep, tight extrusion looked
// like a solid slab). All three Text3D share this so they stay consistent.
const TEXT_OPTS = {
  font: '/fonts/Clash_Display.json',
  size: 0.9, height: 0.22,
  bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.06, bevelSegments: 4,
  curveSegments: 6,
  letterSpacing: 0.03,
}

// The signature electric-blue emissive material, shared by every letter. It
// writes + tests depth and the meshes render last (renderOrder below), so the
// solid wordmark always composites on top of the (additive, depth-write-off)
// storm particles — nothing ever paints over the letters. It stays `transparent`
// only so the dissolve can fade opacity; the storm particles all sit behind it
// in z and out of the keep-out box, so depthTest never hides it.
const MAT = {
  color: '#2f7fef', emissive: '#1e63d6', emissiveIntensity: 0.7,
  metalness: 0.6, roughness: 0.25, envMapIntensity: 1.2,
  depthWrite: true, depthTest: true,
}

// Render the wordmark after every particle (which use renderOrder 0), so within
// the transparent pass it draws last and on top.
const WORDMARK_ORDER = 10

// A live `progress.current` view onto the shared scroll signal — lets the
// existing storm particle components keep their `progress` ref API unchanged.
const liveProgress = { get current() { return signals.homeScroll } }

// Drives the object animation (camera lives in CameraRig). Reads the shared
// scroll signal so it stays in lock-step with the camera pan.
function HomeDirector({ sceneRef, nameRef, sRef, ambientRef, urpriseRef, nameMatRef, urpriseMatRef }) {
  useFrame(() => {
    const p = signals.homeScroll
    const reveal = signals.homeReveal
    const build = range(p, 0.0, 0.35)
    const peak = range(p, 0.35, S_FLY_START)
    const fly = range(p, S_FLY_START, 1.0)
    const e = easeInOut(fly)
    const tremor = (build + peak) * 0.05 * (1 - fly)
    const calm = (1 - build * 0.6) * (1 - fly)

    // Cursor tilt of the whole title group (off during the fall) — ~2× stronger.
    if (sceneRef.current) {
      sceneRef.current.rotation.x = lerp(sceneRef.current.rotation.x, signals.pointer.y * 0.38 * calm, 0.05)
      sceneRef.current.rotation.y = lerp(sceneRef.current.rotation.y, signals.pointer.x * 0.55 * calm, 0.05)
      // The storm clears, the word dissolves, the message remains: fade the
      // whole focal group out as the payoff scrolls in, then hide it entirely
      // so the 3D "surprise!" and the payoff text are never on screen together.
      sceneRef.current.visible = reveal > 0.02
    }

    const op = clamp01(reveal)
    if (nameMatRef.current) nameMatRef.current.opacity = op
    if (urpriseMatRef.current) urpriseMatRef.current.opacity = op
    if (sRef.current?.material) sRef.current.material.opacity = op
    if (urpriseRef.current) urpriseRef.current.position.x = tune.urpriseX

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
        const P2 = { x: tune.sLandX, y: S_LAND.y, z: S_LAND.z }
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
  const urpriseRef = useRef()
  const nameMatRef = useRef()
  const urpriseMatRef = useRef()

  // Fit the wordmark to the viewport so the hero is never cut off — critical on
  // a narrow phone (acceptance: the hero must be visible complete on mobile).
  // Derived from aspect: full size on a wide screen, scaled down as it narrows.
  // The whole focal group scales uniformly, and CameraRig reads the same
  // `heroScale` so the storm pan stays locked onto the (scaled) "surprise!".
  const { width, height } = useThree((s) => s.size)
  const heroScale = Math.min(1, Math.max(0.34, 0.95 * (width / height)))
  signals.heroScale = heroScale

  return (
    <group ref={sceneRef} scale={heroScale}>
      {/* Storm-driven lighting (dims as the storm peaks). */}
      <ambientLight ref={ambientRef} intensity={0.55} />
      <directionalLight position={[-6, 8, 6]} intensity={2.2} color="#cfe0ff" />
      <pointLight position={[6, -2, 4]} intensity={1.2} color="#3B82F6" />

      {/* "The Resolute" — the "s" is a separate, animated mesh. */}
      <group ref={nameRef} position={[0, NAME_BASE_Y, 0]}>
        <Center>
          <Text3D {...TEXT_OPTS} renderOrder={WORDMARK_ORDER}>
            The Resolute
            <meshStandardMaterial ref={nameMatRef} transparent {...MAT} />
          </Text3D>
        </Center>
      </group>

      {/* The breakaway "s". */}
      <Text3D ref={sRef} position={[S_BASE.x, NAME_BASE_Y + S_BASE.y, S_BASE.z]} {...TEXT_OPTS} renderOrder={WORDMARK_ORDER}>
        s
        <meshStandardMaterial transparent {...MAT} />
      </Text3D>

      {/* "urprise!" waiting below — the s lands at its left → "surprise!". */}
      <group ref={urpriseRef} position={[tune.urpriseX, URPRISE_Y, 0]}>
        <Text3D {...TEXT_OPTS} renderOrder={WORDMARK_ORDER}>
          urprise!
          <meshStandardMaterial ref={urpriseMatRef} transparent {...MAT} />
        </Text3D>
      </group>

      {/* Storm — no GlowParticles dust field: the Bloom pass smeared its additive
          glow sprites into a continuous translucent band across the hero. The
          wordmark, pages, asteroids and lightning carry the storm; the dark
          storm-sky clouds behind it are the world's drei <Clouds> (R13). */}
      <WindParticles count={mobile ? 6 : 16} progress={liveProgress} />
      <Asteroids count={mobile ? 3 : 5} progress={liveProgress} />
      <Lightning progress={liveProgress} />

      <HomeDirector
        sceneRef={sceneRef} nameRef={nameRef} sRef={sRef} ambientRef={ambientRef}
        urpriseRef={urpriseRef} nameMatRef={nameMatRef} urpriseMatRef={urpriseMatRef}
      />
    </group>
  )
}
