import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'

// Bake a soft, vertically-faded noise field into a tiling texture using
// simplex-noise (already a dependency). Drives a drifting aurora ribbon — no
// runtime shader, so nothing can fail to compile.
function makeAuroraTexture() {
  const noise = createNoise2D()
  const W = 128, H = 128
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(W, H)
  for (let y = 0; y < H; y++) {
    const vFade = 1 - Math.abs(y / H - 0.5) * 2 // fade top & bottom edges
    for (let x = 0; x < W; x++) {
      const v = ((noise(x / 30, y / 30) + 1) / 2) * ((noise(x / 8, y / 14) + 1) / 2)
      const i = (y * W + x) * 4
      img.data[i] = 120
      img.data[i + 1] = 200
      img.data[i + 2] = 255
      img.data[i + 3] = Math.pow(v, 1.5) * 255 * vFade
    }
  }
  ctx.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

/**
 * A large, slowly drifting aurora ribbon — additive, very low opacity, far
 * back. Subtle blue/cyan colour wash that adds life to the deep sky.
 */
export default function Aurora({ position = [0, -12, -45], scale = [140, 44, 1] }) {
  const tex = useMemo(makeAuroraTexture, [])
  const matRef = useRef()

  useEffect(() => () => tex.dispose(), [tex])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    tex.offset.x = t * 0.01
    if (matRef.current) matRef.current.opacity = 0.06 + Math.sin(t * 0.2) * 0.02
  })

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={matRef}
        map={tex}
        transparent
        opacity={0.07}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        fog={false}
      />
    </mesh>
  )
}
