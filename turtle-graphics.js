(function (exports) {
    var canvas = window.document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext('2d');
    var width = parseInt(canvas.width);
    var heigt = parseInt(canvas.height);

    // default state.
    var x = width / 2.0;
    var y = heigt / 2.0;
    var dir = 0.0;
    var isPenDown = true;

    var moveTo = function (distance) {
        var fn = isPenDown ? ctx.lineTo : ctx.moveTo;
        ctx.moveTo(x, y);

    };

    var turtle = {
        'moveTo': moveTo
    };
    exports.turtle = turtle;

})(window);