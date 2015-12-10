initCanvas();

_canvas.width  = window.innerWidth;
_canvas.height = window.innerHeight;
_canvas.setAttribute('style', 'background: black;');

_context.clear = function() { this.clearRect(0, 0, _canvas.width, _canvas.height); }

var
  framesPerSecond = 60,
  paddle = new Paddle({width: 200, speed: 2}),
  balls = [
    new Ball({radius: 50, speed: 2}),
  ],
  bricks = [],
  _obstacles = [paddle]
;

paddle.addListeners();

setInterval(function() {
  _context.clear();
  balls.forEach(function(ball) { ball.draw(); });
  bricks.forEach(function(brick) { brick.draw(); });
  paddle.draw();
}, 1000 / framesPerSecond);
