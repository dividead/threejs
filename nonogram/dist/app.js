//scene, controls, camera
'use strict';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
camera.position.set(3, 8, 13);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0F868F, 1);
document.body.appendChild(renderer.domElement);
//let controls = new THREE.OrbitControls( camera, renderer.domElement );
var winResize = new THREEx.WindowResize(renderer, camera);
//======================================

function drawCubes() {
  var a = [[0, 1, 1, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 0, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 1, 1, 0, 1], [0, 1, 1, 0, 0, 0, 0, 1, 1, 1], [1, 1, 0, 0, 0, 0, 0, 1, 1, 0]];
  var ar = a.slice().reverse();
  //horizonal row numbers
  function sq(x) {
    return x.join('').split('0').filter(function (s) {
      return s;
    }).map(function (s) {
      return s.length;
    });
  }
  //vertical row numbers helper
  function zip(a) {
    return a[0].map(function (_, i) {
      return a.map(function (x) {
        return x[i];
      });
    });
  }
  var b = a.map(sq);
  var c = zip(a).map(sq);
  //create cube
  var geometry = new THREE.BoxGeometry(.9, .9, .9);

  // class Cube {
  //   constructor(x, y, z, text, name) {
  //     let dynamicTexture  = new THREEx.DynamicTexture(512,512);
  //     dynamicTexture.context.font = "bold "+(1*512)+"px Arial";
  //     let mat = new THREE.MeshBasicMaterial(
  //       { color: 0xB60C48,
  //         transparent: false, opacity: .9, wireframe: !text,
  //         map: dynamicTexture.texture  }
  //     );
  //     dynamicTexture.clear('white').drawText(text, 128, 435, 'black');
  //     let cube = new THREE.Mesh( geometry, mat );
  //     cube.position.set(x,y,z);
  //     cube.name = name;
  //     scene.add(cube);
  //   }
  // }

  function cube(x, y, z, text, name) {
    var dynamicTexture = new THREEx.DynamicTexture(512, 512);
    dynamicTexture.context.font = 'bold ' + 1 * 512 + 'px Arial';
    var mat = new THREE.MeshBasicMaterial({ color: 0xB60C48,
      transparent: false, opacity: .9, wireframe: !text,
      map: dynamicTexture.texture });
    dynamicTexture.clear('white').drawText(text, 128, 435, 'black');
    var cube = new THREE.Mesh(geometry, mat);
    cube.position.set(x, y, z);
    cube.name = name;
    scene.add(cube);
  }

  function drawNumbers() {

    //top //1,1 3 1,1
    for (var i = 0; i < c.length; i++) {
      for (var n = 0; n < c[i].length; n++) {
        cube(i, b.length + c[i].length - n, 0, c[i][n], '0');
      }
    }

    //left //1 3 1 1,1
    for (var i = 0; i < b.length; i++) {
      for (var n = 0; n < b[i].length; n++) {
        cube(-1 - b[i].length + n, b.length - 1 - i, 0, b[i][n], '0');
      }
    }

    //body
    for (var x = 0; x < ar[0].length; x++) {
      for (var y = 0; y < ar.length; y++) {
        cube(x, y, 0, ar[y][x] ? 'X' : '', '1');
      }
    }
  }
  drawNumbers();
}

function onMouseDown(event) {
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersect = raycaster.intersectObjects(scene.children)[0];
  if (intersect && intersect.object.name === '1') {
    intersect.object.material.wireframe = !intersect.object.material.wireframe;
  }
  //if(intersect) intersect.object.material.color.set( 0xffffff );
  //if(intersect && !intersect.object.material.color.r) scene.remove(intersect.object);
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
drawCubes();
render();

window.addEventListener('mousedown', onMouseDown, false);