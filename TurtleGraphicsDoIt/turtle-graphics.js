(function (exports) {

    var toRad = function (degree) {
        return degree * Math.PI / 180;
    };

    function TurtleClass(context) {

        // state.
        var x, y, degree, isPenDown;

        this.onupdate = function () { };

        this.reset = function () {
            x = context.width / 2.0;
            y = context.heigt / 2.0;
            degree = 270.0;
            isPenDown = true;
            this.onupdate();
        };
        this.reset();

        this.move = function (distance) {
            var fn = isPenDown ? context.lineTo : context.moveTo;
            context.moveTo(x, y);
            var rad = toRad(degree);
            x += Math.cos(rad) * distance;
            y += Math.sin(rad) * distance;
            fn.apply(context, [x, y]);
            context.stroke();
            this.onupdate();
        };

        this.turn = function (delta) {
            degree = (degree + delta) % 360.0;
            this.onupdate();
        }

        this.penUp = function () {
            isPenDown = false;
        }
        this.penDown = function () {
            isPenDown = true;
        }

        this.getPosition = function () {
            return { "x": x, "y": y };
        }
        this.getRotate = function () {
            return degree;
        }
    };
    exports.TurtleClass = TurtleClass;
})(window);