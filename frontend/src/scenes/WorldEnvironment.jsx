import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { Environment, Lightformer, Stars, Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import SpaceDebris from '../3d/SpaceDebris'

// SpaceDebris reads `progress.current` to gust with the storm; the persistent
// world keeps it calm and slow at all times.
const calm = { current: 0 }

// The puff sprite for the volumetric clouds, baked locally (overlapping white
// radial gradients on a canvas → data URL) instead of drei's default texture,
// which is fetched from a CDN at runtime — this repo stays network-free. White
// so each <Cloud>'s `color` tints it; lumpy lobes so the edges read wispy.
function makePuffDataUrl() {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const blob = (x, y, r, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(255,255,255,${a})`)
    g.addColorStop(0.55, `rgba(255,255,255,${a * 0.4})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
  }
  blob(128, 128, 110, 0.5)                                  // core
  blob(82, 104, 64, 0.32); blob(176, 110, 58, 0.3)          // side lobes
  blob(120, 170, 70, 0.28); blob(60, 160, 44, 0.2); blob(190, 168, 40, 0.18) // wisps
  return c.toDataURL()
}
const CLOUD_PUFF_URL = makePuffDataUrl()

// The storm-sky cloud banks (owner reference: public/clouds.png, owner-tuned
// spec): five volumetric, slow-roiling masses spread across the full hero view
// — x −14…+14, y −4…+6, z −5…−14, no two sharing a similar x AND y — in a
// deliberate size mix: one large, two medium, two small, so the sky reads as a
// real storm front rather than a row of equal puffs. Seeds are randomized at
// load (every visit gets fresh cloud shapes) and drift speeds vary per bank
// (0.12–0.25) so they never roil in lockstep. Positions are framed for the
// Home vantage (camera [0, 0.6, 14] → origin) and sit behind the wordmark in z
// — the renderOrder-10 letters always composite on top.
// OWNER: nudge per-bank pos / opacity to taste against the reference.
const seed = () => Math.floor(Math.random() * 10000)
const CLOUD_BANKS = [
  { seed: seed(), pos: [-2, 4, -13],  bounds: [22, 7, 6], volume: 18, segments: 24, color: '#2a3550', opacity: 0.42, speed: 0.12 }, // large — wide mass above/behind the title
  { seed: seed(), pos: [-13, -1, -9], bounds: [14, 5, 4], volume: 11, segments: 14, color: '#1e2840', opacity: 0.42, speed: 0.18 }, // medium — mid-left
  { seed: seed(), pos: [12, 2, -11],  bounds: [14, 5, 4], volume: 10, segments: 14, color: '#2a3550', opacity: 0.40, speed: 0.15 }, // medium — mid-right
  { seed: seed(), pos: [7, -4, -6],   bounds: [8, 3, 3],  volume: 5,  segments: 8,  color: '#1e2840', opacity: 0.44, speed: 0.22 }, // small — low-right, nearest
  { seed: seed(), pos: [-7, 6, -7],   bounds: [8, 3, 3],  volume: 6,  segments: 8,  color: '#2a3550', opacity: 0.38, speed: 0.25 }, // small — high-left
]

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
 * Milky-Way photo-sphere deepest, two volumetric storm-cloud masses, two star
 * layers, and slow drifting debris. It never unmounts, so moving between pages
 * feels like one continuous flight. Counts drop on mobile. (No constellations /
 * aurora / nebulae / fog — those read as flat shapes / haze across the hero;
 * the clouds here are drei volumetric `<Clouds>`, built to the owner's
 * reference shot `public/clouds.png` — R13. The owner re-diagnosed the old hero
 * slab as the magnified flying-saucer `Traveler` — removed in R11 — so soft
 * background clouds are cleared for use; `Traveler` stays out, awaiting a
 * specific scene, and `src/3d/Traveler.jsx` / `src/3d/Nebulae.jsx` remain in
 * the tree unused.)
 */
export default function WorldEnvironment({ mobile }) {
  return (
    <>
      <ambientLight intensity={0.16} color="#9fb8ff" />
      <hemisphereLight intensity={0.14} color="#bcd2ff" groundColor="#05070e" />

      {/* Network-free reflection map — electric-blue key + cool fill, so the
          emissive text and metallic surfaces pick up on-brand highlights.
          frames={1} bakes it once for performance. With no `background` prop this
          only feeds reflections, never the visible backdrop — it can't paint a
          slab. Lightformers stay; the scene's real background is the Canvas
          `<color>` in SceneCanvas. */}
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
      <Stars radius={80} depth={50} count={mobile ? 2200 : 5200} factor={3.2} saturation={0} fade speed={0.6} />
      <Stars radius={90} depth={40} count={mobile ? 380 : 900} factor={7} saturation={0} fade speed={0.4} />

      {/* Volumetric storm sky — the CLOUD_BANKS above. MeshBasic (unlit) so
          the dark tints read literally under the world's dim lights; their own
          Suspense so the puff-texture load never blanks the world (same
          treatment as MilkyWay). */}
      <Suspense fallback={null}>
        <Clouds material={THREE.MeshBasicMaterial} texture={CLOUD_PUFF_URL} limit={96} frustumCulled={false}>
          {CLOUD_BANKS.map((b, i) => (
            <Cloud
              key={i}
              seed={b.seed} segments={mobile ? Math.ceil(b.segments / 2) : b.segments}
              bounds={b.bounds} volume={b.volume}
              position={b.pos}
              color={b.color} opacity={b.opacity} speed={b.speed}
            />
          ))}
        </Clouds>
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
