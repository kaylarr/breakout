initCanvas();

_canvas.width  = window.innerWidth;
_canvas.height = window.innerHeight;
_canvas.setAttribute('style', 'background: black;');

_context.clear = function() { this.clearRect(0, 0, _canvas.width, _canvas.height); }

var
  framesPerSecond = 60,
  paddle = new Paddle({height: 25, width: 150, speed: 20}),
  balls = [
    new Ball({radius: 25, speed: 8}),
  ],
  bricks = [],
  _obstacles = [paddle]
;

paddle.addListeners();

var _playing = true;

var game = setInterval(function() {
  _context.clear();
  if (_playing) {
    balls.forEach(function(ball) { ball.draw(); });
    bricks.forEach(function(brick) { brick.draw(); });
    paddle.draw();
  } else {
    paddle.draw();
    clearInterval(game);
  }
}, 1000 / framesPerSecond);
