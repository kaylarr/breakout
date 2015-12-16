function app() {
  return {
    init: function(obj) {
      this.canvas = document.getElementsByTagName('canvas')[0];
      this.context = _app.canvas.getContext('2d');
      this.playing = true;
      this.objects = [];
      this.fps = obj.fps;

      this.brickProps = {
        width: 75,
        height: 20,

        offsetTop: 30,
        offsetLeft: 300,
        padding: 10,

        rowCount: 6,
        columnCount: 2
      };

      this.addBricks();
    },

    addBricks: function() {
      for (var c = 0; c < this.brickProps.columnCount; c++) {
        for (var r = 0; r < this.brickProps.rowCount; r++) {
          var xPosition = c * (this.brickProps.width + this.brickProps.padding) + this.brickProps.offsetLeft;
          var yPosition = r * (this.brickProps.height + this.brickProps.padding) + this.brickProps.offsetTop;
          new Brick({
            x: xPosition,
            y: yPosition,
            width: this.brickProps.width,
            height: this.brickProps.height
          });
        }
      }
    }
  }
}


function inheritPrototype(child, parent) {
  var proto = Object.create(parent.prototype);
  proto.constructor = child;
  child.prototype = proto;
}

function addPrototypeFunctions(proto, functions) {
  for (var name in functions) { proto[name] = functions[name]; }
}


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


function Paddle(obj) {
  Rectangle.call(this, obj);

  this.speed = obj.speed;
  this.x = this.x || _app.canvas.width / 2;
  this.y = this.y || _app.canvas.height - this.height;

  this.addListeners();
}

inheritPrototype(Paddle, Rectangle);
addPrototypeFunctions(Paddle.prototype, {

  addListeners: function() {
    document.addEventListener('keydown', this, false);
    document.addEventListener('keyup', this, false);
  },

  canMoveLeft:  function() { return this.x > 0; },
  canMoveRight: function() { return this.x < _app.canvas.width - this.width; },

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
    if (this.isMovingLeft() && this.canMoveLeft()) {
      this.x -= this.speed;
    }
    else if (this.isMovingRight() && this.canMoveRight()) {
      this.x += this.speed;
    }
  }
});



function Circle(obj) {
  this.x = obj.x || _app.canvas.width / 2;
  this.y = obj.y || _app.canvas.height / 2;
  this.radius = obj.radius;
}

Circle.prototype.draw = function() {
  _app.context.beginPath();
  _app.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
  _app.context.fillStyle = '#fff';
  _app.context.fill();
  _app.context.closePath();
}



function Ball(obj) {
  Circle.call(this, obj);

  this.dx = obj.speed;
  this.dy = obj.speed;

  _app.objects.push(this);
}

