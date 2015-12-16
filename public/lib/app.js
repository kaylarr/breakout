//
// Inheritance
//

function inheritPrototype(child, parent) {
  var proto = Object.create(parent.prototype);
  proto.constructor = child;
  child.prototype = proto;
}

function addPrototypeFunctions(proto, functions) {
  for (var name in functions) { proto[name] = functions[name]; }
}

//
// App
//

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

