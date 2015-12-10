function initCanvas() {
  _canvas = document.getElementsByTagName('canvas')[0];
  _context = _canvas.getContext('2d');
}

var _app = {
  endGame: function() {
    console.log("Bottom");
  }
};

// Inheritance assistants

function inheritPrototype(child, parent) {
  var proto = Object.create(parent.prototype);
  proto.constructor = child;
  child.prototype = proto;
}

function addPrototypeFunctions(proto, functions) {
  for (var name in functions) { proto[name] = functions[name]; }
}

// Rectangle
// Inherit via parasitic combination inheritance

function Rectangle(obj) {
  this.width = obj.width;
  this.height = obj.height || obj.width;
  this.x = obj.x;
  this.y = obj.y;
}

Rectangle.prototype.draw = function() {
  _context.beginPath();
  _context.rect(this.x, this.y, this.width, this.height);
  _context.fillStyle = '#fff';
  _context.fill();
  _context.closePath();
}

// Paddle < Obstacle

function Paddle(obj) {
  Rectangle.call(this, obj);

  this.speed = obj.speed;
  this.x = this.x || _canvas.width / 2;
  this.y = this.y || _canvas.height - this.height;
}

inheritPrototype(Paddle, Rectangle);
addPrototypeFunctions(Paddle.prototype, {

  addListeners: function() {
    document.addEventListener('keydown', this, false);
    document.addEventListener('keyup', this, false);
  },

  canMoveLeft:  function() { return this.x > 0; },
  canMoveRight: function() { return this.x < _canvas.width - this.width; },
  canMoveUp:    function() { return this.y - this.height > 0 },
  canMoveDown:  function() { return this.y + this.height < _canvas.height },

  draw: function() {
    this.updatePosition();
    Rectangle.prototype.draw.call(this);
  },

  handleEvent: function(event) {
    switch(event.type) {
      case 'keydown':
        if      (event.keyCode == 37) { this.keyLeft  = true; }
        else if (event.keyCode == 38) { this.keyUp    = true; }
        else if (event.keyCode == 39) { this.keyRight = true; }
        else if (event.keyCode == 40) { this.keyDown  = true; }
        break;

      case 'keyup':
        if      (event.keyCode == 37) { this.keyLeft  = false; }
        else if (event.keyCode == 38) { this.keyUp    = false; }
        else if (event.keyCode == 39) { this.keyRight = false; }
        else if (event.keyCode == 40) { this.keyDown  = false; }
        break;
    }
  },

  isMovingLeft:  function() { return this.keyLeft  && !this.keyRight; },
  isMovingRight: function() { return this.keyRight && !this.keyLeft; },
  isMovingUp:    function() { return this.keyUp    && !this.keyDown; },
  isMovingDown:  function() { return this.keyDown  && !this.keyUp; },

  updatePosition: function() {
    if (this.isMovingLeft() && this.canMoveLeft()) { this.x -= this.speed; }
    else if (this.isMovingRight() && this.canMoveRight()) { this.x += this.speed; }

    if (this.isMovingUp() && this.canMoveUp()) { this.y -= this.speed; }
    else if (this.isMovingDown() && this.canMoveDown()) { this.y += this.speed; }
  }
});

// Brick < Obstacle

function Brick(obj) {
  Rectangle.call(this, obj);
}

inheritPrototype(Brick, Rectangle);
addPrototypeFunctions(Brick.prototype, {
});

// Ball

function Ball(obj) {
  this.radius = obj.radius;
  this.speed = obj.speed;

  this.x = _canvas.width / 2;
  this.y = _canvas.height /2;

  var dx = obj.speed;
  var dy = obj.speed;

  this.getDx = function() { return dx; };
  this.getDy = function() { return dy; };

  this.reverseDx = function() { dx = -dx; };
  this.reverseDy = function() { dy = -dy; };
}

addPrototypeFunctions(Ball.prototype, {
  newY: function() { return this.y - this.getDy(); },
  newX: function() { return this.x + this.getDx(); },

  checkBoundaryCollisions: function() {
    if (this.newY() - this.radius < 0) { this.reverseDy(); }
    else if (this.newY() + this.radius > _canvas.height) { this.reverseDy(); _app.endGame(); }
    this.y -= this.getDy();

    if (this.newX() + this.radius > _canvas.width || this.newX() - this.radius < 0) { this.reverseDx(); }
    this.x += this.getDx();
  },

  checkObstacleCollisions: function() {
    for (var i = 0; i < _obstacles.length; i++) {
      var rect = _obstacles[i];
      if (this.willHitRectangle(rect)) {
        if (this.hitsHorizontal(rect)) { this.reverseDy(); }
        else { this.reverseDx(); }
      }
    }
  },

  draw: function() {
    this.updatePosition()

    _context.beginPath();
    _context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    _context.fillStyle = '#fff';
    _context.fill();
    _context.closePath();
  },

  hitsHorizontal: function(rectangle) {
    return fallsWithinX(rectangle) 
  },

  updatePosition: function() {
    this.checkBoundaryCollisions();
    this.checkObstacleCollisions();
  },

  willHitRectangle: function(rectangle) {
    return this.fallsWithinX(rectangle) && this.fallsWithinY(rectangle);
  },

  fallsWithinX: function(rectangle) {
    return this.newX() + this.radius >= rectangle.x &&
           this.newX() - this.radius <= rectangle.x + rectangle.width;
  },

  fallsWithinY: function(rectangle) {
    return this.newY() + this.radius >= rectangle.y &&
           this.newY() - this.radius <= rectangle.y + rectangle.height;
  }
});
