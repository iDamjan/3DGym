import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const brickWallTexture = textureLoader.load("textures/BrickWallBaked.jpg");
const bottomFloorTexture = textureLoader.load("textures/FloorMain.jpg");
const sceneTexture = textureLoader.load("textures/SceneBaked.jpg");
const platesTexture = textureLoader.load("textures/plates.jpg");

brickWallTexture.wrapT = THREE.RepeatWrapping; // Adjust wrapping horizontally
brickWallTexture.repeat.y = -1;
brickWallTexture.colorSpace = THREE.SRGBColorSpace;

sceneTexture.colorSpace = THREE.SRGBColorSpace;
sceneTexture.flipY = false;

platesTexture.flipY = false;
platesTexture.colorSpace = THREE.SRGBColorSpace;

bottomFloorTexture.flipY = false;
bottomFloorTexture.colorSpace = THREE.SRGBColorSpace;

const sceneMaterial = new THREE.MeshBasicMaterial({
  map: sceneTexture,
});

const brickWallMaterial = new THREE.MeshBasicMaterial({
  map: brickWallTexture,
});

const platesMaterial = new THREE.MeshBasicMaterial({
  map: platesTexture,
});

const bottomFloorMaterial = new THREE.MeshBasicMaterial({
  map: bottomFloorTexture,
});

const ledMaterial = new THREE.MeshBasicMaterial({ color: "#f6ffff" });

gltfLoader.load("models/IsoGym.glb", (gltf) => {
  scene.add(gltf.scene);

  gltf.scene.position.y = -1.5;

  gltf.scene.traverse((child) => {
    if (child.name === "BezierCurve_1") {
      child.material = new THREE.MeshBasicMaterial({ color: "#87d898" });
    } else {
      child.material = sceneMaterial;
    }
  });

  const plates = gltf.scene.children.filter((child) =>
    child.name.includes("Barbell")
  );
  plates.forEach((plateGroup) => {
    for (let plate of plateGroup.children) {
      plate.material = platesMaterial;
    }
  });
  const brickWall = gltf.scene.children.find(
    (child) => child.name === "BrickWall"
  );

  brickWall.material = brickWallMaterial;

  const floor = gltf.scene.children.find((child) => child.name === "Floor");

  floor.material = new THREE.MeshBasicMaterial({ color: "#141416" });

  const bottomFloor = gltf.scene.children.find(
    (child) => child.name === "Plane"
  );
  bottomFloor.material = bottomFloorMaterial;

  const signA = gltf.scene.children.find(
    (child) => child.name === "SignNoLedA"
  );
  const signB = gltf.scene.children.find(
    (child) => child.name === "SignNoLedB"
  );

  signA.material = new THREE.MeshBasicMaterial({ color: "#1e1c1e" });
  signB.material = new THREE.MeshBasicMaterial({ color: "#1e1c1e" });

  const signLedA = gltf.scene.children.find(
    (child) => child.name === "SignLedA"
  );
  const signLedB = gltf.scene.children.find(
    (child) => child.name === "SignLedB"
  );

  signLedA.material = ledMaterial;
  signLedB.material = ledMaterial;

  const ledA = gltf.scene.children.find((child) => child.name === "LedA");
  const ledB = gltf.scene.children.find((child) => child.name === "LedB");

  ledA.material = ledMaterial;
  ledB.material = ledMaterial;
});
/**
 * Textures
 */

console.log("happening");

const ambientLight = new THREE.AmbientLight("white", 2);
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(3.5, 1.9, 4.5);

// Update the camera's quaternion representation based on Euler angles
camera.setRotationFromEuler(camera.rotation);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

// Oribt controls settings
controls.enableDamping = true;
controls.dampingFactor = 0.025;
controls.rotateSpeed = 0.3;
controls.maxPolarAngle = Math.PI / 2;
controls.maxAzimuthAngle = 1.7;
controls.minAzimuthAngle = 0;
controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
