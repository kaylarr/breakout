init();

_canvas.width  = window.innerWidth;
_canvas.height = window.innerHeight;
_canvas.setAttribute('style', 'background: black;');

_context.clear = function() { this.clearRect(0, 0, _canvas.width, _canvas.height); }

var
  framesPerSecond = 60,

  ball = new Ball({
    radius: 10,
    speed: 5
  }),

  paddle = new Paddle({
    width: 50,
    speed: 10
  })
;

paddle.addListeners();

setInterval(function() {
  _context.clear();
  ball.draw();
  paddle.draw();

}, 1000 / framesPerSecond);
