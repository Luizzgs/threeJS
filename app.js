var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// LIGHTS
// ------------------------------------------------

var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ------------------------------------------------
// LOAD BACKGROUND VIDEO TEXTURE
// ------------------------------------------------



var video = document.getElementById('backgroundVideo');

video.addEventListener('canplay', () => {
  var videoTexture = new THREE.VideoTexture(video);
  scene.background = videoTexture;
});

// ------------------------------------------------
// CREATE SUN, EARTH AND SATURN
// ------------------------------------------------

var textureLoader = new THREE.TextureLoader();

// Sun
var sun_geometry = new THREE.SphereGeometry(1, 32, 16);
var sun_texture = textureLoader.load('assets/sun-texture.jpg');
var sun_material = new THREE.MeshBasicMaterial({ map: sun_texture });
var sun = new THREE.Mesh(sun_geometry, sun_material);
scene.add(sun);

// Earth
var earth_geometry = new THREE.SphereGeometry(0.5, 32, 16);
var earth_texture = textureLoader.load('assets/earth.webp');
var earth_material = new THREE.MeshBasicMaterial({ map: earth_texture });
var earth = new THREE.Mesh(earth_geometry, earth_material);
var pivot = new THREE.Object3D();
scene.add(pivot);
pivot.add(earth);
earth.position.set(3, 0, 0);

// Saturn
var saturnGeometry = new THREE.SphereGeometry(0.3, 64, 64);
var mustardColor = new THREE.Color(0xFFDB58);
var creamRadiantGrayColor = new THREE.Color(0xB4CDCD);
var saturnMaterial = new THREE.MeshLambertMaterial({ color: creamRadiantGrayColor, emissive: mustardColor });
var saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// Saturn's ring
var ringGeometry = new THREE.RingGeometry(0.5, 0.7, 64);
var ringMaterial = new THREE.MeshLambertMaterial({ color: creamRadiantGrayColor, emissive: mustardColor, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
var ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// ------------------------------------------------
// MODELS
// ------------------------------------------------

var astronaut, spaceship;
var loader = new THREE.GLTFLoader();

loader.load(
  'assets/astronaut.glb',
  function (gltf) {
    astronaut = gltf.scene;
    astronaut.scale.set(0.1, 0.1, 0.1);
    scene.add(astronaut);
  },
  undefined,
  function (error) {
    console.error('An error happened loading astronaut', error);
  }
);

loader.load(
  'assets/nave.glb',
  function (gltf) {
    spaceship = gltf.scene;
    spaceship.scale.set(0.2, 0.2, 0.2);
    scene.add(spaceship);
  },
  undefined,
  function (error) {
    console.error('An error happened loading spaceship', error);
  }
);

// ------------------------------------------------
// RENDER FUNCTION
// ------------------------------------------------

var render = function () {
  requestAnimationFrame(render);
  
  if (scene.background && scene.background.update) scene.background.update();
  
  earth.rotation.y += 0.01;
  pivot.rotation.y += 0.005;
  
  var time = Date.now() * 0.0005;
  var distance = 8;
  saturn.position.x = Math.cos(time) * distance;
  saturn.position.z = Math.sin(time) * distance;
  
  ring.position.copy(saturn.position);
  
  if (astronaut) {
    astronaut.position.set(
      earth.position.x + Math.sin(Date.now() * 0.0001) * 1.5,
      earth.position.y + Math.cos(Date.now() * 0.001) * 1.5,
      earth.position.z
    );
    astronaut.rotation.y += 0.01;
  }
  
  if (spaceship && astronaut) {
    var randomOffset = Math.sin(Date.now() * 0.001) * 2;
    spaceship.position.set(
      astronaut.position.x + Math.sin(Date.now() * 0.001) * 2,
      astronaut.position.y + Math.cos(Date.now() * 0.001) * 1,
      astronaut.position.z + Math.sin(Date.now() * 0.0005) * 2
    );
    spaceship.rotation.y += 0.001;
  }
  
  saturn.rotation.y += 0.01;
  ring.rotation.x += 0.001;
  
  renderer.render(scene, camera);
};

render();

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(newWidth, newHeight);
});

