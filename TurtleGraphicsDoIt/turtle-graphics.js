(function (exports) {

    var toRad = function (degree) {
        return degree * Math.PI / 180;
    };

    function TurtleClass(context, width, height) {

        var me = this;

        // state.
        var state = {
            x: 0,
            y: 0,
            degree: 270,
            isPenDown: true,
            speed: 0,
            penColor: '#000',
            penWidth: 1.0
        };

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

            context.beginPath();
            context.clearRect(0, 0, width, height);
            context.closePath();

            state.x = width / 2.0;
            state.y = height / 2.0;
            state.degree = 270.0;
            state.isPenDown = true;
            state.penColor = '#000';
            state.penWidth = 1.0;
            runner.reset();
            this.onupdate(state);
        };
        this.reset();

        this.move = function (distance) {
            runner.registerToQueue(function () {
                var fn = state.isPenDown ? context.lineTo : context.moveTo;
                context.beginPath();
                context.strokeStyle = state.penColor;
                context.lineWidth = state.penWidth;
                context.lineCap = 'round';
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

        this.setColor = function (color) {
            runner.registerToQueue(function () {
                state.penColor = color;
                this.onupdate(state);
            });
        }

        this.setWidth = function (width) {
            runner.registerToQueue(function () {
                state.penWidth = Math.min(Math.max(1, parseFloat('' + width)), 100);
                this.onupdate(state);
            });
        }
    };
    exports.TurtleClass = TurtleClass;
})(window);