import './style.css';

import * as THREE from 'three';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObjects( countries );

  if (intersects.length > 0) {
    p.className = 'tooltip show';
    cPointLabel.position.set(intersects[0].object.position.x, intersects[0].object.position.y + 0.5, intersects[0].object.position.z + 1);
    p.innerHTML = `<img src="assets/${intersects[0].object.name}.png"/> ${intersects[0].object.name}`;
  } else {
    p.className = 'tooltip hide';
  }
}

document.addEventListener( 'mousemove', onPointerMove );

const pivot = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ wireframe: true })
);
scene.add(pivot);

const earthTexture = new THREE.TextureLoader().load('assets/earth.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshBasicMaterial({ map: earthTexture, wireframe: false })
);
earth.position.set(0, 0, 0);
earth.rotation.x = 0.6;
earth.rotation.y = 17;
pivot.add(earth);

const p = document.createElement('p');
p.className = 'tooltip';
const pContainer = document.createElement('div');
pContainer.appendChild(p);
const cPointLabel = new CSS2DObject(pContainer);
pivot.add(cPointLabel);

const countries = [];
function createPinpoints(name, x, y, z) {
  const geometry = new THREE.SphereGeometry(0.08, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xEE4B2B });
  const pinpoint = new THREE.Mesh(geometry, material);
  pinpoint.position.set(x, y, z);
  pinpoint.name = name;
  pivot.add(pinpoint);
  countries.push(pinpoint);
}

createPinpoints('netherlands', -0.9, 2.5, 7.55);
createPinpoints('belgium', -1, 2.3, 7.6);
createPinpoints('germany', -0.6, 2.4, 7.6);
createPinpoints('austria', -0.3, 1.9, 7.75);
createPinpoints('sweden', -0.1, 3.2, 7.3);
createPinpoints('finland', 0.6, 3.7, 7.05);
createPinpoints('norway', -0.5, 3.7, 7.05);
createPinpoints('denmark', -0.5, 2.9, 7.45);
createPinpoints('uk', -1.4, 2.5, 7.5);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#app'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const intersects2 = raycaster.intersectObject( pivot );

  if (intersects2.length === 0) {
    pivot.rotation.x += 0.001;
    pivot.rotation.y += 0.005;
  } else {
    pivot.rotation.x += 0;
    pivot.rotation.y += 0;
  }

  labelRenderer.render(scene, camera);

  renderer.render(scene, camera);
}

animate();