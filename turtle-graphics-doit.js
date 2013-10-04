(function (window, $) {
    var run = function () {
        var code = $('#code').val();
        (function (window, $) {
            //Function(code)();
            eval(code);
        })(null, null);
    }
    $('#run').click(function (e) {
        e.preventDefault();
        run();
    });
})(window, jQuery);