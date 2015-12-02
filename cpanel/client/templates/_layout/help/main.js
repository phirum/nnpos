var helpTpl = Template.helpLayout;

helpTpl.onRendered(function () {
    /* activate sidebar */
    $('#sidebar').affix({
        offset: {
            top: 235
        }
    });

    /* activate scrollspy menu */
    var $body = $(document.body);
    var navHeight = $('.navbar').outerHeight(true) + 10;

    $body.scrollspy({
        target: '#leftCol',
        offset: navHeight
    });
});

helpTpl.helpers({
    module: function () {
        var module = Session.get('currentModule');
        var branch = Session.get('currentBranch');
        if (Meteor.userId() && !_.isUndefined(module) && !_.isUndefined(branch)) {
            var moduleWord = s.words(module, ':');
            return Module[moduleWord[0]];
        }
        return {name: 'Rabbit Project', version: ''};
    }
});

helpTpl.events({
    /* smooth scrolling sections */
    'click a[href*=#]:not([href=#])': function (event, template) {
        event.preventDefault();

        // Store hash
        var href = $(event.currentTarget).attr('href');
        console.log('href: ' + href);

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        if (href && href != "#") {
            $('html, body').animate({
                scrollTop: $(href).offset().top - 70
            }, 100, function () {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = href;
            });
        }

    }
});
