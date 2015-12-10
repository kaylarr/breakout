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
  this.height = obj.height;
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

  draw: function() {
    this.updatePosition();
    Rectangle.prototype.draw.call(this);
  },

  handleEvent: function(event) {
    switch(event.type) {
      case 'keydown':
        if      (event.keyCode == 37) { this.keyLeft  = true; }
        else if (event.keyCode == 39) { this.keyRight = true; }
        break;

      case 'keyup':
        if      (event.keyCode == 37) { this.keyLeft  = false; }
        else if (event.keyCode == 39) { this.keyRight = false; }
        break;
    }
  },

  isMoving: function() { return this.isMovingLeft() || this.isMovingRight(); },
  isMovingLeft:  function() { return this.keyLeft  && !this.keyRight; },
  isMovingRight: function() { return this.keyRight && !this.keyLeft; },

  updatePosition: function() {
    if (this.isMovingLeft() && this.canMoveLeft()) { this.x -= this.speed; }
    else if (this.isMovingRight() && this.canMoveRight()) { this.x += this.speed; }
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

  this.x = _canvas.width / 2;
  this.y = _canvas.height /2;

  this.dx = obj.speed;
  this.dy = obj.speed;
}

addPrototypeFunctions(Ball.prototype, {

  newY: function() { return this.y - this.dy; },
  newX: function() { return this.x + this.dx; },

  checkBoundaryCollisions: function() {
    if (this.newY() - this.radius < 0) { this.reverseDy(); }
    else if (this.newY() + this.radius > _canvas.height) { this.reverseDy(); _app.endGame(); }
    this.y -= this.dy;

    if (this.newX() + this.radius > _canvas.width || this.newX() - this.radius < 0) { this.reverseDx(); }
    this.x += this.dx;
  },

  checkObstacleCollisions: function() {
    for (var i = 0; i < _obstacles.length; i++) {
      var object = _obstacles[i];

      if (this.willHit(object)) {
        this.reverseDy();

        if (object instanceof Paddle) {
          if (object.isMoving() && this.matchesDirectionOf(object)) {
            this.speedUp();
          } else if (object.isMoving()) {
            this.speedDown();
          } else {
            console.log("stay the same speed");
          }
        }
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

  matchesDirectionOf: function(object) {
    if (object.isMovingRight())     { return this.dx > 0; }
    else if (object.isMovingLeft()) { return this.dx < 0; }
    else { return false; }
  },

  reverseDx: function() { this.dx = -this.dx; },
  reverseDy: function() { this.dy = -this.dy; },

  speedUp: function () {
    console.log("speed up!");
    this.dx > 0 ? this.dx++ : this.dx--
  },

  speedDown: function() {
    console.log("speed down..");
    this.dx < 0 ? this.dx++ : this.dx--
  },

  updatePosition: function() {
    this.checkBoundaryCollisions();
    this.checkObstacleCollisions();
  },

  willHit: function(object) {
    return this.withinX(object) && this.withinY(object);
  },

  withinX: function(object) {
    return this.newX() + this.radius >= object.x &&
           this.newX() - this.radius <= object.x + object.width;
  },

  withinY: function(object) {
    return this.newY() + this.radius >= object.y &&
           this.newY() - this.radius <= object.y + object.height;
  }
});
