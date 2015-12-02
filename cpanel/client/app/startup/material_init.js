/*
//FlowRouter.wait();
Meteor.startup(function () {
    /!*** Material Init For All Template ***!/
    for (var property in Template) {
        // check if the property is actually a blaze template
        if (Blaze.isTemplate(Template[property])) {
            var template = Template[property];
            // assign the template an onRendered callback who simply prints the view name
            template.onRendered(function () {
                $.material.init();
                //console.log('$.material.init() for ' + this.view.name);
            });
        }
    }

    //FlowRouter.initialize();
});
*/
