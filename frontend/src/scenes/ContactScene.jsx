import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

// The calm after the storm — a single slow halo ring around a soft glowing core.
export default function ContactScene() {
  const ring = useRef()
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.06
  })
  return (
    <Float speed={0.7} floatIntensity={0.6} rotationIntensity={0.15}>
      <mesh ref={ring} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[3.1, 0.035, 16, 140]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.3} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#1e63d6"
          emissiveIntensity={0.7}
          metalness={0.6}
          roughness={0.3}
          flatShading
        />
      </mesh>
    </Float>
  )
}
