import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpaceDebris({ count = 18, progress }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 16, z: (Math.random() - 0.5) * 10,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    spin: 0.2 + Math.random() * 0.7, drift: 0.4 + Math.random(),
    sx: 0.25 + Math.random() * 0.6, sy: 0.25 + Math.random() * 0.6, sz: 0.25 + Math.random() * 0.6, // lumpy
    swirlAmp: 0.3 + Math.random() * 0.9, swirlFreq: 0.3 + Math.random(), phase: Math.random() * 6,
  })), [count])

  useFrame((state, delta) => {
    const storm = progress.current
    const wind = 0.3 + storm * 7
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      s.x += wind * s.drift * delta
      s.y += (Math.sin(t * s.swirlFreq + s.phase) * s.swirlAmp * (0.3 + storm) - wind * 0.12) * delta
      s.rx += s.spin * delta; s.ry += s.spin * delta * 0.7; s.rz += s.spin * delta * 0.5
      if (s.x > 16) { s.x = -16; s.y = (Math.random() - 0.5) * 16 }
      if (s.y < -9) s.y = 9
      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.set(s.rx, s.ry, s.rz)
      dummy.scale.set(s.sx, s.sy, s.sz)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />     {/* detail 0 = chunky, faceted rock */}
      <meshStandardMaterial color="#6b6256" roughness={0.95} metalness={0.1} flatShading />
    </instancedMesh>
  )
}
