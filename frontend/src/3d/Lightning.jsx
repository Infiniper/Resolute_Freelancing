import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Lightning({ progress }) {
  const flash = useRef(0)
  const lightRef = useRef()

  // one reusable Line we re-shape on each strike
  const bolt = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(50 * 3), 3))
    const mat = new THREE.LineBasicMaterial({ color: '#eaf2ff', transparent: true, opacity: 0 })
    return new THREE.Line(geom, mat)
  }, [])

  const strike = () => {
    const pos = bolt.geometry.attributes.position
    let cx = (Math.random() - 0.5) * 26
    let cy = 9
    for (let i = 0; i < 50; i++) {
      pos.setXYZ(i, cx, cy, (Math.random() - 0.5) * 5)
      cx += (Math.random() - 0.5) * 2.4   // horizontal jitter = jagged
      cy -= 18 / 50
    }
    pos.needsUpdate = true
    flash.current = 1
  }

  useFrame((state, delta) => {
    const storm = progress.current
    if (Math.random() < 0.006 + storm * 0.03) strike()   // random, more frequent in the storm
    flash.current = Math.max(0, flash.current - delta * 6)
    bolt.material.opacity = flash.current
    if (lightRef.current) lightRef.current.intensity = flash.current * 14
  })

  return (
    <>
      <primitive object={bolt} />
      <directionalLight ref={lightRef} position={[0, 5, 8]} intensity={0} color="#dbe7ff" />
    </>
  )
}