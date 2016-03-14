function Score() {
  this.value = 0;
  this.multiplier = 1;
}
Object.assign(Score.prototype, {

  draw: function() {
    _app.context.font = "20pt Arial";
    _app.context.fillStyle = "#fff";
    _app.context.fillText(
      this.value + " * " + this.multiplier + " = " + this.value * this.multiplier,
      20, 40
    );
  },

  increment: function() {
    this.value++;
  },

  changeFrom: function(gameEvent) {
    switch (gameEvent) {
      case 'brick destroyed':
        _app.score.value += 5000;
        break;

      case 'ball hit bottom':
        break;

      case 'ball sped up':
        _app.score.multiplier += 1;
        break;

      case 'ball sped down':
        if (_app.score.multiplier > 1) {_app.score.multiplier--};
        break;
    }
  }
});

