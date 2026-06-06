import { useMemo } from 'react'
import { Float } from '@react-three/drei'

/**
 * A small drifting cluster of faceted shards that catch the light — a decorative
 * accent (never plain boxes). Cheap octahedrons, gently floating.
 */
export default function Crystals({
  count = 5,
  color = '#60a5fa',
  area = [3, 3, 2],
  position = [0, 0, 0],
}) {
  const [ax, ay, az] = area
  const shards = useMemo(
    () => Array.from({ length: count }, () => ({
      p: [(Math.random() - 0.5) * ax, (Math.random() - 0.5) * ay, (Math.random() - 0.5) * az],
      r: [Math.random() * 6, Math.random() * 6, Math.random() * 6],
      s: 0.2 + Math.random() * 0.5,
      speed: 0.6 + Math.random() * 0.8,
    })),
    [count, ax, ay, az]
  )

  return (
    <group position={position}>
      {shards.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={0.6} floatIntensity={0.8}>
          <mesh position={s.p} rotation={s.r} scale={s.s}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.7} roughness={0.15} flatShading />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
