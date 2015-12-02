var loadingWaiting = new ReactiveVar(false);

Template.cpanel_generatorModule.helpers({
    loadingWaiting: function () {
        return loadingWaiting.get();
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    // Customer
    cpanel_generatorModule: {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
            this.event.preventDefault();

            loadingWaiting.set(true);
            Meteor.call('cpanel_generatorModule', insertDoc.moduleName, function (error, result) {
                if (result == 'success') {
                    loadingWaiting.set(false);
                    alertify.success('Success');
                }
            });

            this.done();
        }
    }
});
