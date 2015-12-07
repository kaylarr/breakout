var canvas = document.getElementsByTagName('canvas')[0];
var context = canvas.getContext('2d');
context.clear = function() { this.clearRect(0, 0, canvas.width, canvas.height); }

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
canvas.setAttribute('style', 'background: white;');

var framesPerSecond = 60;
var ball = new Ball(10, '#c14446', 10);

setInterval(function() {
  context.clear();

  ball.draw();
  ball.updatePosition();

}, 1000 / framesPerSecond);
