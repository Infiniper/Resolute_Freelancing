import { Suspense } from 'react'
import { Environment, Lightformer, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import SpaceDebris from '../3d/SpaceDebris'
import Nebulae from '../3d/Nebulae'
import Traveler from '../3d/Traveler'

// SpaceDebris reads `progress.current` to gust with the storm; the persistent
// world keeps it calm and slow at all times.
const calm = { current: 0 }

// The owner supplied an equirectangular Milky-Way image — used as a very dim,
// dark-tinted backdrop sphere (color multiplies the map down, fog fades it) so
// it adds deep-space texture without ever reducing text contrast. Procedural
// nebulae/stars do the heavy lifting; this is just extra richness.
function MilkyWay() {
  const tex = useTexture('/2k_stars_milky_way.jpg')
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[100, 40, 40]} />
      <meshBasicMaterial map={tex} color="#2a3550" side={THREE.BackSide} transparent opacity={0.4} depthWrite={false} />
    </mesh>
  )
}

/**
 * The persistent backdrop shared by every route — a rich, layered deep space:
 * a dim Milky-Way backdrop, two star layers, soft off-center nebulae, slow
 * debris, and a flying-saucer traveller that flies between vantages. It never
 * unmounts, so moving between pages feels like one continuous flight. Counts
 * drop on mobile. (No constellations / aurora — they read as flat shapes/slabs
 * across the hero; nebulae + stars carry the depth instead.)
 */
export default function WorldEnvironment({ mobile }) {
  return (
    <>
      <fog attach="fog" args={['#070b18', 28, 120]} />
      <ambientLight intensity={0.16} color="#9fb8ff" />
      <hemisphereLight intensity={0.14} color="#bcd2ff" groundColor="#05070e" />

      {/* Network-free reflection map — electric-blue key + cool fill, so the
          emissive text and metallic surfaces pick up on-brand highlights.
          frames={1} bakes it once for performance. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#04060d']} />
        <Lightformer intensity={2.2} color="#3b82f6" position={[-6, 5, -6]} scale={[12, 12, 1]} />
        <Lightformer intensity={1.1} color="#60a5fa" position={[6, -2, 4]} scale={[9, 9, 1]} />
        <Lightformer intensity={0.7} color="#dbe7ff" position={[0, 9, 3]} scale={[7, 7, 1]} />
      </Environment>

      {/* Base star field + a sparser layer of larger, brighter "hero" stars. */}
      <Stars radius={80} depth={50} count={mobile ? 1200 : 3000} factor={3.2} saturation={0} fade speed={0.6} />
      <Stars radius={90} depth={40} count={mobile ? 200 : 500} factor={7} saturation={0} fade speed={0.4} />

      <Nebulae count={mobile ? 3 : 5} />

      {/* Suspending assets (texture + GLB) — kept off the main world tree's
          render path with their own boundary so they never blank the canvas. */}
      <Suspense fallback={null}>
        <MilkyWay />
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
