var NotificationCenter = require('../lib/notification-center').NotificationCenter;
var assert = require('chai').assert;
var $ = require('jquery');

// Test are not isolated! how do people use tests without this basic thing???
// May be, use a different runner
//describe('Tests', function() {
//    it('should run independently', function() {
//      assert.equal(document.body.getAttribute('data-x'), null);
//      document.body.setAttribute('data-x', '1');
//    });
//    it('should run independently', function() {
//      assert.equal(document.body.getAttribute('data-x'), null);
//      document.body.setAttribute('data-x', '1')
//    });
//});

describe('NotificationCenter', function() {
    it('should show and hide a notification', function(done) {
      var $holder = $('<div>').css({position: 'absolute'});
      $(document.body).append($holder);
      var nc = new NotificationCenter({
        holder: $holder,
        container: $holder,
        timeout: 1000,
        animationY: 100,
        animationDuration: 100
      });

      assert.equal($holder.html(), '');
      assert.equal(nc.messages.length, 0);

      nc.notify('xxx')
      assert.equal(nc.messages.length, 1);
      assert.equal($holder.html(), '<div class="notification" role="alert">xxx</div>');
      window.setTimeout(function() {
        assert.equal($holder.css('display'), 'block');
        //assert.equal($holder.css('top'), '100px'); fails for some reason
        //assert.equal($holder.offset().top, 100);
      }, 500)

      window.setTimeout(function() {
        assert.equal($holder.html(), '');
        assert.equal($holder.css('display'), 'none');
        assert.equal($holder.offset().top, 0);
        done();
        $holder.remove()
        NotificationCenter._singletonInstance = null;
      }, 1500)
    });

    it('should show and hide a couple of notification', function(done) {
      var $holder = $('<div>').css({position: 'absolute'});
      $(document.body).append($holder);
      var nc = new NotificationCenter({
        holder: $holder,
        container: $holder,
        timeout: 1000,
        animationY: 100,
        animationDuration: 100
      });

      nc.notify('xxx')

      window.setTimeout(function() {
        nc.notify('yyy');
        // notification overrides the previous
        assert.equal($holder.html(), '<div class="notification" role="alert">yyy</div>');
      }, 300)

      window.setTimeout(function() {
        assert.equal($holder.html(), '<div class="notification" role="alert">yyy</div>');
        assert.equal($holder.css('display'), 'block');
      }, 1200)

      window.setTimeout(function() {
        assert.equal($holder.html(), '');
        assert.equal($holder.css('display'), 'none');
        assert.equal($holder.offset().top, 0);
        done();
        $holder.remove()
        NotificationCenter._singletonInstance = null;
      }, 1500)
    });
});
