import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WIND, stormIntensity } from "../data/stormConfig";

function makeDot() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(180,210,255,0.6)");
  g.addColorStop(1, "rgba(180,210,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function GlowParticles({ count = 600, progress }) {
  const ref = useRef();
  const matRef = useRef();
  const tex = useMemo(makeDot, []);

  const { positions, data } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 44;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 14;
      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      data.push({ baseY: y, speed: 0.5 + Math.random() * 1.5, swirlAmp: 0.3 + Math.random() * 1.2, swirlFreq: 0.3 + Math.random() * 1.2, phase: Math.random() * 6 });
    }
    return { positions, data };
  }, [count]);

  useFrame((s) => {
    const intensity = stormIntensity(progress.current);
    const wind = 0.6 + intensity * 9;
    const t = s.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += WIND.x * wind * data[i].speed * 0.016;
      if (arr[i * 3] < -22) arr[i * 3] = 22;
      arr[i * 3 + 1] = data[i].baseY + Math.sin(t * data[i].swirlFreq + data[i].phase) * data[i].swirlAmp * (0.4 + intensity);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    if (matRef.current) matRef.current.opacity = 0.25 + intensity * 0.55;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} map={tex} color="#bcd8ff" size={0.22} transparent opacity={0.4}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}