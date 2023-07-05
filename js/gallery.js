// LIBRARY ////
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InteractionManager } from 'three.interactive';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js';

// SETUP SCENE&CAMERA ////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 10, 15 );
camera.lookAt( 0, 5, 0 );
// SETUP RENDERER ////
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// SETUP INTERACTION_MANAGER ////
const interactionManager = new InteractionManager(renderer,camera,renderer.domElement);

// SETUP CONTROLS ////
var autorotateTimeout;
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;
controls.screenSpacePanning = false;
controls.enablePan = false;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0,5,0);
// stop autorotate after the first interaction
controls.addEventListener('start', function(){
  clearTimeout(autorotateTimeout);
  controls.autoRotate = false;
});

// restart autorotate after the last interaction & an idle time has passed
controls.addEventListener('end', function(){
  autorotateTimeout = setTimeout(function(){
    controls.autoRotate = true;
  }, 5000);
});
controls.update();

// CREATE & ADD OBJECTS TO SCENE ////
// GRID
const gridHelper = new THREE.GridHelper( 25, 10 );
scene.add( gridHelper );
// MATERIAL&GEOMETRY FOR CUBE
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// CUBE1
const material = new THREE.MeshBasicMaterial( { color: 0xbe5252 } );
const cube = new THREE.Mesh( new THREE.BoxGeometry(1.5,1.5,1.5), material );
cube.addEventListener('mouseover', (event) => {
	event.target.material.color.set(0xf0f0f0);
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
	model_click(event.target);
});
cube.name = "content1";
cube.position.set(0,5,0);
scene.add( cube );
interactionManager.add(cube);
// CUBE2
const material2 = new THREE.MeshBasicMaterial( { color: 0x7fe384 } );
const cube2 = new THREE.Mesh(geometry,material2);
cube2.addEventListener('mouseover', (event) => {
	event.target.material.color.set(0xf0f0f0);
	document.body.style.cursor = 'pointer';
});
cube2.addEventListener('mouseout', (event) => {
	event.target.material.color.set(0x7fe384);
	document.body.style.cursor = 'default';
});
cube2.addEventListener('mousedown', (event) => {
	event.target.scale.set(1.1, 1.1, 1.1);
});
cube2.addEventListener('click', (event) => {
	event.target.scale.set(1.0, 1.0, 1.0);
	model_click(event.target);
});
cube2.name = "content2";
cube2.position.set(THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10));
scene.add(cube2);
interactionManager.add(cube2);
// CUBE3
const material3 = new THREE.MeshBasicMaterial( { color: 0xfdeacc } );
const cube3 = new THREE.Mesh(geometry,material3);
cube3.addEventListener('mouseover', (event) => {
	event.target.material.color.set(0xf0f0f0);
	document.body.style.cursor = 'pointer';
});
cube3.addEventListener('mouseout', (event) => {
	event.target.material.color.set(0xfdeacc);
	document.body.style.cursor = 'default';
});
cube3.addEventListener('mousedown', (event) => {
	event.target.scale.set(1.1, 1.1, 1.1);
});
cube3.addEventListener('click', (event) => {
	event.target.scale.set(1.0, 1.0, 1.0);
	model_click(event.target);
});
cube3.name = "content3";
cube3.position.set(THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10));
scene.add(cube3);
interactionManager.add(cube3);
// LINES
const positions = [];
//TODO: ganti pake posisi objek
//const points = GeometryUtils.hilbert3D( new THREE.Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
const points =[cube.position,cube2.position];
const spline = new THREE.CatmullRomCurve3( points );
const divisions = Math.round( 12 * points.length );
const point = new THREE.Vector3();

for ( let i = 0, l = divisions; i < l; i ++ ) {
	const t = i / l;

	spline.getPoint( t, point );
	positions.push( point.x, point.y, point.z );
}
const line_geometry = new LineGeometry();
line_geometry.setPositions( positions );

const matLine = new LineMaterial( {
					color: 0xcfcfcf,
					worldUnits: false,
					linewidth: 5,
					vertexColors: false,
					//resolution:  // to be set by renderer, eventually
					dashed: true,
					alphaToCoverage: true,
				} );
const line = new Line2( line_geometry, matLine );
line.computeLineDistances();
line.scale.set( 1, 1, 1 );
scene.add( line );

// HANDLER FOR CLICKING OBJECTS ////
function model_click(model){
	let x = "["+model.id+"]-"+model.name;
	console.log(x);
	if(model.name == "content1"){
		let modal = new bootstrap.Modal(document.getElementById("ctn1"));
		modal.toggle();
	}
	if(model.name == "content2"){
		let modal = new bootstrap.Modal(document.getElementById("ctn2"));
		modal.toggle();
	}
	if(model.name == "content3"){
		let modal = new bootstrap.Modal(document.getElementById("ctn3"));
		modal.toggle();
	}
}

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
	matLine.resolution.set( window.innerWidth, window.innerHeight );
	interactionManager.update();

	renderer.render( scene, camera );
}

animate();
