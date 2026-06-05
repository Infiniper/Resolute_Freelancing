import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'

// Push each vertex out by layered noise → a lumpy rock instead of a clean icosahedron
function makeRockGeometry(noise, seed) {
  const geo = new THREE.IcosahedronGeometry(1, 4)   // detail 4 = enough verts to deform
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize()
    const n =
      0.6 * noise(v.x * 1.2 + seed, v.y * 1.2 + seed, v.z * 1.2 + seed) +
      0.3 * noise(v.x * 2.6 + seed, v.y * 2.6 + seed, v.z * 2.6 + seed) +
      0.15 * noise(v.x * 5.5 + seed, v.y * 5.5 + seed, v.z * 5.5 + seed)
    v.multiplyScalar(1 + n * 0.4)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

function Rock({ geom, progress, spread, scale }) {
  const ref = useRef()
  const [sx, sy, sz] = spread
  const [smin, smax] = scale
  const st = useMemo(() => ({
    x: (Math.random() - 0.5) * sx, y: (Math.random() - 0.5) * sy, z: (Math.random() - 0.5) * sz,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    spin: 0.1 + Math.random() * 0.35, drift: 0.4 + Math.random() * 0.9,
    scale: smin + Math.random() * (smax - smin), kx: 0.7 + Math.random() * 0.6, ky: 0.7 + Math.random() * 0.6,
    swirlAmp: 0.3 + Math.random() * 0.8, swirlFreq: 0.3 + Math.random(), phase: Math.random() * 6,
  }), [sx, sy, sz, smin, smax])

  useFrame((s, delta) => {
    const storm = progress.current
    const wind = 0.3 + storm * 6
    st.x += st.drift * wind * delta
    st.y += (Math.sin(s.clock.elapsedTime * st.swirlFreq + st.phase) * st.swirlAmp * (0.3 + storm) - wind * 0.1) * delta
    st.rx += st.spin * delta; st.ry += st.spin * delta * 0.6; st.rz += st.spin * delta * 0.4
    if (st.x > sx / 2) { st.x = -sx / 2; st.y = (Math.random() - 0.5) * sy }
    if (st.y < -sy / 2) st.y = sy / 2
    const m = ref.current
    m.position.set(st.x, st.y, st.z)
    m.rotation.set(st.rx, st.ry, st.rz)
    m.scale.set(st.scale * st.kx, st.scale * st.ky, st.scale)
  })

  return (
    <mesh ref={ref} geometry={geom}>
      <meshStandardMaterial color="#5c5349" roughness={1} metalness={0.05} flatShading />
    </mesh>
  )
}

/**
 * Procedural rock field. `spread` controls the volume it fills and `scale` the
 * size range — the persistent world spreads debris wide and small across the
 * whole flight path; the storm uses a tighter, larger cluster.
 */
export default function SpaceDebris({ count = 11, progress, spread = [30, 16, 7], scale = [0.16, 0.66] }) {
  const geoms = useMemo(() => {
    const noise = createNoise3D()
    return Array.from({ length: 4 }, (_, i) => makeRockGeometry(noise, i * 13 + 1))  // 4 unique rock shapes
  }, [])
  return Array.from({ length: count }, (_, i) =>
    <Rock key={i} geom={geoms[i % geoms.length]} progress={progress} spread={spread} scale={scale} />)
}
