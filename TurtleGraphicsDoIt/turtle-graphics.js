(function (exports) {

    var toRad = function (degree) {
        return degree * Math.PI / 180;
    };

    function TurtleClass(context) {

        var me = this;

        // state.
        var state = { x: 0, y: 0, degree: 270, isPenDown: true, speed: 0 };

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
                if (state.speed == 0) fn.apply(turtle, []);
                else {
                    queue.push(fn);
                    if (timerId === null) timerId = window.setInterval(run, state.speed - 1);
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
            state.x = context.width / 2.0;
            state.y = context.heigt / 2.0;
            state.degree = 270.0;
            state.isPenDown = true;
            runner.reset();
            this.onupdate(state);
        };
        this.reset();

        this.move = function (distance) {
            runner.registerToQueue(function () {
                var fn = state.isPenDown ? context.lineTo : context.moveTo;
                context.moveTo(state.x, state.y);
                var rad = toRad(state.degree);
                state.x += Math.cos(rad) * distance;
                state.y += Math.sin(rad) * distance;
                fn.apply(context, [state.x, state.y]);
                context.stroke();
                this.onupdate(state);
            });
        };

        this.turn = function (delta) {
            runner.registerToQueue(function () {
                state.degree = (state.degree + delta) % 360.0;
                this.onupdate(state);
            });
        }

        this.penUp = function () {
            runner.registerToQueue(function () { state.isPenDown = false; });
        }
        this.penDown = function () {
            runner.registerToQueue(function () { state.isPenDown = true; });
        }

        this.setSpeed = function (msec) {
            state.speed = msec;
        }
    };
    exports.TurtleClass = TurtleClass;
})(window);