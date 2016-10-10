/*jslint esversion: 6, -W097, browser: true */

'use strict';

require('core-js/es5');
var $ = require('jquery');

export class Notification {

    constructor(message, container) {
        this.message = message;
        this.container = container;
    }

    show() {
        $(this.container).find('.notification').remove();
        this.$element = $('<div class="notification" role="alert">' + this.message + '</div>');
        $(this.container).append(this.$element);
    }

    hide() {
        this.$element.hide();
    }

    destroy() {
        this.$element.remove();
    }
}


export class NotificationCenter {

    constructor(options) {
        options = options || {};
        this.holder = options.holder;
        this.container = options.container;
        this.messages = [];
        this.timeout = options.timeout || 4000;
        this.animationY = options.animationY === undefined ? 60 : options.animationY;
        this.animationDuration = options.animationDuration || 1000;

        if (NotificationCenter._singletonInstance) {
            return NotificationCenter._singletonInstance;
        }

        NotificationCenter._singletonInstance = this;

        return this;
    }

    notify(message, timeout) {
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
            this.holder.stop(true).animate({top: newTop}, this.animationDuration);
        }
        this.isShowing = true;

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.hideTimeout = setTimeout(function () {
            this.holder.stop(true).animate({top: this.holder.startTop}, this.animationDuration, function () {
                this.isShowing = false;
                this.holder.hide();
                notification.hide();
                notification.destroy();
            }.bind(this));
        }.bind(this), timeout);
    }

    alert(message) {
        window.alert(message);
    }
}
