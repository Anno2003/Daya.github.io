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
const aspect = window.innerWidth / window.innerHeight;
//const camera = new THREE.PerspectiveCamera( 75,aspect, 0.1, 1000 );
const frustumSize = 25;
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 100 );
camera.position.set( -15, 18, 25 );
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
function addMesh(name,clr=0xfefefe,position=new THREE.Vector3(0,0,0),size=1.0,type="cube",wireframe = false){
	var geometry;
	switch(type){
		case "cube":
			geometry = new THREE.BoxGeometry( size, size, size );
			wireframe = true;
			break;
		case "tetra":
			geometry = new THREE.TetrahedronGeometry(size,0);
			break;
		case "octa":
			geometry = new THREE.OctahedronGeometry(size,0);
			break;
		case "torus":
			geometry = new THREE.TorusGeometry( size, 0.2, 16, 10 );
			break;
		case "knot":
			geometry = new THREE.TorusKnotGeometry( size-0.5, 0.3, 100, 10 ); 
			break;
	}
	
	const material = new THREE.MeshBasicMaterial( { color: clr } );
	const mesh = new THREE.Mesh( geometry, material );
	const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x202020, side: THREE.BackSide } );
	var outlineMesh = new THREE.Mesh( geometry, outlineMaterial );
	outlineMesh.position.set(mesh.position.x,mesh.position.y,mesh.position.z);
	outlineMesh.scale.multiplyScalar(1.1);
	mesh.add( outlineMesh );
	
	if(wireframe){
		const wire = new THREE.EdgesGeometry( geometry );
		const line = new THREE.LineSegments( wire,new THREE.LineBasicMaterial( { color: 0x000000 } ) );
		mesh.add( line );
	}
	
	mesh.addEventListener('mouseover', (event) => {
		event.target.material.color.set(0xf0f0f0);
		document.body.style.cursor = 'pointer';
	});
	mesh.addEventListener('mouseout', (event) => {
		event.target.material.color.set(clr);
		document.body.style.cursor = 'default';
	});
	mesh.addEventListener('mousedown', (event) => {
		event.stopPropagation();
		event.target.scale.set(1.1, 1.1, 1.1);
	});
	mesh.addEventListener('click', (event) => {
		event.stopPropagation();
		event.target.scale.set(1.0, 1.0, 1.0);
		model_click(event.target);
	});
	var cubeDiv = document.createElement('div');
	cubeDiv.className = 'label';
	cubeDiv.textContent = name;
	var cubeLabel = new CSS2DObject(cubeDiv);
	cubeLabel.position.set(0, 1, 0);
	mesh.attach(cubeLabel);
	
	mesh.name = name;
	mesh.position.set(position.x,position.y,position.z);
	scene.add( mesh );
	interactionManager.add(mesh);
	return (mesh);
}
addMesh("RumahNoto"       ,0xbe5252,new THREE.Vector3(0,5,0),1.5,"octa",true);
addMesh("CreativeMinority",0x34549e,new THREE.Vector3(-5,8,-1));
addMesh("About"           ,0xfdeacc,new THREE.Vector3(10,1,10),1.5,"tetra");
addMesh("Kunjungan"       ,0x0ebe2e,new THREE.Vector3(5,6,3));
addMesh("LambangUKSW"     ,0x6705ad,new THREE.Vector3(-7,6,4));
addMesh("Perpustakaan"    ,0xf0a13a,new THREE.Vector3(1,8,-4));

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
addLine(scene.getObjectByName("RumahNoto").position,scene.getObjectByName("CreativeMinority").position);
addLine(scene.getObjectByName("RumahNoto").position,scene.getObjectByName("Kunjungan").position);
addLine(scene.getObjectByName("RumahNoto").position,scene.getObjectByName("Perpustakaan").position);
addLine(scene.getObjectByName("CreativeMinority").position,scene.getObjectByName("LambangUKSW").position);
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
	var aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
  
	camera.left = frustumSize * aspect / - 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = - frustumSize / 2;

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
