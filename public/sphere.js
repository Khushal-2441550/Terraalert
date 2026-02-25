// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ----------------------------------
// Create Minimal Sphere Points
// ----------------------------------

const radius = 1.2;
const pointCount = 120; // 🔥 LOWER NUMBER = MORE MINIMAL

const positions = [];
const originalPositions = [];

for (let i = 0; i < pointCount; i++) {

  // Fibonacci sphere distribution (even spread)
  const phi = Math.acos(1 - 2 * (i + 0.5) / pointCount);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);

  positions.push(x, y, z);
  originalPositions.push(x, y, z);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0x5c677d,
  size: 0.03,
  transparent: true,
  opacity: 0.9
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// ----------------------------------
// Create Thin Connecting Lines
// ----------------------------------

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xadb5bd,
  transparent: true,
  opacity: 0.25
});

const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];

const connectionDistance = 0.5; // adjust for density

for (let i = 0; i < pointCount; i++) {
  for (let j = i + 1; j < pointCount; j++) {

    const dx = positions[i*3] - positions[j*3];
    const dy = positions[i*3+1] - positions[j*3+1];
    const dz = positions[i*3+2] - positions[j*3+2];

    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    if (dist < connectionDistance) {
      linePositions.push(
        positions[i*3], positions[i*3+1], positions[i*3+2],
        positions[j*3], positions[j*3+1], positions[j*3+2]
      );
    }
  }
}

lineGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(linePositions, 3)
);

const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

// ----------------------------------
// Mouse Interaction
// ----------------------------------

let mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ----------------------------------
// Animation
// ----------------------------------

function animate() {
  requestAnimationFrame(animate);

  // Slow elegant rotation
  points.rotation.y += 0.0015;
  lines.rotation.y += 0.0015;

  // Mouse proximity scaling effect
  const positionsAttr = geometry.attributes.position;

  for (let i = 0; i < pointCount; i++) {

    const ix = i * 3;

    const x = originalPositions[ix];
    const y = originalPositions[ix + 1];
    const z = originalPositions[ix + 2];

    // distance to mouse (projected approximation)
    const dx = mouse.x - x * 0.3;
    const dy = mouse.y - y * 0.3;
    const dist = Math.sqrt(dx*dx + dy*dy);

    const scale = 1 + (0.4 - dist) * 0.8;

    positionsAttr.array[ix]     = x * scale;
    positionsAttr.array[ix + 1] = y * scale;
    positionsAttr.array[ix + 2] = z * scale;
  }

  positionsAttr.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// ----------------------------------
// Responsive
// ----------------------------------

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});