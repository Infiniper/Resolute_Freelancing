import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { Environment, Lightformer, Stars } from '@react-three/drei'
import * as THREE from 'three'
import SpaceDebris from '../3d/SpaceDebris'
import Traveler from '../3d/Traveler'

// SpaceDebris reads `progress.current` to gust with the storm; the persistent
// world keeps it calm and slow at all times.
const calm = { current: 0 }

// A faint Milky-Way wash deep behind the procedural stars: a big inverted sphere
// (BackSide) mapped with the 2k photo and tinted right down, so it reads as a
// subtle starry band under the dark-navy palette — never bright, never blooming
// into haze. depthWrite={false} so it never occludes the debris/saucer in front
// (`fog={false}` is now just a harmless guard — the world no longer uses scene fog).
// OWNER: nudge the `color` tint brighter/darker to taste.
function MilkyWay() {
  const tex = useLoader(THREE.TextureLoader, '/2k_stars_milky_way.jpg')
  tex.colorSpace = THREE.SRGBColorSpace
  return (
    <mesh>
      <sphereGeometry args={[100, 48, 48]} />
      <meshBasicMaterial map={tex} color="#39496a" side={THREE.BackSide} depthWrite={false} fog={false} />
    </mesh>
  )
}

/**
 * The persistent backdrop shared by every route — layered deep space: a dim
 * Milky-Way photo-sphere deepest, two star layers over it, slow debris, and a
 * flying-saucer traveller that flies between vantages. It never unmounts, so
 * moving between pages feels like one continuous flight. Counts drop on mobile.
 * (No constellations / aurora / nebulae / fog — the soft additive nebula planes
 * and the scene fog each read as a translucent slab / haze across the hero with
 * Bloom on; the Milky-Way wash + stars carry the depth instead.)
 */
export default function WorldEnvironment({ mobile }) {
  return (
    <>
      <ambientLight intensity={0.16} color="#9fb8ff" />
      <hemisphereLight intensity={0.14} color="#bcd2ff" groundColor="#05070e" />

      {/* Network-free reflection map — electric-blue key + cool fill, so the
          emissive text and metallic surfaces pick up on-brand highlights.
          frames={1} bakes it once for performance. With no `background` prop this
          only feeds reflections, never the visible backdrop — so it is NOT the
          slab (that was the additive Nebulae planes, now removed). Lightformers
          stay; the scene's real background is the Canvas `<color>` in SceneCanvas. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} color="#3b82f6" position={[-6, 5, -6]} scale={[12, 12, 1]} />
        <Lightformer intensity={1.1} color="#60a5fa" position={[6, -2, 4]} scale={[9, 9, 1]} />
        <Lightformer intensity={0.7} color="#dbe7ff" position={[0, 9, 3]} scale={[7, 7, 1]} />
      </Environment>

      {/* The deepest layer — a dim Milky-Way photo on an inverted sphere. Its own
          Suspense boundary so its texture load never blanks the rest of the world. */}
      <Suspense fallback={null}>
        <MilkyWay />
      </Suspense>

      {/* Base star field + a sparser layer of larger, brighter "hero" stars. */}
      <Stars radius={80} depth={50} count={mobile ? 1200 : 3000} factor={3.2} saturation={0} fade speed={0.6} />
      <Stars radius={90} depth={40} count={mobile ? 200 : 500} factor={7} saturation={0} fade speed={0.4} />

      {/* The traveller GLB suspends while it loads — given its own boundary so
          it's kept off the main world tree's render path and never blanks the canvas. */}
      <Suspense fallback={null}>
        <Traveler mobile={mobile} />
      </Suspense>

      {/* Spread wide and small across the whole flight path so it reads as
          depth between vantages, not clutter over the hero text. */}
      <SpaceDebris
        count={mobile ? 8 : 16}
        progress={calm}
        spread={[120, 70, 48]}
        scale={[0.1, 0.42]}
      />
    </>
  )
}
