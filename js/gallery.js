// LIBRARY ////
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { InteractionManager } from 'three.interactive';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


// SETUP SCENE&CAMERA ////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 18, 25 );
camera.lookAt( 0, 5, 0 );
// SETUP RENDERER ////
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById( 'label' ).appendChild( labelRenderer.domElement );
// SETUP EFFECT ////

// SETUP INTERACTION_MANAGER ////
const interactionManager = new InteractionManager(renderer,camera,renderer.domElement);

// SETUP CONTROLS ////
var autorotateTimeout;
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.screenSpacePanning = false;
controls.enablePan = false;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0,4,0);
// stop autorotate after the first interaction
controls.addEventListener('start', function(){
  clearTimeout(autorotateTimeout);
  controls.autoRotate = false;
});

// restart autorotate after the last interaction & an idle time has passed
controls.addEventListener('end', function(){
  autorotateTimeout = setTimeout(function(){
    controls.autoRotate = true;
  }, 8000);
});
controls.update();

// CREATE & ADD OBJECTS TO SCENE ////
// GRID
const gridHelper = new THREE.GridHelper( 25, 10 );
scene.add( gridHelper );
// MATERIAL&GEOMETRY FOR CUBE
// CUBES
function addCube(name,clr=0xfefefe,position,size=1.0){
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: clr } );
	const cube = new THREE.Mesh( new THREE.BoxGeometry(size,size,size), material );
	const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x202020, side: THREE.BackSide } );
	var outlineMesh = new THREE.Mesh( geometry, outlineMaterial );
	outlineMesh.position.set(cube.position.x,cube.position.y,cube.position.z);
	outlineMesh.scale.multiplyScalar(size+0.15);
	cube.add( outlineMesh );
	
	cube.addEventListener('mouseover', (event) => {
		event.target.material.color.set(0xf0f0f0);
		document.body.style.cursor = 'pointer';
	});
	cube.addEventListener('mouseout', (event) => {
		event.target.material.color.set(clr);
		document.body.style.cursor = 'default';
	});
	cube.addEventListener('mousedown', (event) => {
		event.target.scale.set(1.1, 1.1, 1.1);
	});
	cube.addEventListener('click', (event) => {
		event.target.scale.set(1.0, 1.0, 1.0);
		model_click(event.target);
	});
	var cubeDiv = document.createElement('div');
	cubeDiv.className = 'label';
	cubeDiv.textContent = name;
	var cubeLabel = new CSS2DObject(cubeDiv);
	cubeLabel.position.set(0, 1, 0);
	cube.attach(cubeLabel);
	
	cube.name = name;
	cube.position.set(position.x,position.y,position.z);
	scene.add( cube );
	interactionManager.add(cube);
	return (cube);
}
var cube  = addCube("RumahNoto",0xbe5252,new THREE.Vector3(0,5,0),1.5);
var cube2 = addCube("CreativeMinority",0x34549e,new THREE.Vector3(THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10)));
var cube3 = addCube("About",0xfdeacc,new THREE.Vector3(10,1,10));
var cube4 = addCube("content3",0x0ebe2e,new THREE.Vector3(THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10),THREE.MathUtils.randFloat(0, 10)));

// LINES
const matLine = new LineMaterial( {
					color: 0xcfcfcf,
					worldUnits: false,
					linewidth: 5,
					vertexColors: false,
					//resolution:  // to be set by renderer
					dashed: true,
					alphaToCoverage: true,
				});
function addLine(from,to){
	const points =[from.x,from.y,from.z,to.x,to.y,to.z];
	
	const line_geometry = new LineGeometry();
	line_geometry.setPositions( points );
	
	const line = new Line2( line_geometry, matLine );
	line.computeLineDistances();
	line.scale.set( 1, 1, 1 );
	scene.add( line );
}
addLine(cube.position,cube2.position);

// HANDLER FOR CLICKING OBJECTS ////
function toggle_content(dom){
	let modal = new bootstrap.Modal(dom);
	modal.toggle();
}
function model_click(model){
	let x = "["+model.id+"]-"+model.name;
	
	let content = document.getElementById(model.name);
	console.log(content);
	if(content){
		toggle_content(content);
	}
}
// TEXT ////
var font;
function addText(font,text,size = 2,clr){
	const material = new THREE.MeshBasicMaterial( { color: clr } );
	const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x202020, side: THREE.BackSide } );
	const textGeo = new TextGeometry( text, {
		font: font,

		size: size,
		height: 0.5,
		curveSegments: 4,

		bevelThickness: 0,
		bevelSize: 0,
		bevelEnabled: false

	} );

	textGeo.computeBoundingBox();

	const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	const textMesh1 = new THREE.Mesh( textGeo, material );
	const outlineMesh = new THREE.Mesh( textGeo, outlineMaterial );
	outlineMesh.position.set(textMesh1.position.x,textMesh1.position.y,textMesh1.position.z);
	outlineMesh.scale.multiplyScalar(1.01);
	textMesh1.add( outlineMesh );
	textMesh1.position.x = -7.5+centerOffset;
	textMesh1.position.y = 1;
	textMesh1.position.z = 11;

	textMesh1.rotation.x = -Math.PI/2;
	textMesh1.rotation.y = 0;

	scene.add( textMesh1 );
}

function loadFont(path) {
	const loader = new FontLoader();
	loader.load( path, function ( response ) {
		font = response;
		addText(font,"DX502B",2,0xf0f0f0);
		});
}

import fontUrl from '../fonts/droid_sans_regular.typeface.json?url'
loadFont(fontUrl);
// HANDLE RESIZE ////
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
}

// ANIMATE ////
var clock = new THREE.Clock();
function animate() {
	requestAnimationFrame( animate );
	const time = clock.getElapsedTime();
	scene.traverse(function(object){
			if(object.type === 'Mesh' && object.name){
				object.position.y += Math.cos( time ) *0.005;
				object.rotation.y += 0.02;
			}
		});

	controls.update();
	matLine.resolution.set( window.innerWidth, window.innerHeight );
	interactionManager.update();

	renderer.render( scene, camera );
	labelRenderer.render( scene, camera );
}

animate();
