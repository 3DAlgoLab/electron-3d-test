import * as THREE from './node_modules/three/build/three.module.js';

// -- Scene setup --
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 4, 8);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, failIfMajorPerformanceCaveat: false });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);


// -- Lighting --
scene.add(new THREE.AmbientLight(0x334466, 1.5));

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 8, 5);
scene.add(dirLight);

// -- Central sphere (sun) --
const sunGeo = new THREE.SphereGeometry(1.2, 48, 48);
const sunMat = new THREE.MeshStandardMaterial({
  color: 0xffaa33,
  emissive: 0xff6600,
  emissiveIntensity: 0.6,
});
scene.add(new THREE.Mesh(sunGeo, sunMat));

// -- Orbit ring (visual guide) --
const orbitRadius = 4;
const ringGeo = new THREE.TorusGeometry(orbitRadius, 0.02, 8, 128);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x334466 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// -- Orbiting object (torus knot) --
const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

const knotGeo = new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32);
const knotMat = new THREE.MeshStandardMaterial({
  color: 0x44aaff,
  metalness: 0.7,
  roughness: 0.2,
});
const knot = new THREE.Mesh(knotGeo, knotMat);
orbitGroup.add(knot);

// -- Second orbiting object (icosahedron) on a tilted orbit --
const tiltGroup = new THREE.Group();
tiltGroup.rotation.x = Math.PI / 3;
scene.add(tiltGroup);

const icoRadius = 5.5;
const icoRingGeo = new THREE.TorusGeometry(icoRadius, 0.02, 8, 128);
const icoRingMat = new THREE.MeshBasicMaterial({ color: 0x334466 });
const icoRing = new THREE.Mesh(icoRingGeo, icoRingMat);
icoRing.rotation.x = Math.PI / 2;
tiltGroup.add(icoRing);

const icoObj = new THREE.Group();
tiltGroup.add(icoObj);

const icoGeo = new THREE.IcosahedronGeometry(0.45, 0);
const icoMat = new THREE.MeshStandardMaterial({
  color: 0xff4488,
  metalness: 0.5,
  roughness: 0.3,
});
icoObj.add(new THREE.Mesh(icoGeo, icoMat));

// -- Stars (particle background) --
const starsCount = 2000;
const starsGeo = new THREE.BufferGeometry();
const starsPos = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
  starsPos[i] = (Math.random() - 0.5) * 200;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
scene.add(new THREE.Points(starsGeo, starsMat));

// -- Animation loop --
let elapsed = 0;

function animate(time) {
  requestAnimationFrame(animate);
  elapsed = time * 0.001;

  // Torus knot orbits in XY plane
  const angle1 = elapsed * 0.8;
  knot.position.set(Math.cos(angle1) * orbitRadius, 0, Math.sin(angle1) * orbitRadius);
  knot.rotation.x += 0.02;
  knot.rotation.y += 0.03;

  // Icosahedron orbits on tilted plane
  const angle2 = elapsed * 0.5;
  icoObj.position.set(Math.cos(angle2) * icoRadius, 0, Math.sin(angle2) * icoRadius);
  icoObj.rotation.x += 0.015;
  icoObj.rotation.z += 0.025;

  // Gentle camera sway
  camera.position.x = Math.sin(elapsed * 0.1) * 8;
  camera.position.z = Math.cos(elapsed * 0.1) * 8;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate(0);

// -- Resize handler --
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
