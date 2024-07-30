
// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color to black
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// ADD LIGHTS
// ------------------------------------------------

var ambientLight = new THREE.AmbientLight(0xffffff, 5); // Adjusted light intensity
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ------------------------------------------------
// ADD TEXT
// ------------------------------------------------

var loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  var textGeometry = new THREE.TextGeometry('Horizontally spinning rat!', {
    font: font,
    size: 1,
    height: 0.1
  });
  
  var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var textMesh = new THREE.Mesh(textGeometry, textMaterial);
  
  textGeometry.center(); // Center the text
  textMesh.position.set(0, 2, -1); // Position the text above the rat
  scene.add(textMesh);
});

// ------------------------------------------------
// LOAD MODELS
// ------------------------------------------------

var rat;
var modelLoader = new THREE.GLTFLoader();

// Load the rat model
modelLoader.load(
  'assets/rat.glb',
  function (gltf) {
    rat = gltf.scene;
    rat.scale.set(30, 30, 30); // Scale the rat if needed
    rat.position.y = -1;
    scene.add(rat);
  },
  undefined,
  function (error) {
    console.error('An error happened loading rat', error);
  }
);

// ------------------------------------------------
// ADD MUSIC
// ------------------------------------------------

var audioLoader = new THREE.AudioLoader();
var listener = new THREE.AudioListener();
camera.add(listener);

var backgroundMusic = new THREE.Audio(listener);
audioLoader.load('assets/ratSpin.mp3', function (buffer) {
  backgroundMusic.setBuffer(buffer);
  backgroundMusic.setLoop(false);
  backgroundMusic.setVolume(0.3);
  backgroundMusic.play();
});


// Render Loop
var render = function () {
  requestAnimationFrame(render);

  // Rotate the rat around its own axis
  if (rat) {
    rat.rotation.y += 0.01; // Rotate the rat around its own axis
  }

  // Render the scene
  renderer.render(scene, camera);
};

render();


