(function (exports) {
    var canvas = exports.document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var width = parseInt(canvas.width);
    var heigt = parseInt(canvas.height);

    // default state.
    var x = width / 2.0;
    var y = heigt / 2.0;
    var degree = 270.0;
    var isPenDown = true;

    var toRad = function (degree) {
        return degree * Math.PI / 180;
    };

    var move = function (distance) {
        var fn = isPenDown ? ctx.lineTo : ctx.moveTo;
        ctx.moveTo(x, y);
        var rad = toRad(degree);
        x += Math.cos(rad) * distance;
        y += Math.sin(rad) * distance;
        fn.apply(ctx, [x, y]);
        ctx.stroke();
    };

    var turn = function (delta) {
        degree = (degree + delta) % 360.0;
    }

    var penUp = function () {
        isPenDown = false;
    }
    var penDown = function () {
        isPenDown = true;
    }

    var turtle = {
        'move': move,
        'turn': turn,
        'penUp': penUp,
        'penDown': penDown
    };
    exports.turtle = turtle;

})(window);