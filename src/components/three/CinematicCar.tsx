import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group } from "three";

function Car() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.35;
  });

  // Stylized low-poly sports car built with primitives
  return (
    <group ref={ref} position={[0, -0.4, 0]} scale={1.1}>
      {/* Main body */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[3.2, 0.5, 1.4]} />
        <meshStandardMaterial color="#e63946" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Lower chassis */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[3.4, 0.25, 1.5]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh castShadow position={[-0.1, 0.85, 0]}>
        <boxGeometry args={[1.7, 0.45, 1.25]} />
        <meshStandardMaterial color="#e63946" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Windshield (glass) */}
      <mesh position={[0.4, 0.9, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.45, 0.4, 1.2]} />
        <meshPhysicalMaterial
          color="#0a1929"
          metalness={0}
          roughness={0.05}
          transmission={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Rear window */}
      <mesh position={[-0.7, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.4, 1.2]} />
        <meshPhysicalMaterial
          color="#0a1929"
          metalness={0}
          roughness={0.05}
          transmission={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Side windows */}
      <mesh position={[-0.1, 0.85, 0.63]}>
        <boxGeometry args={[1.4, 0.4, 0.02]} />
        <meshPhysicalMaterial color="#0a1929" transmission={0.5} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.1, 0.85, -0.63]}>
        <boxGeometry args={[1.4, 0.4, 0.02]} />
        <meshPhysicalMaterial color="#0a1929" transmission={0.5} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Wheels */}
      {[
        [-1.05, 0.05, 0.72],
        [1.05, 0.05, 0.72],
        [-1.05, 0.05, -0.72],
        [1.05, 0.05, -0.72],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
            <meshStandardMaterial color="#c0c0c5" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[1.6, 0.45, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial emissive="#fff7d6" emissiveIntensity={2} color="#fff7d6" />
      </mesh>
      <mesh position={[1.6, 0.45, -0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial emissive="#fff7d6" emissiveIntensity={2} color="#fff7d6" />
      </mesh>
      {/* Tail lights */}
      <mesh position={[-1.6, 0.5, 0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.25]} />
        <meshStandardMaterial emissive="#ff2a2a" emissiveIntensity={2.5} color="#ff2a2a" />
      </mesh>
      <mesh position={[-1.6, 0.5, -0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.25]} />
        <meshStandardMaterial emissive="#ff2a2a" emissiveIntensity={2.5} color="#ff2a2a" />
      </mesh>
    </group>
  );
}

export function CinematicCar() {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.5, 2.2, 5.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <spotLight
            position={[6, 8, 4]}
            angle={0.4}
            penumbra={0.8}
            intensity={2.5}
            color="#ffb56b"
            castShadow
          />
          <spotLight
            position={[-6, 6, -4]}
            angle={0.5}
            penumbra={0.7}
            intensity={1.8}
            color="#4a9eff"
          />
          <pointLight position={[0, 4, 0]} intensity={0.6} />

          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
            <Car />
          </Float>

          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.7}
            scale={10}
            blur={2.5}
            far={4}
            color="#000000"
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