inheritPrototype(Ball, Circle);
addPrototypeFunctions(Ball.prototype, {

  newY: function() { return this.y - this.dy; },
  newX: function() { return this.x + this.dx; },

  top:    function() { return this.newY() - this.radius },
  bottom: function() { return this.newY() + this.radius },
  right:  function() { return this.newX() + this.radius },
  left:   function() { return this.newX() - this.radius },

  bounceOff: function(object) {
    if (object instanceof Paddle && object.isMoving()) {
      this.reactToMovementOf(object);
    }
    else {
      if (this.hitTopOf(object) || this.hitBottomOf(object)) {
        this.reverseDy();
      }
      else if (this.hitRightOf(object) || this.hitLeftOf(object)) {
        this.reverseDx();
      }
      else {
        this.reverseDy();
      }
    }
  },

  checkBoundaryCollisions: function() {
    if (this.newY() - this.radius < 0) {
      this.reverseDy();
    } else if (this.newY() + this.radius > _app.canvas.height) {
      this.hitTheBottom();
    }

    if (this.newX() + this.radius > _app.canvas.width || this.newX() - this.radius < 0) {
      this.reverseDx();
    }
  },

  checkObjectCollisions: function() {
    for (var i = 0; i < _app.objects.length; i++) {
      var object = _app.objects[i];

      if (this.willHit(object)) {
        this.bounceOff(object);
        if (object instanceof Brick) { object.destroy(); }
      }
    }
  },

  draw: function() {
    this.updatePosition();
    Circle.prototype.draw.call(this);
  },

  hitTheBottom: function() {
    this.reverseDy();
    this.superSpeed();

    if (this.isTooFast()) { _app.playing = false; }
  },

  hitTopOf: function(object) {
    return this.bottom() <= object.y + object.height &&
      this.bottom() >= object.y &&
      this.x >= object.x &&
      this.x <= object.x + object.width;
  },

  hitBottomOf: function(object) {
    return this.top() <= object.y + object.height &&
      this.top() >= object.y &&
      this.x >= object.x &&
      this.x <= object.x + object.width;
  },

  hitLeftOf: function(object) {
    return this.right() <= object.x + object.width &&
      this.right() >= object.x &&
      this.y >= object.y &&
      this.y <= object.y + object.height;
  },

  hitRightOf: function(object) {
    return this.left() <= object.x + object.width &&
      this.left() >= object.x &&
      this.y >= object.y &&
      this.y <= object.y + object.height;
  },

  hitsSideOf: function(object) {
    return this.hitRightOf(object) || this.hitLeftOf(object);
  },

  isStationary: function() { return this.dx == 0 },

  isTooFast: function() { return this.dy > 30; },

  matchesDirectionOf: function(object) {
    if (object.isMovingRight()) {
      return this.dx > 0;
    }
    else if (object.isMovingLeft()) {
      return this.dx < 0;
    }
    else {
      return false;
    }
  },

  reactToMovementOf: function(object) {
    // When ball without x movement hits top of moving paddle and takes on movement
    if (this.isStationary()) {
      this.dx = object.isMovingRight() ? 1 : -1;
      this.reverseDy();
    }

    // When ball hits side of paddle
    else if (this.hitsSideOf(object)) {

      // When ball and paddle are moving in the same direction
      if (this.matchesDirectionOf(object)) {

        // When ball is moving faster and toward paddle
        if (Math.abs(this.dx) > Math.abs(object.speed)) {
          // Ball loses a lot of speed
          this.dx -= this.dx > 0 ? object.speed : -object.speed;
          // Ball bounces off of paddle
          this.reverseDx();
          }

        // When paddle is moving faster and toward ball
        else {
          // Ball gains a lot of speed
          this.dx += this.dx > 0 ? object.speed : -object.speed;
        }
      }

      // When ball and paddle are moving toward one another
      else {
        // Ball gains momentum from paddle
        this.dx += this.dx > 0 ? object.speed : -object.speed
        this.reverseDx();
      }
    }

    // When ball has x movement and hits top of paddle
    else {
      if (this.matchesDirectionOf(object)) { this.speedUp(); }
      else { this.speedDown(); }
      this.reverseDy();
    }
  },

  reverseDx: function() { this.dx = -this.dx; },
  reverseDy: function() { this.dy = -this.dy; },

  speedUp: function() {
    if (this.dx >= 0) { this.dx++; }
    else { this.dx--; }
  },

  speedDown:  function() {
    if (this.dx > 0) { this.dx--; }
    else if (this.dx < 0) { this.dx++; }
  },

  superSpeed: function() { this.dy = this.dy + 2; },

  updatePosition: function() {
    this.checkBoundaryCollisions();
    this.checkObjectCollisions();
    this.x += this.dx;
    this.y -= this.dy;
  },

  willHit: function(object) {
    return this.willBeWithinX(object) && this.willBeWithinY(object);
  },

  willBeWithinX: function(object) {
    return this.newX() + this.radius >= object.x &&
           this.newX() - this.radius <= object.x + object.width;
  },

  willBeWithinY: function(object) {
    return this.newY() + this.radius >= object.y &&
           this.newY() - this.radius <= object.y + object.height;
  }
});
