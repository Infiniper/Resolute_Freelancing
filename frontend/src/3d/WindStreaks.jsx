import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function WindStreaks({ count = 70, progress }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 32, y: (Math.random() - 0.5) * 16, z: (Math.random() - 0.5) * 12,
    len: 1.5 + Math.random() * 3.5, drift: 1 + Math.random() * 1.6,
    swirlAmp: 0.6 + Math.random() * 1.4, swirlFreq: 0.4 + Math.random() * 1.2, phase: Math.random() * 6,
  })), [count])

  useFrame((state, delta) => {
    const storm = progress.current
    const wind = 1 + storm * 14
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      s.x += wind * s.drift * delta
      s.y += Math.sin(t * s.swirlFreq + s.phase) * s.swirlAmp * (0.3 + storm) * delta
      if (s.x > 17) { s.x = -17; s.y = (Math.random() - 0.5) * 16 }
      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.set(0, 0, Math.sin(t * s.swirlFreq + s.phase) * 0.35) // tilt follows the swirl
      dummy.scale.set(s.len * (0.6 + storm), 0.025 + storm * 0.02, 1)       // longer + thicker in storm
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#9fc0ff" transparent opacity={0.14}
        blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}