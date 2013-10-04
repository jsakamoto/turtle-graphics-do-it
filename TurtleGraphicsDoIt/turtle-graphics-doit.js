/// <reference path="turtle-graphics.js" />
(function (window, $) {

    var canvas = window.document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext('2d');
    context.width = parseInt(canvas.width);
    context.heigt = parseInt(canvas.height);

    window.turtle = new TurtleClass(context);

    var run = function () {
        context.beginPath();
        context.clearRect(0, 0, context.width, context.heigt);
        context.closePath();
        window.turtle.reset();

        var code = $('#code-area').val();
        (function (window, $) {
            eval(code);
        })(null, null);
    }

    $('#btn-run').click(function (e) {
        e.preventDefault();
        run();
    });


    $('#btn-publish').click(function (e) {
        e.preventDefault();
        run();
        $('#graphic-data-URL').val(canvas.toDataURL());
        $('form').submit();
    });
})(window, jQuery);