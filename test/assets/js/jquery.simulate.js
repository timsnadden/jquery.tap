(function($, document) {
    'use strict';

    var _addTouch = function(count, e) {
        var touches = [];
        var i = 0;

        for (; i < count; i++) {
            touches.push({
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                screenX: e.screenX,
                screenY: e.screenY
            });
        }

        return touches;
    };

    $.fn.simulate = function(type, options, touches) {
        var rawTouches = touches;
        touches = touches != null ? touches : 1;
        return this.each(function() {
            var e = document.createEvent('MouseEvent');
            options = $.extend({
                bubbles: true,
                cancelable: (type !== 'mousemove'),
                view: window,
                detail: 0,
                clientX: 0,
                clientY: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                button: 0,
                relatedTarget: undefined
            }, options );

            e.initMouseEvent(type, true, true,
                options.view, options.detail,
                options.clientX, options.clientY,
                options.clientX, options.clientY,
                options.ctrlKey, options.shiftKey,
                options.altKey, options.metaKey,
                options.button, options.target || options.relatedTarget
            );

            if (type.indexOf('touch') === 0) {
                e.changedTouches = _addTouch(touches, e);
                if (type !== 'touchend' || rawTouches) {
                    e.touches = _addTouch(touches, e);
                } else {
                    e.touches = [];
                }
            }

            // FF seems to bork the timeStamp property when
            // simulating a event. Manually set a getter that
            // returns a Date.now() value
            try {
                var now = Date.now();
                Object.defineProperty(e, 'timeStamp', {
                    get: function() {
                        return now;
                    }
                });
            } catch(e) {}

            this.dispatchEvent(e);
        });
    };

}(jQuery, document));