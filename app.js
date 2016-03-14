var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

app.set('view engine', 'jade');

app.use('/assets', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(port);
