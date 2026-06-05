import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Environment, Center } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { lerp, range, stormIntensity, S_BASE, S_LAND, URPRISE_Y } from "../data/stormConfig";
import useIsMobile from "../hooks/useIsMobile";
import GlowParticles from "./GlowParticles";
import WindParticles from "./WindParticles";
import Asteroids from "./Asteroids";
import Lightning from "./Lightning";

const NAME_BASE_Y = -0.4;

function Director({ progress, sceneRef, nameRef, sRef, ambientRef }) {
  useFrame((state) => {
    const camera = state.camera;
    const p = progress.current;
    const build = range(p, 0.0, 0.35);
    const peak = range(p, 0.35, 0.55);
    const fly = range(p, 0.55, 1.0);
    const intensity = stormIntensity(p);
    const e = fly < 0.5 ? 2 * fly * fly : 1 - Math.pow(-2 * fly + 2, 2) / 2; // easeInOut
    const tremor = (build + peak) * 0.05 * (1 - fly);

    // cursor tilt (off during the fly)
    const calm = (1 - build * 0.6) * (1 - fly);
    if (sceneRef.current) {
      sceneRef.current.rotation.x = lerp(sceneRef.current.rotation.x, state.pointer.y * 0.22 * calm, 0.05);
      sceneRef.current.rotation.y = lerp(sceneRef.current.rotation.y, state.pointer.x * 0.35 * calm, 0.05);
    }

    // camera: small shake at peak, then PAN DOWN to "urprise"
    const shake = peak * 0.25 * (1 - fly);
    camera.position.x = lerp(camera.position.x, (Math.random() - 0.5) * shake, 0.2);
    camera.position.y = lerp(camera.position.y, lerp(0.6, URPRISE_Y + 0.6, e) + (Math.random() - 0.5) * shake, 0.12);
    camera.lookAt(0, lerp(0, URPRISE_Y, e), 0);

    if (ambientRef.current) ambientRef.current.intensity = lerp(0.6, 0.08, intensity);

    // name trembles
    if (nameRef.current) {
      nameRef.current.position.x = (Math.random() - 0.5) * tremor;
      nameRef.current.position.y = NAME_BASE_Y + (Math.random() - 0.5) * tremor;
      nameRef.current.rotation.z = (Math.random() - 0.5) * tremor * 0.25;
    }

    // the "s": rests with the name, then swoops on a smooth bezier into the "urprise" slot
    if (sRef.current) {
      if (fly <= 0) {
        sRef.current.position.set(
          S_BASE.x + (Math.random() - 0.5) * tremor * 2,
          NAME_BASE_Y + S_BASE.y + (Math.random() - 0.5) * tremor * 2,
          S_BASE.z
        );
        sRef.current.rotation.set(0, 0, 0);
        sRef.current.scale.setScalar(1);
      } else {
        const P0 = { x: S_BASE.x, y: NAME_BASE_Y + S_BASE.y, z: S_BASE.z };
        const P2 = S_LAND;
        const P1 = { x: (P0.x + P2.x) / 2 - 3, y: (P0.y + P2.y) / 2 + 5, z: 4 }; // swoop up & toward camera
        const mt = 1 - e;
        sRef.current.position.set(
          mt * mt * P0.x + 2 * mt * e * P1.x + e * e * P2.x,
          mt * mt * P0.y + 2 * mt * e * P1.y + e * e * P2.y,
          mt * mt * P0.z + 2 * mt * e * P1.z + e * e * P2.z
        );
        sRef.current.rotation.z = mt * -6;  // spins, settles upright on landing
        sRef.current.rotation.x = mt * 3;
        const land = range(fly, 0.88, 1.0);
        const dip = Math.sin(land * Math.PI) * 0.28; // squish on impact
        sRef.current.scale.set(1 + dip * 0.4, 1 - dip, 1 + dip * 0.4);
      }
    }
  });
  return null;
}

export default function StormScene({ progress }) {
  const sceneRef = useRef();
  const nameRef = useRef();
  const sRef = useRef();
  const ambientRef = useRef();
  const mobile = useIsMobile();

  return (
    <Canvas dpr={mobile ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0.6, 14], fov: 42 }} gl={{ antialias: true }}>
      <color attach="background" args={["#05070E"]} />
      <fog attach="fog" args={["#070b18", 16, 40]} />
      <Environment preset="night" />
      <ambientLight ref={ambientRef} intensity={0.6} />
      <directionalLight position={[-6, 8, 6]} intensity={2.2} color="#cfe0ff" />
      <pointLight position={[6, -2, 4]} intensity={1.2} color="#3B82F6" />

      <group ref={sceneRef}>
        {/* "The Resolute" — note: no "s" here, the s is separate */}
        <group ref={nameRef} position={[0, NAME_BASE_Y, 0]}>
          <Center>
            <Text3D font="/fonts/Clash_Display.json" size={0.9} height={0.5} bevelEnabled bevelSize={0.03} bevelThickness={0.06} bevelSegments={4} curveSegments={6}>
              The Resolute
              <meshStandardMaterial color="#2f7fef" emissive="#1e63d6" emissiveIntensity={0.7} metalness={0.6} roughness={0.25} envMapIntensity={1.2} />
            </Text3D>
          </Center>
        </group>

        {/* The flying "s" — animated in world space */}
        <Text3D ref={sRef} position={[S_BASE.x, NAME_BASE_Y + S_BASE.y, S_BASE.z]} font="/fonts/Clash_Display.json" size={0.9} height={0.5} bevelEnabled bevelSize={0.03} bevelThickness={0.06} bevelSegments={4} curveSegments={6}>
          s
          <meshStandardMaterial color="#2f7fef" emissive="#1e63d6" emissiveIntensity={0.7} metalness={0.6} roughness={0.25} envMapIntensity={1.2} />
        </Text3D>

        {/* "urprise!" waiting below — the s lands at its left → "surprise!" */}
        <group position={[-3.2, URPRISE_Y, 0]}>
          <Text3D font="/fonts/Clash_Display.json" size={0.9} height={0.5} bevelEnabled bevelSize={0.03} bevelThickness={0.06} bevelSegments={4} curveSegments={6}>
            urprise!
            <meshStandardMaterial color="#2f7fef" emissive="#1e63d6" emissiveIntensity={0.7} metalness={0.6} roughness={0.25} envMapIntensity={1.2} />
          </Text3D>
        </group>

        {/* Storm */}
        <GlowParticles count={mobile ? 200 : 600} progress={progress} />
        <WindParticles count={mobile ? 6 : 16} progress={progress} />
        <Asteroids count={mobile ? 5 : 9} progress={progress} />
      </group>

      <Lightning progress={progress} />

      {/* THE cinematic layer — makes text, particles & lightning glow */}
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.25} darkness={0.85} eskil={false} />
      </EffectComposer>

      <Director progress={progress} sceneRef={sceneRef} nameRef={nameRef} sRef={sRef} ambientRef={ambientRef} />
    </Canvas>
  );
}