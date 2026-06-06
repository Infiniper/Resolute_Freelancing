import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WIND, stormIntensity } from "../data/stormConfig";

function makeDocTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 330;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#f2efe6"; ctx.fillRect(0, 0, 256, 330);
  ctx.fillStyle = "#2f7fef"; ctx.fillRect(22, 24, 150, 20);
  ctx.fillStyle = "#9aa3b2";
  for (let i = 0; i < 10; i++) ctx.fillRect(22, 66 + i * 22, i % 4 === 3 ? 110 : 212, 8);
  ctx.fillStyle = "#cdd5e0"; ctx.fillRect(22, 290, 100, 26);
  return new THREE.CanvasTexture(c);
}

export default function WindParticles({ count = 16, progress }) {
  const meshRef = useRef();
  const matRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const docTex = useMemo(makeDocTexture, []);
  const seeds = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 14, z: (Math.random() - 0.5) * 9,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    spin: 0.6 + Math.random() * 2, drift: 0.6 + Math.random() * 1.2,
    swirlAmp: 0.4 + Math.random() * 1.3, swirlFreq: 0.5 + Math.random() * 1.5, phase: Math.random() * 6,
  })), [count]);

  useFrame((s) => {
    const intensity = stormIntensity(progress.current);
    const wind = 0.4 + intensity * 8;
    const t = s.clock.elapsedTime;
    seeds.forEach((p, i) => {
      p.x += WIND.x * wind * p.drift * 0.016;
      const swirl = p.swirlAmp * (0.3 + intensity);
      p.y += (Math.sin(t * p.swirlFreq + p.phase) * swirl + WIND.y * wind * 0.5) * 0.016;
      p.rx += p.spin * 0.016 * (0.5 + intensity * 4);
      p.rz += p.spin * 0.016 * (0.5 + intensity * 4);
      if (p.x < -20) { p.x = 20; p.y = (Math.random() - 0.5) * 14; }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.set(0.62, 0.8, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (matRef.current) matRef.current.opacity = 0.2 + intensity * 0.7;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial ref={matRef} color="#ffffff" map={docTex} side={THREE.DoubleSide} transparent opacity={0.6} />
    </instancedMesh>
  );
}