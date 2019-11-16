const RENDER_CONTAINER = document.getElementById('rendering-area');
const RENDERER_WIDTH = RENDER_CONTAINER.clientWidth;
const RENDERER_HEIGHT = RENDER_CONTAINER.clientWidth / 2;

const scene = new THREE.Scene();

// Camera defines a "viewing frustrum"
const camera = new THREE.PerspectiveCamera( 
    25,                             // vertical field of view
    RENDERER_WIDTH/RENDERER_HEIGHT, // aspect ratio
    0.1,                            // near plane
    1000                            // far plane
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize( RENDERER_WIDTH, RENDERER_HEIGHT);
RENDER_CONTAINER.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const animate = () => {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
