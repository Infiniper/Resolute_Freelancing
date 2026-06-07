import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import GLBModel from '../3d/GLBModel'
import { MODELS } from '../3d/models'

// A faint constellation of glowing points joined by lines — on-brand, since
// "resolute" means fixed, unmoving (like the stars).
function Constellation({ position }) {
  const { points, lineGeo } = useMemo(() => {
    const pts = Array.from({ length: 6 }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1.5,
    ))
    const lineGeo = new THREE.BufferGeometry().setFromPoints(
      pts.flatMap((p, i) => (i ? [pts[i - 1], p] : [])),
    )
    return { points: pts, lineGeo }
  }, [])

  // Dispose the hand-built line geometry when About unmounts.
  useEffect(() => () => lineGeo.dispose(), [lineGeo])

  return (
    <group position={position}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.4} />
      </lineSegments>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#9ec5ff" />
        </mesh>
      ))}
    </group>
  )
}

/**
 * About = an astronaut drifting and tumbling in zero-g (hover spins it up,
 * click pings it) plus a small "team" constellation. Right-hand negative space,
 * behind the cards.
 */
export default function AboutScene({ mobile }) {
  return (
    <group>
      <GLBModel
        url={MODELS.astronaut}
        position={mobile ? [1.5, -5.5, -6] : [7, 1.5, -2.5]}
        scale={mobile ? 0.6 : 1.1}
        spin={[0.1, 0.25, 0.05]}
      />
      {!mobile && <Constellation position={[-13.5, 1.5, -2]} />}
    </group>
  )
}
