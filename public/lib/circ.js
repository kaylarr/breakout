function Circle(obj) {
  this.x = obj.x || _app.canvas.width / 2;
  this.y = obj.y || _app.canvas.height / 2;
  this.radius = obj.radius;
}

Circle.prototype.draw = function() {
  _app.context.beginPath();
  _app.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
  _app.context.fillStyle = '#fff';
  _app.context.fill();
  _app.context.closePath();
}
