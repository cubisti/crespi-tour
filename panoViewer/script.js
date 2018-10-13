
var camera,
		scene,
		renderer,
		controls,
		container = document.createElement('div');

		init();
		animate();
		document.body.appendChild(container);

/*
TODO:
Initial scene
Insert button into scene
Stereo camera
external js file

*/
function initializingSpace() {
	scene = new THREE.Scene();
  scene.background = new THREE.Color(000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.target = new THREE.Vector3(0, 0, 0);
	//last one is fov
	camera.position.set(0, 0, 1);

	scene.add(camera);

	controls = new THREE.OrbitControls(camera);
	//block zoom
	controls.enableZoom = false;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);
}

function createSphere() {
	 var sphereGeometry = new THREE.SphereGeometry(-20, 20, 20);
	 var loader = new THREE.TextureLoader();
	 var texture = loader.load("img/1.jpg");
	 var material = new THREE.MeshBasicMaterial({
		 map: texture
	 });
	 texture.flipY = false;
	 var sphere = new THREE.Mesh(sphereGeometry, material);
	 scene.add(sphere);

/*
	var loader = new THREE.TextureLoader();
		loader.load('img/1.jpg', function(texture) {
		 var sphereGeometry = new THREE.SphereGeometry(-20, 20, 20)
		 var sphereMaterial = new THREE.MeshBasicMaterial({map: texture})
		 var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

texture.flipY = false;
		 scene.add(mesh);
})
*/

}
function init() {
	initializingSpace();
	createSphere();
/*
CROSS ORIGIN
  //allow cross origin loading
  loader.crossOrigin = '';

  var arr = [
   'img/1.jpg',
   'img/2.jpg',
   'img/3.jpg'
  ];
  var textureToShow = 0;

  var material = new THREE.MeshBasicMaterial();

  var geometry = new THREE.BoxGeometry( -1, 1, 1 );

  var cube = new THREE.Mesh( geometry, material );
  cube.position.y = 0.1;
	cube.scale.x = -1;

  //load texture
  loader.load(arr[textureToShow], function(tex) {
   //add texture when cube loaded
   material.map = tex;
   //texture++
   textureToShow++;

   scene.add( cube );
  });

  // Click interaction
  var canvas = document.getElementsByTagName("canvas")[0];
  canvas.addEventListener("click", function() {

   loader.load(arr[textureToShow], function(tex) {
    //add texture when cube loaded
    material.map = tex;
    textureToShow++;
    //if end of texture return to fist img
    if(textureToShow > arr.length-1) {
     textureToShow = 0;
    }
   });
  });
*/
}
	function render() {
		window.requestAnimationFrame(render);
		renderer.render( scene, camera );
	}
	function animate() {
	 requestAnimationFrame(animate);
	 controls.update();
	 renderer.render(scene, camera);
	};