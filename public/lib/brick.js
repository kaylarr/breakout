function Brick(obj) {
  Rectangle.call(this, obj);
}

inheritPrototype(Brick, Rectangle);

Brick.prototype.destroy = function () {
    var index = _app.objects.indexOf(this)
    _app.objects.splice(index, 1);
    _app.score.changeFrom('brick destroyed');
};
