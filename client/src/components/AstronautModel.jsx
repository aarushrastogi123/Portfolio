import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AstronautMesh({ pivotRef }) {
  const innerRef = useRef();
  const { scene } = useGLTF('/astronaut.glb');

  // Make the astronaut white
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone();
      child.material.color = new THREE.Color('#ffd6ff');
      child.material.emissive = new THREE.Color('#c9a0c9');
      child.material.emissiveIntensity = 0.1;
      child.material.roughness = 0.3;
      child.material.metalness = 0.45;
    }
  });

  // Auto-center by computing bounding box and shifting the inner mesh group
  useEffect(() => {
    if (!innerRef.current) return;
    const box = new THREE.Box3().setFromObject(innerRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    innerRef.current.position.sub(center); // shift so center is at origin
  }, [scene]);

  return (
    <group ref={innerRef}>
      <primitive object={scene} />
    </group>
  );
}

function AstronautPivot() {
  const pivotRef = useRef();

  // Only float up/down — user handles rotation via OrbitControls
  useFrame(({ clock }) => {
    if (!pivotRef.current) return;
    const t = clock.getElapsedTime();
    pivotRef.current.position.y = Math.sin(t * 2.5) * 0.1;
  });

  return (
    <group ref={pivotRef} scale={1.0}>
      <Suspense fallback={null}>
        <AstronautMesh />
      </Suspense>
    </group>
  );
}

export default function AstronautModel() {
  return (
    <div className="astronaut-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 36 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        width="600px"
        height="700px"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#aaaaff" />
        <pointLight position={[0, 3, 3]} intensity={0.5} color="#ffffff" />

        <AstronautPivot />

        <OrbitControls
          enableZoom={false}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={6}
          zoomSpeed={0.8}
          rotateSpeed={0.8}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
