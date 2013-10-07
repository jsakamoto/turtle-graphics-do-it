(function (exports) {

    var toRad = function (degree) {
        return degree * Math.PI / 180;
    };

    function TurtleClass(context) {

        var me = this;

        // state.
        var x, y, degree, isPenDown, speed = 0;

        // runner
        function Runner(turtle) {
            var me = this;
            var timerId = null, queue = [];

            var run = function () {
                if (queue.length > 0) {
                    var fn = queue[0];
                    queue = queue.slice(1);
                    fn.apply(turtle, []);
                }
                if (queue.length == 0) {
                    me.reset();
                }
            }

            this.registerToQueue = function (fn) {
                if (speed == 0) fn.apply(turtle, []);
                else {
                    queue.push(fn);
                    if (timerId === null) timerId = window.setInterval(run, speed - 1);
                }
            };
            this.stop = function () {
                if (timerId !== null) {
                    window.clearInterval(timerId);
                    timerId = null;
                }
            };
            this.reset = function () {
                this.stop();
                queue = [];
            }
        };
        var runner = new Runner(this);

        this.onupdate = function () { };

        this.reset = function () {
            x = context.width / 2.0;
            y = context.heigt / 2.0;
            degree = 270.0;
            isPenDown = true;
            runner.reset();
            this.onupdate();
        };
        this.reset();

        this.move = function (distance) {
            runner.registerToQueue(function () {
                var fn = isPenDown ? context.lineTo : context.moveTo;
                context.moveTo(x, y);
                var rad = toRad(degree);
                x += Math.cos(rad) * distance;
                y += Math.sin(rad) * distance;
                fn.apply(context, [x, y]);
                context.stroke();
                this.onupdate();
            });
        };

        this.turn = function (delta) {
            runner.registerToQueue(function () {
                degree = (degree + delta) % 360.0;
                this.onupdate();
            });
        }

        this.penUp = function () {
            runner.registerToQueue(function () { isPenDown = false; });
        }
        this.penDown = function () {
            runner.registerToQueue(function () { isPenDown = true; });
        }

        this.getPosition = function () {
            return { "x": x, "y": y };
        }
        this.getRotate = function () {
            return degree;
        }

        this.setSpeed = function (msec) {
            speed = msec;
            console.log(speed);
        }
    };
    exports.TurtleClass = TurtleClass;
})(window);