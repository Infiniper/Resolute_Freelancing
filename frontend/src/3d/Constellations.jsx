import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makeConstellation() {
  const n = 4 + Math.floor(Math.random() * 4)
  const pts = Array.from({ length: n }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4,
  ))
  const linePts = pts.flatMap((p, i) => (i ? [pts[i - 1], p] : []))
  return { pts, geo: new THREE.BufferGeometry().setFromPoints(linePts) }
}

/**
 * A handful of faint blue constellations — glowing points joined by lines that
 * gently twinkle. On-brand: "resolute" = fixed, unmoving stars. Kept far and
 * low-contrast so they never fight the text.
 */
export default function Constellations({ count = 4 }) {
  const groups = useMemo(
    () => Array.from({ length: count }, () => ({
      c: makeConstellation(),
      pos: [(Math.random() - 0.5) * 90, (Math.random() - 0.5) * 50, -20 - Math.random() * 30],
      phase: Math.random() * 6,
    })),
    [count],
  )
  const lineRefs = useRef([])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    groups.forEach((g, i) => {
      const m = lineRefs.current[i]
      if (m) m.material.opacity = 0.12 + Math.abs(Math.sin(t * 0.5 + g.phase)) * 0.22
    })
  })

  return groups.map((g, i) => (
    <group key={i} position={g.pos}>
      <lineSegments ref={(el) => { lineRefs.current[i] = el }} geometry={g.c.geo}>
        <lineBasicMaterial color="#6ea8ff" transparent opacity={0.2} fog={false} />
      </lineSegments>
      {g.c.pts.map((p, j) => (
        <mesh key={j} position={p}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#cfe0ff" fog={false} />
        </mesh>
      ))}
    </group>
  ))
}
