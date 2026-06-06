import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

// A soft, irregular cloud baked once into a canvas texture (overlapping radial
// gradients) — same trick as the storm's doc/dot textures, no downloads.
function makeNebulaTexture([r, g, b]) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  for (let i = 0; i < 5; i++) {
    const x = 128 + (Math.random() - 0.5) * 120
    const y = 128 + (Math.random() - 0.5) * 120
    const rad = 60 + Math.random() * 70
    const grd = ctx.createRadialGradient(x, y, 0, x, y, rad)
    grd.addColorStop(0, `rgba(${r},${g},${b},0.35)`)
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 256, 256)
  }
  return new THREE.CanvasTexture(c)
}

// electric-blue / indigo / teal / violet
const TINTS = [[59, 130, 246], [99, 102, 241], [20, 184, 166], [139, 92, 246], [37, 99, 235]]

/**
 * Big, faint, additive nebula clouds far in the background. Low opacity + far
 * placement so they add colour and depth without ever competing with the text.
 */
export default function Nebulae({ count = 5 }) {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      tex: makeNebulaTexture(TINTS[i % TINTS.length]),
      pos: [(Math.random() - 0.5) * 120, (Math.random() - 0.5) * 70, -30 - Math.random() * 50],
      rot: (Math.random() - 0.5) * 0.6,
      size: 34 + Math.random() * 44,
      op: 0.1 + Math.random() * 0.14,
    })),
    [count],
  )

  // Free the baked textures if the set changes (e.g. mobile toggle) or unmounts.
  useEffect(() => () => items.forEach((n) => n.tex.dispose()), [items])

  return items.map((n, i) => (
    <mesh key={i} position={n.pos} rotation={[0, 0, n.rot]}>
      <planeGeometry args={[n.size, n.size]} />
      <meshBasicMaterial
        map={n.tex}
        transparent
        opacity={n.op}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  ))
}
