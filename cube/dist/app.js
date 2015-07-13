'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
camera.position.set(5, 5, 10);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0F868F, 1);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
var winResize = new THREEx.WindowResize(renderer, camera);

function drawCubes() {
  var geometry = new THREE.BoxGeometry(.9, .9, .9);
  for (var x = 0; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      for (var z = 0; z < 4; z++) {
        var mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xB60C48 : 0x000000,
          transparent: true, opacity: 0.9, wireframe: false });
        var cube = new THREE.Mesh(geometry, mat);
        cube.position.set(x, y, z);
        scene.add(cube);
      }
    }
  }
}

function onMouseDown(event) {
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersect = raycaster.intersectObjects(scene.children)[0];
  //if(intersect) intersects.object.material.color.set( 0xffffff );
  if (intersect) {
    if (!intersect.object.material.color.r) scene.remove(intersect.object);
  }
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
drawCubes();
render();

window.addEventListener('mousedown', onMouseDown, false);
//window.requestAnimationFrame(render);
// Math.random() > 0.5 ? 0xffffff : 0x000000,
// Math.random() * 0xffffff,
//, wireframe: true