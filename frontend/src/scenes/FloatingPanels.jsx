import { useMemo } from 'react'
import { Float, Edges } from '@react-three/drei'

/**
 * A drifting cluster of dark-glass panels with glowing rims (the rims bloom).
 * Pure atmosphere — the readable page content lives in the DOM in front. Each
 * page tints/arranges these differently to give its vantage a distinct feel.
 */
export default function FloatingPanels({
  count = 6,
  color = '#3b82f6',
  area = [12, 8, 7],   // scatter volume (x, y, z)
  size = [1.9, 2.5],   // base panel size (w, h)
}) {
  const [ax, ay, az] = area
  const [sw, sh] = size

  const panels = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: [
          (Math.random() - 0.5) * ax,
          (Math.random() - 0.5) * ay,
          (Math.random() - 0.5) * az - 1.5,
        ],
        rotY: (Math.random() - 0.5) * 0.6,
        rotZ: (Math.random() - 0.5) * 0.16,
        w: sw * (0.8 + Math.random() * 0.6),
        h: sh * (0.8 + Math.random() * 0.5),
        speed: 0.7 + Math.random() * 0.9,
      })),
    [count, ax, ay, az, sw, sh]
  )

  return panels.map((p, i) => (
    <Float key={i} speed={p.speed} rotationIntensity={0.3} floatIntensity={0.9}>
      <group position={p.pos} rotation={[0, p.rotY, p.rotZ]}>
        <mesh>
          <boxGeometry args={[p.w, p.h, 0.06]} />
          <meshStandardMaterial
            color="#0b1020"
            metalness={0.5}
            roughness={0.4}
            transparent
            opacity={0.45}
            envMapIntensity={1.2}
          />
          <Edges color={color} />
        </mesh>
      </group>
    </Float>
  ))
}
