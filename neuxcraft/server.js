var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

var l = 3;
var players = {};
var playersCount = 0;
var cubes = {};
var cubesCliked = 0;
var teamO = 0;
var teamB = 0;
var Cube = function(x,y,z,c,id){
  this.x = x;
  this.y = y;
  this.z = z;
  this.color = c;
  this.id = id;
}
var won = false;

var score = {cat: 0, dog: 0}
var orange = 0;
var blue = 0;

function newGame (n) {
  var cid = 0;
  var c;
  l<12 ? l++ : l=3;
  orange = 0;
  blue = 0;
  won = false;
  cubes = {};
  for(var x = 0; x<n; x++){
    for(var y = 0; y<n; y++){
      for(var z = 0; z <n; z++){
        if(Math.random() > 0.5){
          blue++;
          c = 0x2CB4AD;
        } else {
          orange++;
          c = 0xE95922;
        }
        cubes[cid] = new Cube(x,y,z, c, cid);
        cid++;
      }
    }
  }
}

// var Player = function (socket, team) {
//   this.socket = socket;
//   this.team = team;
// }


io.on('connection', function(socket) {

  if(teamB < teamO){
    var color = 0x2CB4AD;
    teamB++;
  } else {
    var color = 0xE95922;
    teamO++;
  }

  players[socket.id] = {s: socket, c: color };
  io.emit('onlineCount', ++playersCount);

  socket.emit('init', {c: cubes, l:l, color: color, t: cubesCliked});

  socket.on('disconnect', function() {
    players[socket.id].c == 0x2CB4AD ? teamB-- : teamO--;
    delete players[socket.id]
    io.emit('onlineCount', --playersCount);
  });

  socket.on('cubeClicked', function(data) {
    var remove = cubes[data.id];
    if(remove){
      cubesCliked++;
      delete cubes[data.id];
      data.c > 0.5 ? blue-- : orange--;

      if(!blue && !won){
        io.emit('chat message', 'Team Dog won');
        score.dog++;
        won = true;
      } 
      if(!orange && !won) {
        io.emit('chat message', 'Team Cat won');
        score.cat++;
        won = true;
      }

      io.emit('sync', {r: remove.id, t: cubesCliked});

      if(won){
        newGame(l);
        io.emit('start', {c: cubes, l: l, s:score});
      }
    }
  });

  socket.on('error', function(err) {
    console.log(err);
  })

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

})

newGame(l);

http.listen(process.env.PORT, process.env.IP);
//http.listen('3000');
