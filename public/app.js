var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext('2d');
context.clear = function() { this.clearRect(0, 0, canvas.width, canvas.height); }

function Ball(radius, color, speed) {
  this.radius = radius;
  this.color = color;
  this.ballSpeed = speed;

  this.x = canvas.width / 2;
  this.y = canvas.height - this.radius;

  var dx = this.ballSpeed;
  var dy = this.ballSpeed;

  this.getDx = function() { return dx; };
  this.getDy = function() { return dy; };

  this.reverseDx = function() { this.dx = -this.dx; };
  this.reverseDy = function() { this.dy = -this.dy; };
}

Ball.prototype = {
  drawOuterCircle: function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    context.fillStyle = this.color;
    context.fill();
    context.strokeStyle = '#000';
    context.stroke();
    context.closePath();
  },
  drawInnerCircle: function() {
    context.beginPath();
    context.arc(this.x + this.radius/4, this.y - this.radius/4, this.radius/2, 0, Math.PI*2);
    context.fillStyle = '#fff';
    context.fill();
    context.closePath();
  },
  draw: function() {
    this.drawOuterCircle();
    this.drawInnerCircle();
  },
  updatePosition: function() {
    this.x += this.getDx();
    this.y -= this.getDy();
  }
}

var framesPerSecond = 60;
var ball = new Ball(10, '#c14446', 5);

setInterval(function() {
  context.clear();

  ball.draw();
  ball.updatePosition();

}, 1000 / framesPerSecond);
