import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Draw a fake document onto a canvas → use as the paper texture
function makeDocTexture() {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 330
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#f2efe6'; ctx.fillRect(0, 0, 256, 330)            // page
  ctx.fillStyle = '#2f7fef'; ctx.fillRect(22, 24, 150, 20)          // blue header
  ctx.fillStyle = '#9aa3b2'
  for (let i = 0; i < 10; i++) ctx.fillRect(22, 66 + i * 22, i % 4 === 3 ? 110 : 212, 8) // text lines
  ctx.fillStyle = '#cdd5e0'; ctx.fillRect(22, 290, 100, 26)         // image/footer block
  const tex = new THREE.CanvasTexture(c)
  return tex
}

const KIND = {
  leaf:  { w: 0.30, h: 0.22, color: '#5f8a3a', area: 20, depth: 9 },
  paper: { w: 0.42, h: 0.55, color: '#ffffff', area: 20, depth: 9 },
  dust:  { w: 0.06, h: 0.06, color: '#cdd8ee', area: 22, depth: 11 },
}

export default function WindParticles({ kind = 'leaf', count = 80, progress }) {
  const meshRef = useRef()
  const cfg = KIND[kind]
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const docTex = useMemo(() => (kind === 'paper' ? makeDocTexture() : null), [kind])

  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * cfg.area * 2, y: (Math.random() - 0.5) * 14, z: (Math.random() - 0.5) * cfg.depth,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    spin: 0.6 + Math.random() * 2, drift: 0.6 + Math.random() * 1.2,
    swirlAmp: 0.4 + Math.random() * 1.3, swirlFreq: 0.5 + Math.random() * 1.5, phase: Math.random() * 6,
  })), [count, cfg.area, cfg.depth])

  useFrame((state, delta) => {
    const storm = progress.current
    const wind = 0.4 + storm * 9
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      s.x += wind * s.drift * delta
      const swirl = s.swirlAmp * (0.3 + storm)
      s.y += (Math.sin(t * s.swirlFreq + s.phase) * swirl - wind * 0.18) * delta
      s.z += Math.cos(t * s.swirlFreq * 0.8 + s.phase) * swirl * 0.5 * delta
      s.rx += s.spin * delta * (0.5 + storm * 4)
      s.rz += s.spin * delta * (0.5 + storm * 4)
      if (s.x > cfg.area) { s.x = -cfg.area; s.y = (Math.random() - 0.5) * 14 }
      if (s.y < -8) s.y = 8
      if (s.y > 8) s.y = -8
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
        map={docTex}
        side={THREE.DoubleSide}
        transparent
        opacity={kind === 'dust' ? 0.5 : 0.95}
        emissive={kind === 'dust' ? cfg.color : '#000000'}
        emissiveIntensity={kind === 'dust' ? 0.4 : 0}
      />
    </instancedMesh>
  )
}