Layout = {
    main: function (regions) {
        render('mainLayout', regions);
    },
    report: function (regions) {
        render('reportLayout', regions);
    },
    help: function (regions) {
        render('helpLayout', regions);
    },
    generator: function (regions) {
        render('generatorLayout', regions);
    },
    render: function (layout, regions) {
        render(layout, regions);
    }
};

var render = function (layout, regions) {
    if (typeof regions !== 'object') {
        regions = {content: regions};
    }
    //regions.materialInit = 'materialInit';

    BlazeLayout.render(layout, regions);
};