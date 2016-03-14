function Ball(obj) {
  Circle.call(this, obj);

  this.dx = obj.speed;
  this.dy = obj.speed;

  _app.objects.push(this);
}

inheritPrototype(Ball, Circle);

Object.assign(Ball.prototype, {

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
    _app.score.changeFrom('ball sped up');
  },

  speedDown:  function() {
    if (this.dx > 0) { this.dx--; }
    else if (this.dx < 0) { this.dx++; }
    _app.score.changeFrom('ball sped down');
  },

  superSpeed: function() {
    this.dy = this.dy + 2;
    _app.score.changeFrom('ball hit bottom');
  },

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
