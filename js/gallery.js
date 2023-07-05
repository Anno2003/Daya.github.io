// LIBRARY ////
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InteractionManager } from 'three.interactive';

// SETUP SCENE&CAMERA ////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 5, 20 );
// SETUP RENDERER ////
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// SETUP INTERACTION_MANAGER ////
const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

// CREATE & ADD OBJECTS TO SCENE ////
// GRID
const gridHelper = new THREE.GridHelper( 25, 10 );
scene.add( gridHelper );
// BOX
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xbe5252 } );
const cube = new THREE.Mesh( geometry, material );
cube.addEventListener('mouseover', (event) => {
  event.target.material.color.set(0xff0000);
  document.body.style.cursor = 'pointer';
});
cube.addEventListener('mouseout', (event) => {
  event.target.material.color.set(0xbe5252);
  document.body.style.cursor = 'default';
});
cube.addEventListener('mousedown', (event) => {
  event.target.scale.set(1.1, 1.1, 1.1);
});
cube.addEventListener('click', (event) => {
  event.target.scale.set(1.0, 1.0, 1.0);
});

scene.add( cube );
interactionManager.add(cube);
// SETUP CONTROLS ////
const controls = new OrbitControls( camera, renderer.domElement );

controls.update();

// HANDLE RESIZE ////
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// ANIMATE ////
function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	controls.update();
	interactionManager.update();

	renderer.render( scene, camera );
}
animate();
