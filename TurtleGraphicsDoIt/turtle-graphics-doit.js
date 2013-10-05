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
        }
    });


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
        if (confirm('Sure?') == false) return;
        run();
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