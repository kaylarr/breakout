var _app = app();
_app.init({fps: 60});

_app.canvas.width  = window.innerWidth;
_app.canvas.height = window.innerHeight;
_app.canvas.setAttribute('style', 'background: black;');

_app.context.clear = function() { this.clearRect(0, 0, _app.canvas.width, _app.canvas.height); }

new Paddle({height: 25, width: 150, speed: 20});
new Ball({radius: 25, speed: 8});

var game = setInterval(function() {
  _app.context.clear();
  if (_app.playing) {
    _app.objects.forEach(function(object) { object.draw(); });
  }
  else {
    clearInterval(game);
  }
}, 1000 / _app.fps);
