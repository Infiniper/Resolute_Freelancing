import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const KIND = {
  leaf:  { w: 0.30, h: 0.22, color: '#5f8a3a', area: 20, depth: 9 },
  paper: { w: 0.44, h: 0.58, color: '#e9e5d8', area: 20, depth: 9 },
  dust:  { w: 0.06, h: 0.06, color: '#cdd8ee', area: 22, depth: 11 },
}

export default function WindParticles({ kind = 'leaf', count = 80, progress }) {
  const meshRef = useRef()
  const cfg = KIND[kind]
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x:  (Math.random() - 0.5) * cfg.area * 2,
    y:  (Math.random() - 0.5) * 14,
    z:  (Math.random() - 0.5) * cfg.depth,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    spin:  0.6 + Math.random() * 2,
    drift: 0.6 + Math.random() * 1.2,
    swirlAmp:  0.4 + Math.random() * 1.3,   // how much it sways
    swirlFreq: 0.5 + Math.random() * 1.5,   // how fast it sways
    phase: Math.random() * 6,
  })), [count, cfg.area, cfg.depth])

  useFrame((state, delta) => {
    const storm = progress.current          // 0 calm → 1 fury
    const wind  = 0.4 + storm * 9            // wind speed ramps with scroll
    const t = state.clock.elapsedTime

    seeds.forEach((s, i) => {
      s.x += wind * s.drift * delta                                    // blow right
      const swirl = s.swirlAmp * (0.3 + storm)
      s.y += (Math.sin(t * s.swirlFreq + s.phase) * swirl - wind * 0.18) * delta  // sway + sink
      s.z += Math.cos(t * s.swirlFreq * 0.8 + s.phase) * swirl * 0.5 * delta      // depth sway
      s.rx += s.spin * delta * (0.5 + storm * 4)   // tumble (faster in storm)
      s.rz += s.spin * delta * (0.5 + storm * 4)

      if (s.x >  cfg.area) { s.x = -cfg.area; s.y = (Math.random() - 0.5) * 14 }  // wrap around
      if (s.y < -8) s.y = 8
      if (s.y >  8) s.y = -8

      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.set(s.rx, s.ry, s.rz)
      dummy.scale.set(cfg.w, cfg.h, 1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={cfg.color}
        side={THREE.DoubleSide}
        transparent
        opacity={kind === 'dust' ? 0.5 : 0.95}
        emissive={kind === 'dust' ? cfg.color : '#000000'}
        emissiveIntensity={kind === 'dust' ? 0.4 : 0}
      />
    </instancedMesh>
  )
}