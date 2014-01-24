/**
 * @fileOverview
 * Copyright (c) 2013 Aaron Gloege
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * jQuery Tap Plugin
 * Using the tap event, this plugin will properly simulate a click event
 * in touch browsers using touch events, and on non-touch browsers,
 * click will automatically be used instead.
 *
 * @author Aaron Gloege
 * @version 1.0.2
 */
(function(document, $) {
    'use strict';

    /**
     * Flag to determine if touch is supported
     *
     * @type Boolean
     * @final
     */
    var TOUCH = $.support.touch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

    /**
     * Event namespace
     *
     * @type String
     * @final
     */
    var HELPER_NAMESPACE = '._tap';

    /**
     * Event name
     *
     * @type String
     * @final
     */
    var EVENT_NAME = 'tap';

    /**
     * Max distance between touchstart and touchend to be considered a tap
     *
     * @type Number
     * @final
     */
    var MAX_TAP_DELTA = 40;

    /**
     * Max duration between touchstart and touchend to be considered a tap
     *
     * @type Number
     * @final
     */
    var MAX_TAP_TIME = 400;

    /**
     * Event variables to copy to touches
     *
     * @type String[]
     * @final
     */
    var EVENT_VARIABLES = 'clientX clientY screenX screenY pageX pageY'.split(' ');

    /**
     * Object for tracking current touch settings (x, y, target, canceled, etc)
     *
     * @type Object
     * @static
     */
    var TOUCH_VALUES = {

        /**
         * target element of touchstart event
         *
         * @property $el
         * @type jQuery
         */
        $el: null,

        /**
         * pageX position of touch on touchstart
         *
         * @property x
         * @type Number
         */
        x: 0,

        /**
         * pageY position of touch on touchstart
         *
         * @property y
         * @type Number
         */
        y: 0,

        /**
         * Number of touches currently active on touchstart
         *
         * @property count
         * @type Number
         */
        count: 0,

        /**
         * Has the current tap event been canceled?
         *
         * @property cancel
         * @type Boolean
         */
        cancel: false,

        /**
         * Start time
         *
         * @property start
         * @type Number
         */
        start: 0

    };

    /**
     * Create a new event from the original event
     * Copy over EVENT_VARIABLES from the first changedTouches
     *
     * @param {String} type
     * @param {jQuery.Event} e
     * @return {jQuery.Event}
     * @private
     */
    var _createEvent = function(type, e) {
        var originalEvent = e.originalEvent;
        var event = $.Event(originalEvent);
        var touch = originalEvent.changedTouches ? originalEvent.changedTouches[0] : originalEvent;

        event.type = type;

        var i = 0;
        var length = EVENT_VARIABLES.length;

        for (; i < length; i++) {
            event[EVENT_VARIABLES[i]] = touch[EVENT_VARIABLES[i]];
        }

        return event;
    };

    /**
     * Determine if a valid tap event
     *
     * @param {jQuery.Event} e
     * @return {Boolean}
     * @private
     */
    var _isTap = function(e) {
        if (e.isTrigger) {
            return false;
        }
        
        var originalEvent = e.originalEvent;
        var touch = e.changedTouches ? e.changedTouches[0] : originalEvent.changedTouches[0];
        var xDelta = Math.abs(touch.pageX - TOUCH_VALUES.x);
        var yDelta = Math.abs(touch.pageY - TOUCH_VALUES.y);
        var delta = Math.max(xDelta, yDelta);

        return (
            e.timeStamp - TOUCH_VALUES.start < MAX_TAP_TIME &&
            delta < MAX_TAP_DELTA &&
            !TOUCH_VALUES.cancel &&
            TOUCH_VALUES.count === 1 &&
            Tap.isTracking
        );
    };

    /**
     * Tap object that will track touch events and
     * trigger the tap event when necessary
     *
     * @class Tap
     * @static
     */
    var Tap = {

        /**
         * Flag to determine if touch events are currently enabled
         *
         * @property isEnabled
         * @type Boolean
         */
        isEnabled: false,

        /**
         * Are we currently tracking a tap event?
         *
         * @property isTracking
         * @type Boolean
         */
        isTracking: false,

        /**
         * Enable touch event listeners
         *
         * @method enable
         */
        enable: function() {
            if (Tap.isEnabled) {
                return;
            }

            Tap.isEnabled = true;

            if (TOUCH) {
                $(document.body)
                    .on('touchstart' + HELPER_NAMESPACE, Tap.onTouchStart)
                    .on('touchend' + HELPER_NAMESPACE, Tap.onTouchEnd)
                    .on('touchcancel' + HELPER_NAMESPACE, Tap.onTouchCancel);
            } else {
                $(document.body)
                    .on('click' + HELPER_NAMESPACE, Tap.onClick);
            }
        },

        /**
         * Disable touch event listeners
         *
         * @method disable
         */
        disable: function() {
            if (!Tap.isEnabled) {
                return;
            }

            Tap.isEnabled = false;

            if (TOUCH) {
                $(document.body)
                    .off('touchstart' + HELPER_NAMESPACE, Tap.onTouchStart)
                    .off('touchend' + HELPER_NAMESPACE, Tap.onTouchEnd)
                    .off('touchcancel' + HELPER_NAMESPACE, Tap.onTouchCancel);
            } else {
                $(document.body)
                    .off('click' + HELPER_NAMESPACE, Tap.onClick);
            }
        },

        /**
         * Store touch start values and target
         *
         * @method onTouchStart
         * @param {jQuery.Event} e
         */
        onTouchStart: function(e) {
            var touches = e.originalEvent.touches;
            TOUCH_VALUES.count = touches.length;

            if (Tap.isTracking) {
                return;
            }

            Tap.isTracking = true;
            var touch = touches[0];

            TOUCH_VALUES.cancel = false;
            TOUCH_VALUES.start = e.timeStamp;
            TOUCH_VALUES.$el = $(e.target);
            TOUCH_VALUES.x = touch.pageX;
            TOUCH_VALUES.y = touch.pageY;
        },

        /**
         * If touch has not been canceled, create a
         * tap event and trigger it on the target element
         *
         * @method onTouchEnd
         * @param {jQuery.Event} e
         */
        onTouchEnd: function(e) {
            if (_isTap(e)) {
                TOUCH_VALUES.$el.trigger(_createEvent(EVENT_NAME, e));
            }
            // Cancel tap
            Tap.onTouchCancel(e);
        },

        /**
         * Cancel tap by setting TOUCH_VALUES.cancel to true
         *
         * @method onTouchCancel
         * @param {jQuery.Event} e
         */
        onTouchCancel: function(e) {
            Tap.isTracking = false;
            TOUCH_VALUES.cancel = true;
        },

        /**
         * Convert click event to tap
         *
         * @method onClick
         * @param {jQuery.Event} e
         */
        onClick: function(e) {
            if (e.isTrigger) {
                return;
            }

            $(e.target).trigger(_createEvent(EVENT_NAME, e));
        }

    };

    // Setup special event and enable
    // tap only if a tap event is bound
    $.event.special[EVENT_NAME] = {
        setup: Tap.enable
    };

}(document, jQuery));