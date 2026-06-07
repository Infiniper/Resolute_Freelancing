import { useRef, useMemo, useCallback, useEffect, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { WIND, stormIntensity, bandY } from "../data/stormConfig";
import { playCrack } from "./sfx";

// Caps on live debris — fixed-capacity pools double as the performance cap.
const FRAG_CAP = 30;
const SPARK_CAP = 80;

const _m = new THREE.Object3D(); // scratch matrix composer
const _v = new THREE.Vector3();  // scratch direction

function makeSeed() {
  return {
    // Banded + behind (like the other hero particles) so it never crosses the
    // letters; only x drifts, y bobs gently within its band.
    x: (Math.random() - 0.5) * 30, baseY: bandY(), curY: 0, z: -3 - Math.random() * 7,
    rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6,
    spin: 0.1 + Math.random() * 0.35, drift: 0.4 + Math.random() * 0.9,
    scale: 0.18 + Math.random() * 0.5,
    swirlAmp: 0.3 + Math.random() * 0.6, swirlFreq: 0.3 + Math.random(), phase: Math.random() * 6,
    alive: true, respawn: 0,
  };
}

/**
 * The hero asteroid field — and a toy: click / tap an asteroid and it shatters
 * into 3–5 smaller fragments that fly apart and spin, with a quick spark burst
 * and a subtle crack. Fragments shrink and despawn in ~2s; the broken asteroid
 * slowly respawns so the field stays fun. Fragment + spark pools are fixed-size,
 * so the total live count is capped. Three instanced meshes (base / fragments /
 * sparks) keep it cheap.
 */
export default function Asteroids({ url = "/models/Asteroid.glb", count = 5, progress }) {
  const gltf = useGLTF(url);
  const baseRef = useRef();
  const fragRef = useRef();
  const sparkRef = useRef();

  // Pull the first mesh's geometry + material out of the model (shared/cached by
  // useGLTF — never disposed here). Fragments reuse them; sparks get their own.
  const { geometry, material } = useMemo(() => {
    let g = null, m = null;
    gltf.scene.traverse((o) => { if (o.isMesh && !g) { g = o.geometry; m = o.material; } });
    return { geometry: g, material: m };
  }, [gltf]);

  const sparkGeo = useMemo(() => new THREE.SphereGeometry(0.05, 6, 6), []);
  const sparkMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#dbe9ff", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    [],
  );
  useEffect(() => () => { sparkGeo.dispose(); sparkMat.dispose(); }, [sparkGeo, sparkMat]);

  const seeds = useMemo(() => Array.from({ length: count }, makeSeed), [count]);
  const frags = useMemo(() => Array.from({ length: FRAG_CAP }, () => ({ active: false })), []);
  const sparks = useMemo(() => Array.from({ length: SPARK_CAP }, () => ({ active: false })), []);
  const fragHead = useRef(0);
  const sparkHead = useRef(0);

  const shatter = useCallback((i) => {
    const p = seeds[i];
    if (!p || !p.alive) return;
    p.alive = false;
    p.respawn = performance.now() / 1000 + 4 + Math.random() * 3; // field replenishes

    const n = 3 + Math.floor(Math.random() * 3); // 3–5 fragments
    for (let k = 0; k < n; k++) {
      const f = frags[fragHead.current];
      fragHead.current = (fragHead.current + 1) % FRAG_CAP;
      _v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      const speed = 2 + Math.random() * 3;
      f.active = true;
      f.x = p.x; f.y = p.curY; f.z = p.z;
      f.vx = _v.x * speed; f.vy = _v.y * speed; f.vz = _v.z * speed * 0.4; // shallow z so they stay behind
      f.rx = Math.random() * 6; f.ry = Math.random() * 6; f.rz = Math.random() * 6;
      f.vrx = (Math.random() - 0.5) * 8; f.vry = (Math.random() - 0.5) * 8; f.vrz = (Math.random() - 0.5) * 8;
      f.scale0 = p.scale * (0.35 + Math.random() * 0.3);
      f.ttl = 1.6 + Math.random() * 0.6; f.life = f.ttl;
    }

    const sn = 8 + Math.floor(Math.random() * 6); // spark burst
    for (let k = 0; k < sn; k++) {
      const sp = sparks[sparkHead.current];
      sparkHead.current = (sparkHead.current + 1) % SPARK_CAP;
      _v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      const speed = 4 + Math.random() * 5;
      sp.active = true;
      sp.x = p.x; sp.y = p.curY; sp.z = p.z;
      sp.vx = _v.x * speed; sp.vy = _v.y * speed; sp.vz = _v.z * speed * 0.4;
      sp.scale0 = 0.6 + Math.random() * 0.8;
      sp.ttl = 0.3 + Math.random() * 0.3; sp.life = sp.ttl;
    }

    playCrack();
  }, [seeds, frags, sparks]);

  // Mobile taps reach the field through the canvas tap-raycaster.
  useEffect(() => {
    if (baseRef.current) baseRef.current.userData.onTap = (hit) => { if (hit.instanceId != null) shatter(hit.instanceId); };
  }, [shatter]);

  // Hide the (initially empty) fragment + spark pools before the first paint, so
  // they never flash as a clump of full-size instances at the origin.
  useLayoutEffect(() => {
    _m.position.set(0, 0, 0); _m.rotation.set(0, 0, 0); _m.scale.setScalar(0); _m.updateMatrix();
    for (let i = 0; i < FRAG_CAP; i++) fragRef.current?.setMatrixAt(i, _m.matrix);
    for (let i = 0; i < SPARK_CAP; i++) sparkRef.current?.setMatrixAt(i, _m.matrix);
    if (fragRef.current) fragRef.current.instanceMatrix.needsUpdate = true;
    if (sparkRef.current) sparkRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((s, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const intensity = stormIntensity(progress.current);
    const wind = 0.3 + intensity * 6;
    const t = s.clock.elapsedTime;
    const now = performance.now() / 1000;

    if (baseRef.current) {
      seeds.forEach((p, i) => {
        if (!p.alive && now >= p.respawn) { p.alive = true; p.x = 16; p.baseY = bandY(); }
        if (p.alive) {
          p.x += WIND.x * wind * p.drift * dt;
          p.curY = p.baseY + Math.sin(t * p.swirlFreq + p.phase) * p.swirlAmp * (0.4 + intensity * 0.4);
          p.rx += p.spin * dt; p.ry += p.spin * dt * 0.6; p.rz += p.spin * dt * 0.4;
          if (p.x < -16) { p.x = 16; p.baseY = bandY(); }
          _m.position.set(p.x, p.curY, p.z);
          _m.rotation.set(p.rx, p.ry, p.rz);
          _m.scale.setScalar(p.scale);
        } else {
          _m.scale.setScalar(0); // shattered → hidden until respawn (not raycastable)
          _m.position.set(p.x, p.curY, p.z);
        }
        _m.updateMatrix();
        baseRef.current.setMatrixAt(i, _m.matrix);
      });
      baseRef.current.instanceMatrix.needsUpdate = true;
    }

    if (fragRef.current) {
      frags.forEach((f, i) => {
        if (f.active) {
          f.life -= dt;
          if (f.life <= 0) f.active = false;
        }
        if (f.active) {
          f.vx *= 0.96; f.vy *= 0.96; f.vz *= 0.96;
          f.x += f.vx * dt; f.y += f.vy * dt; f.z += f.vz * dt;
          f.rx += f.vrx * dt; f.ry += f.vry * dt; f.rz += f.vrz * dt;
          _m.position.set(f.x, f.y, f.z);
          _m.rotation.set(f.rx, f.ry, f.rz);
          _m.scale.setScalar(f.scale0 * (f.life / f.ttl)); // shrink → despawn
        } else {
          _m.position.set(0, 0, 0); _m.rotation.set(0, 0, 0); _m.scale.setScalar(0);
        }
        _m.updateMatrix();
        fragRef.current.setMatrixAt(i, _m.matrix);
      });
      fragRef.current.instanceMatrix.needsUpdate = true;
    }

    if (sparkRef.current) {
      sparks.forEach((sp, i) => {
        if (sp.active) {
          sp.life -= dt;
          if (sp.life <= 0) sp.active = false;
        }
        if (sp.active) {
          sp.vx *= 0.9; sp.vy *= 0.9; sp.vz *= 0.9;
          sp.x += sp.vx * dt; sp.y += sp.vy * dt; sp.z += sp.vz * dt;
          _m.position.set(sp.x, sp.y, sp.z);
          _m.scale.setScalar(sp.scale0 * (sp.life / sp.ttl));
        } else {
          _m.position.set(0, 0, 0); _m.scale.setScalar(0);
        }
        _m.rotation.set(0, 0, 0);
        _m.updateMatrix();
        sparkRef.current.setMatrixAt(i, _m.matrix);
      });
      sparkRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!geometry) return null;
  return (
    <>
      <instancedMesh
        ref={baseRef}
        args={[geometry, material, count]}
        frustumCulled={false}
        onClick={(e) => { e.stopPropagation(); if (e.instanceId != null) shatter(e.instanceId); }}
      />
      <instancedMesh ref={fragRef} args={[geometry, material, FRAG_CAP]} frustumCulled={false} />
      <instancedMesh ref={sparkRef} args={[sparkGeo, sparkMat, SPARK_CAP]} frustumCulled={false} />
    </>
  );
}
