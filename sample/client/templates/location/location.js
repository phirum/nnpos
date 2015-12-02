/**
 * Declare template
 */
var indexTpl = Template.sample_location,
    insertTpl = Template.sample_locationInsert,
    updateTpl = Template.sample_locationUpdate,
    showTpl = Template.sample_locationShow;

/**
 * Index
 */
indexTpl.onCreated(function () {
    // SEO
    SEO.set({
        title: 'Location',
        description: 'Description for this page'
    });

    // Create new  alertify
    createNewAlertify("location", {transition: 'zoom'});
});

indexTpl.helpers({
    selector: function () {
        return {};
    },
    tabularClass: function () {
        var self = this;
        var cssClass = 'table table-striped table-bordered table-condensed table-hover';
        if (self.cssClass) {
            cssClass += '-' + this.cssClass;
        }

        return cssClass;
    }
});

indexTpl.events({
    'click .js-insert': function (e, t) {
        alertify.location(fa("plus", "Location"), renderTemplate(insertTpl));
    },
    'click .js-update': function (e, t) {
        alertify.location(fa("pencil", "Location"), renderTemplate(updateTpl, this));
    },
    'click .js-remove': function (e, t) {
        var self = this;

        alertify.confirm(
            fa("remove", "Location"),
            "Are you sure to delete [" + self._id + "]?",
            function () {
                Sample.Collection.Location.remove(self._id, function (error) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        alertify.success("Success");
                    }
                });
            },
            null
        );

    },
    'click .js-show': function (e, t) {
        alertify.location(fa("eye", "Location"), renderTemplate(showTpl, this));
    }
});

/**
 * Insert
 */

/**
 * Update
 */
updateTpl.onCreated(function () {
    this.subLocation = this.subscribe('sample_locationById', this.data._id);
});

updateTpl.helpers({
    data: function () {
        var data = Sample.Collection.Location.findOne(this._id);
        return data;
    }
});

/**
 * Show
 */
showTpl.onCreated(function () {
    this.subLocation = this.subscribe('sample_locationById', this.data._id);
});

showTpl.helpers({
    data: function () {
        var data = Sample.Collection.Location.findOne(this._id);
        return data;
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    sample_locationInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(Sample.Collection.Location, 4);
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    sample_locationUpdate: {
        onSuccess: function (formType, result) {
            alertify.location().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
