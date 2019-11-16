const RENDER_CONTAINER = document.getElementById('rendering-area');
const RENDERER_WIDTH = RENDER_CONTAINER.clientWidth;
const RENDERER_HEIGHT = RENDER_CONTAINER.clientWidth / 2;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 25, RENDERER_WIDTH/RENDERER_HEIGHT,
					  0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

renderer.setSize( RENDERER_WIDTH, RENDERER_HEIGHT);
RENDER_CONTAINER.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
