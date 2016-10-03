/*jslint esversion: 6, -W097, browser: true */
/* globals jQuery: true, $: true */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('core-js/es5');
var $ = require('jquery');

var Notification = exports.Notification = function () {
    function Notification(message, container) {
        _classCallCheck(this, Notification);

        this.message = message;
        this.container = container;
    }

    _createClass(Notification, [{
        key: 'show',
        value: function show() {
            $(this.container).find('.notification').remove();
            this.$element = $('<div class="notification" role="alert">' + this.message + '</div>');
            $(this.container).append(this.$element);
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.$element.hide();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$element.remove();
        }
    }]);

    return Notification;
}();

var NotificationCenter = exports.NotificationCenter = function () {
    function NotificationCenter(options) {
        _classCallCheck(this, NotificationCenter);

        options = options || {};
        this.holder = options.holder;
        this.container = options.container;
        this.messages = [];
        this.timeout = options.timeout || 4000;
        this.animationY = options.animationY === undefined ? 60 : options.animationY;
        this.animationDuration = options.animationDuration || 1000;

        if (NotificationCenter.prototype._singletonInstance) {
            return NotificationCenter.prototype._singletonInstance;
        }

        NotificationCenter._singletonInstance = this;

        return this;
    }

    _createClass(NotificationCenter, [{
        key: 'notify',
        value: function notify(message, timeout) {
            if (!this.holder && !this.container) {
                var $notificationsContainer = $('<div class="notifications"></div>');
                $(document.body).append($notificationsContainer);
                this.holder = this.container = $notificationsContainer;
            }
            if (typeof this.holder.startTop === 'undefined') {
                this.holder.startTop = parseInt(this.holder.css('top'), 10);
            }

            if (!timeout) {
                timeout = this.timeout;
            }

            var notification = new Notification(message, this.container);

            this.messages.push(notification);
            notification.show(this.container);

            if (!this.isShowing) {
                this.holder.show();
                var newTop = this.holder.startTop + this.animationY;
                this.holder.stop(true).animate({ top: newTop }, this.animationDuration);
            }
            this.isShowing = true;

            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }

            this.hideTimeout = setTimeout(function () {
                this.holder.stop(true).animate({ top: this.holder.startTop }, this.animationDuration, function () {
                    this.isShowing = false;
                    this.holder.hide();
                    notification.hide();
                    notification.destroy();
                }.bind(this));
            }.bind(this), timeout);
        }
    }, {
        key: 'alert',
        value: function alert(message) {
            window.alert(message);
        }
    }]);

    return NotificationCenter;
}();