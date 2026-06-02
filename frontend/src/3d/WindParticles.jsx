import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Per-kind appearance
const KIND = {
  leaf:  { size: 0.20, color: '#5a7d3a', area: 16 },
  paper: { size: 0.34, color: '#e8e4d8', area: 16 },
}

export default function WindParticles({ kind = 'leaf', count = 70, progress }) {
  const meshRef = useRef()
  const cfg     = KIND[kind]
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  // Random starting state for each particle
  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x:  (Math.random() - 0.5) * cfg.area * 2,
    y:  (Math.random() - 0.5) * 11,
    z:  (Math.random() - 0.5) * 6,
    rx: Math.random() * Math.PI,
    ry: Math.random() * Math.PI,
    rz: Math.random() * Math.PI,
    spin:  0.5 + Math.random() * 1.5,
    drift: 0.5 + Math.random(),
  })), [count, cfg.area])

  useFrame((state, delta) => {
    const storm = progress.current          // 0 (calm) → 1 (fury)
    const wind  = 0.3 + storm * 6            // wind speed scales with scroll
    seeds.forEach((s, i) => {
      s.x += wind * s.drift * delta          // blow right
      s.y -= wind * 0.25 * delta             // drift down
      s.rx += s.spin * delta * (0.4 + storm * 3)   // tumble faster in storm
      s.rz += s.spin * delta * (0.4 + storm * 3)
      if (s.x > cfg.area)  { s.x = -cfg.area; s.y = (Math.random() - 0.5) * 11 }  // wrap
      if (s.y < -6) s.y = 6
      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.set(s.rx, s.ry, s.rz)
      dummy.scale.setScalar(cfg.size)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color={cfg.color} side={THREE.DoubleSide} transparent opacity={0.9} />
    </instancedMesh>
  )
}