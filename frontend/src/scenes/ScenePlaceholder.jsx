import { Float } from '@react-three/drei'

// Temporary focal object for routes whose real 3D content lands in Phase C.
// Gives the CameraRig something to fly to so navigation can be verified.
export default function ScenePlaceholder({ color = '#3b82f6' }) {
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.0}>
      <mesh>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.3}
          flatShading
        />
      </mesh>
    </Float>
  )
}
