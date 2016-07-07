(function() {

    var App = {};

    App.init = function() {
        this._bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        };

        this.addListeners();
    };

    App.addListeners = function() {
        var self = this;
        var bodyContainer = $('#main .box-body');
        var navItem = $('.navbar-nav>li');
        var topButton = $('#back-to-top');

        $(window).on('load', function() {
            /* Activate Fastclick */
            FastClick.attach(document.body);

            /* Add active class when profile page is selected */
            var currentUrl = location.pathname.split('/')[1];
            var activeItem = navItem.find('active');

            switch (currentUrl) {
                case 'categories':
                    navItem.eq(0).addClass('active');
                    break;
                case 'tags':
                    navItem.eq(1).addClass('active');
                    break;
            }

            activeItem.removeClass('active');

            /* Wrap table element to be responsive */
            bodyContainer.find('table')
                .addClass('table')
                .wrap('<div class="table-responsive"></div>');

            /* Activate back-to-top button */
            topButton.on('click', function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 500);

                return false;
            });

            /* Activate Lightbox */
            if ($('img').length) {
                $('img').each(function() {
                    var that = $(this);
                    that.closest('a').attr('data-toggle', 'lightbox').attr('data-title', that.attr('alt'));
                });

                $(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
                    e.preventDefault();
                    $(this).ekkoLightbox();
                });
                
                // While we are dealing with image objects
                // Let's update SEO meta fields
                var firstImageUrl = $('img').first().attr('src');

                firstImageUrl = (firstImageUrl.indexOf('//') !== -1)
                    ? firstImageUrl
                    : 'http://' + window.location.host + ((firstImageUrl.startsWith('/')) ? '' : '/') +firstImageUrl;

                $('meta[property="og:image"]').attr('content', firstImageUrl);
                $('meta[itemprop="image"]').attr('content', firstImageUrl);
                $('meta[name="twitter:image"]').attr('content', firstImageUrl);
            }
        });

        /* 'Back to top' button */
        $(window).on('scroll', function () {
            var scrollPos = $(window).scrollTop();

            if (scrollPos > 50) {
                topButton.fadeIn();
            } else {
                topButton.fadeOut();
            }
        });
    };

    $(function() {
        return App.init();
    });
}).apply(this);

/* Reload page */
var reload = function (interval) {
  setTimeout(function () {
    window.location.reload(true);
  }, interval || 5000);
};

/* Truncate the given string */
var truncate = function(str, len) {
  var len = len || 100;

  if (str.length > len) {
    return str.substring(0, len - 1) + '...';
  }

  return str;
};

/* Compile template out of the given data */
var compile = function(layoutTemplate, facebookUserFeedCollection) {
  var markup = '';

  $.each(facebookUserFeedCollection, function(index, item) {
    markup += layoutTemplate
      .replace(/{\s?id\s?}/ig, item.id.split('_')[1])
      .replace(/{\s?message\s?}/ig, truncate(item.message || item.story))
      .replace(/{\s?created_time\s?}/ig, moment(item.created_time, moment.ISO_8601).fromNow());
  });

  return markup;
};

/* Redirect to https */
if (!(window.location.host.startsWith('127.0.0.1') || window.location.host.startsWith('localhost')) && (window.location.protocol != 'https:')) {
    window.location.protocol = 'https';
}
