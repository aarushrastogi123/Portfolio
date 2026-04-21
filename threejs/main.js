import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// OrbitControls — lets you rotate/zoom with mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.8);
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

// Loading indicator
const loadingEl = document.getElementById("loading");

// Loader
const loader = new GLTFLoader();

let model;

// Load model
loader.load(
  "astronaut.glb",
  (gltf) => {
    model = gltf.scene;
    
    // Traverse the model and apply a colored material to all meshes
    model.traverse((child) => {
      if (child.isMesh) {
        // Apply an orange spacesuit color with some nice material properties
        child.material = new THREE.MeshStandardMaterial({
          color: 0xff5500, // Vibrant orange
          metalness: 0.3,
          roughness: 0.4
        });
      }
    });

    model.scale.set(2, 2, 2);
    scene.add(model);

    // Hide loading indicator
    if (loadingEl) loadingEl.style.display = "none";

    console.log("✅ astronaut.glb loaded successfully!");
  },
  (progress) => {
    if (progress.total > 0) {
      const pct = ((progress.loaded / progress.total) * 100).toFixed(0);
      if (loadingEl) loadingEl.textContent = `Loading… ${pct}%`;
      console.log(`Loading: ${pct}%`);
    } else {
      if (loadingEl) loadingEl.textContent = `Loading… ${(progress.loaded / 1024).toFixed(0)} KB`;
      console.log(`Loading: ${progress.loaded} bytes`);
    }
  },
  (error) => {
    console.error("❌ Error loading model:", error);
    if (loadingEl) loadingEl.textContent = "Failed to load model: " + (error.message || error);
  }
);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.005;
    model.position.y = Math.sin(Date.now() * 0.001) * 0.3;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();