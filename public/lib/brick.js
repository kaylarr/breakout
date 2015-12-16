//
// Brick < Rectangle
//

function Brick(obj) {
  Rectangle.call(this, obj);
}

inheritPrototype(Brick, Rectangle);
addPrototypeFunctions(Brick.prototype, {

  destroy: function() {
    var index = _app.objects.indexOf(this)
    _app.objects.splice(index, 1);
  }

});
