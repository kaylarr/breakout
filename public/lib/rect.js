//
// Rectangle
//

function Rectangle(obj) {
  this.width = obj.width;
  this.height = obj.height;
  this.x = obj.x;
  this.y = obj.y;
  _app.objects.push(this);
}

addPrototypeFunctions(Rectangle.prototype, {
  draw: function() {
    _app.context.beginPath();
    _app.context.rect(this.x, this.y, this.width, this.height);
    _app.context.fillStyle = '#fff';
    _app.context.fill();
    _app.context.closePath();
  }
});
