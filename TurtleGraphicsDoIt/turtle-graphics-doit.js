/// <reference path="turtle-graphics.js" />
(function (window, $) {

    $.fn.extend({
        // Helper Function for Caret positioning
        caret: function (begin, end) {
            if (this.length == 0) return;
            if (typeof begin == 'number') {
                end = (typeof end == 'number') ? end : begin;
                return this.each(function () {
                    if (this.setSelectionRange) {
                        this.focus();
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        var range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    var range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        },
        rotate: function (degree) {
            var newVal = 'rotate(' + (degree.toString()) + 'deg)';
            this.css({
                '-moz-transform': newVal,
                '-ms-transform': newVal,
                '-o-transform': newVal,
                '-webkit-transform': newVal,
                'transform': newVal
            });
            return this;
        }
    });

    var $canvas = $('canvas');
    var canvas = $canvas[0];
    var context = canvas.getContext('2d');
    var width = parseInt(canvas.width);
    var height = parseInt(canvas.height);
    window.turtle = new TurtleClass(context, width, height);

    var cursor = $('#cursor');
    var cursorSize = { 'width': cursor.width(), 'height': cursor.height() };
    var canvasPos = $canvas.position();
    var updateCursor = function (state) {
        cursor.css({
            'left': state.x + canvasPos.left - (cursorSize.width / 2),
            'top': state.y + canvasPos.top - (cursorSize.height / 2)
        })
        .rotate(state.degree + 90);
    }
    window.turtle.onupdate = updateCursor;
    window.turtle.reset();
    cursor.addClass('ready');

    // Hack to safety JavaScript Sand Box.
    var sandBox = null;
    window.setTimeout(function () {
        sandBox = new SandBox(['turtle', 'console', 'alert']);
    }, 100);

    var run = function (speed) {
        window.turtle.reset();
        window.turtle.setSpeed(speed !== undefined ? speed : parseInt($('#speed').val()));

        var code = $('#code-area').val();
        try {
            sandBox.Run(code);
        }
        catch (e) {
            alert(e);
        }
    }

    $('#btn-run').click(function (e) {
        e.preventDefault();
        run();
    });

    $('#btn-publish').click(function (e) {
        e.preventDefault();
        if (confirm('Sure?') == false) return;
        run(0);
        $('#graphic-data-URL').val(canvas.toDataURL());
        $('form').submit();
    });

    var indent = function ($this, getTabSpace) {
        getTabSpace = getTabSpace || function ($this, tabStartPos) {
            return Array(4 - ((tabStartPos + 4) % 4) + 1).join(' ');
        };

        var caret = $this.caret();
        if (caret.begin != caret.end) return;
        var val = $this.val();
        var left = val.substring(0, caret.begin);
        var right = val.substring(caret.end);

        var tabStartPos = ('\n' + left).match(/\n(.*)$/)[1].length; // crop caret.begin to row head.
        var tabSpace = getTabSpace($this, tabStartPos);
        $this.val(left + tabSpace + right).caret(caret.begin + tabSpace.length);
    };
    var deindent = function ($this) {
        var caret = $this.caret();
        if (caret.begin != caret.end) return;
        var val = $this.val();
        var left = val.substring(0, caret.begin);
        var right = val.substring(caret.end);

        var newleft = ('\n' + left).replace(/^([\s\S]*\n)([ ]+)$/,
            function (all, head, indent) {
                var newindent = Array(parseInt(Math.max(0, indent.length - 1) / 4) * 4 + 1).join(' ');
                return [head, newindent].join('');
            }).substring(1);
        $this.val(newleft + right).caret(newleft.length);
    };

    var keyEnter = function (e, $this) {
        var caret = $this.caret();
        var val = $this.val();
        var left = '\n' + val.substring(0, caret.begin);
        var indentspace = (left.match(/\n([ ]*)[^\n]*$/i) || ['', ''])[1];
        setTimeout(function () {
            indent($this, function (_, __) { return indentspace; });
            if (left.match(/\{$/) != null) indent($this);
        }, 0);
    };

    $codearea = $('#code-area');
    $codearea
        .keydown(function (e) {
            $this = $(this);

            if (e.keyCode == 13/*Enter*/) {
                keyEnter(e, $this);
            }
            else if (e.keyCode == 9/*Tab*/) {
                e.preventDefault();
                if (e.shiftKey == false) indent($this);
                else deindent($this);
            }
        })
        .keypress(function (e) {
            $this = $(this);
            if (e.charCode == "}".charCodeAt(0)) {
                deindent($this);
            }
        });

    $(document).keydown(function (e) {
        if (e.altKey == true && e.keyCode == "R".charCodeAt(0)) {
            e.preventDefault();
            run();
        }
    });

})(window, jQuery);