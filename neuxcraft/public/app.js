var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var renderer = new THREE.WebGLRenderer();
var winResize   = new THREEx.WindowResize(renderer, camera);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x333333, 0 );
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls( camera, renderer.domElement );

var l = 10;
var myColor;
var cubes;


function moveCamera (dst) {
  l = dst;
  controls.minDistance = l;
  controls.target = new THREE.Vector3(l/2,l/2,l/2);
  camera.position.set( l/2, l/2, 15+l );
};

moveCamera(l);

socket.on('init', function(data) {
  moveCamera(data.l);
  cubes = data.c;
  myColor = new THREE.Color(data.color);
  var text = document.getElementById('color');
  text.innerHTML = (data.color == 0x2CB4AD ? 'blue' : 'orange');
  text.style.color = (data.color == 0x2CB4AD ? 'cyan' : 'orange');
  document.getElementById('total').innerHTML = data.t;
  drawCubes();
});

socket.on('onlineCount', function(data) {
  document.getElementById('online').innerHTML = data;
});

socket.on('sync', function(data) {
  document.getElementById('total').innerHTML = data.t;
  var child = scene.children.filter(function(i) {
    return i.myId == data.r
  })[0];
  scene.remove(child);
});

socket.on('start', function(data) {
  scene.clear();
  document.getElementById('dog').innerHTML = data.s.dog;
  document.getElementById('cat').innerHTML = data.s.cat;
  moveCamera(data.l);
  cubes = data.c;
  drawCubes();
});

var geometry = new THREE.BoxGeometry( .95, .95, .95 );

function drawCubes(){
  for (var key in cubes) {
    var cu = cubes[key];
    var mat = new THREE.MeshBasicMaterial(
              {color: new THREE.Color(cu.color),
               transparent: true, opacity: 0.95,
               wireframe: false}
        );
    var cube = new THREE.Mesh( geometry, mat );
    cube.myId = cu.id;
    cube.position.set(cu.x, cu.y, cu.z);
    scene.add(cube);
  };
};

THREE.Object3D.prototype.clear = function(){
  var children = this.children;
  for(var i = children.length-1;i>=0;i--){
    var child = children[i];
    child.clear();
    this.remove(child);
  };
};

function onMouseDown( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersect = raycaster.intersectObjects(scene.children)[0];
  if(intersect) {
    if(intersect.object.material.color.b == myColor.b) {
      socket.emit('cubeClicked', {id: intersect.object.myId, c: myColor.b});
    }
  }
};

function render() {
  requestAnimationFrame( render );
  renderer.render(scene, camera);
};

render();

window.addEventListener( 'mousedown', onMouseDown, false );

$('form').submit(function(){
  var m = $('#m').val();
  if(m) {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  };
  return false;
});

socket.on('chat message', function(msg){
  if($('#messages li').length > 10){
    $('#messages li:first-child').remove();
  };
  $('#messages').append($('<li>').text(msg));
});