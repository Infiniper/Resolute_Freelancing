import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { WIND, stormIntensity } from "../data/stormConfig";

export default function Asteroids({ url = "/models/Asteroid.glb", count = 9, progress }) {
  const gltf = useGLTF(url);
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pull the first mesh's geometry + material out of the model so we can instance it
  const { geometry, material } = useMemo(() => {
    let g = null, m = null;
    gltf.scene.traverse((o) => { if (o.isMesh && !g) { g = o.geometry; m = o.material; } });
    return { geometry: g, material: m };
  }, [gltf]);

  // z is kept strictly behind the title (which sits at z≈0, camera at z=14) so
  // asteroids never render in front of the wordmark — only deeper in the storm.
  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 16, z: -3 - Math.random() * 7,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6, spin: 0.1 + Math.random() * 0.35,
    drift: 0.4 + Math.random() * 0.9, scale: 0.16 + Math.random() * 0.5,
    swirlAmp: 0.3 + Math.random() * 0.8, swirlFreq: 0.3 + Math.random(), phase: Math.random() * 6,
  })), [count]);

  useFrame((s) => {
    if (!meshRef.current) return;
    const intensity = stormIntensity(progress.current);
    const wind = 0.3 + intensity * 6;
    const t = s.clock.elapsedTime;
    seeds.forEach((p, i) => {
      p.x += WIND.x * wind * p.drift * 0.016;
      p.y += (Math.sin(t * p.swirlFreq + p.phase) * p.swirlAmp * (0.3 + intensity) + WIND.y * wind * 0.4) * 0.016;
      p.rx += p.spin * 0.016; p.ry += p.spin * 0.016 * 0.6; p.rz += p.spin * 0.016 * 0.4;
      if (p.x < -16) { p.x = 16; p.y = (Math.random() - 0.5) * 16; }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!geometry) return null;
  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}