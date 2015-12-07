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

  this.reverseDx = function() { dx = -dx; };
  this.reverseDy = function() { dy = -dy; };
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
    var newX = this.x + this.getDx();
    if (newX + this.radius > canvas.width || newX - this.radius < 0) { this.reverseDx(); }
    this.x += this.getDx();

    var newY = this.y - this.getDy();
    if (newY + this.radius > canvas.height || newY - this.radius < 0) { this.reverseDy(); }
    this.y -= this.getDy();

  }
}
