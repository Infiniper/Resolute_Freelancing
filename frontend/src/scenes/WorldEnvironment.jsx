import { Environment, Lightformer, Stars } from '@react-three/drei'
import SpaceDebris from '../3d/SpaceDebris'

// SpaceDebris reads `progress.current` to gust with the storm; the persistent
// world keeps it calm and slow at all times.
const calm = { current: 0 }

/**
 * The persistent backdrop shared by every route — star field, drifting debris,
 * fog and a baked reflection map. It never unmounts, so flying between pages
 * feels like moving through one continuous space.
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

      {/* Big enough that the camera never flies out of it. */}
      <Stars
        radius={80}
        depth={50}
        count={mobile ? 1400 : 3400}
        factor={3.2}
        saturation={0}
        fade
        speed={0.6}
      />

      <SpaceDebris count={mobile ? 5 : 10} progress={calm} />
    </>
  )
}
