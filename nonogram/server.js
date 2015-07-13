var express = require('express');

var app = express();
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/lib'));
app.use('/', express.static(__dirname));
// app.get('/', function (req,res) {
//   res.render('index.html')
// })

app.listen(3000);
