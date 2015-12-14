var _app = app();
_app.init(60);

_canvas.width  = window.innerWidth;
_canvas.height = window.innerHeight;
_canvas.setAttribute('style', 'background: black;');

_context.clear = function() { this.clearRect(0, 0, _canvas.width, _canvas.height); }

new Paddle({height: 25, width: 150, speed: 20});
new Ball({radius: 25, speed: 8});

var game = setInterval(function() {
  _context.clear();
  if (_playing) {
    _objects.forEach(function(object) { object.draw(); });
  }
  else {
    clearInterval(game);
  }
}, 1000 / _app.fps);
