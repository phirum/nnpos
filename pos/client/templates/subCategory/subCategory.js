/**
 * Create new custom  alertify
 */
Template.pos_subCategory.onRendered(function () {
    createNewAlertify(["category", "subCategory"]);
});

/**
 * Index
 */
Template.pos_subCategory.events({
    'click .insert': function (e, t) {

        alertify.subCategory(renderTemplate(Template.pos_subCategoryInsert))
            .set({
                title: "<i class='fa fa-plus'></i> Add New Sub Category"
            })
            .maximize();

    },
    'click .update': function (e, t) {

        var data = Pos.Collection.SubCategories.findOne(this._id);

        alertify.subCategory(renderTemplate(Template.pos_subCategoryUpdate, data))
            .set({
                title: '<i class="fa fa-pencil"></i> Update Existing Sub Category'
            })
            .maximize();

    },
    'click .remove': function (e, t) {

        var id = this._id;

        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var relation = relationExist(
                        [
                            {collection: Pos.Collection.Products, selector: {subCategoryId: id}}
                        ]
                    );
                    if (relation) {
                        alertify.alert("Data has been used. Can't remove.").set({title:"Data has been used."});
                    } else {
                        Pos.Collection.SubCategories.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete Sub Category'
            });

    },
    'click .show': function (e, t) {

        alertify.alert(renderTemplate(Template.pos_subCategoryShow, this))
            .set({
                title: '<i class="fa fa-eye"></i> Sub Category Detail'
            });

    }
});

/**
 * Insert
 */
Template.pos_subCategoryInsert.onRendered(function () {
    // datePicker();
});

Template.pos_subCategoryInsert.events({
    'click .categoryInsertAddon': function (e, t) {

        alertify.category(renderTemplate(Template.pos_categoryInsert))
            .set({
                title: "<i class='fa fa-plus'></i> Add New Category"
            });
        // .maximize();

    }
});

/**
 * Update
 */
//Template.pos_subCategoryUpdate.onRendered(function () {
//   // datePicker();
//});

Template.pos_subCategoryUpdate.events({
    'click .categoryInsertAddon': function (e, t) {

        alertify.category(renderTemplate(Template.pos_categoryInsert))
            .set({
                title: "<i class='fa fa-plus'></i> Category"
            });
        // .maximize();

    }
});

/**
 * Hook
 *
 */
AutoForm.hooks({
    // Customer
    pos_subCategoryInsert: {
        before: {
            insert: function (doc) {
                doc._id = idGenerator.gen(Pos.Collection.SubCategories, 4);
                return doc;
            }
        },
        after: {
            insert: function () {
                $('select[name="categoryId"]').select2('val','');
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_subCategoryUpdate: {
        onSuccess: function (formType, result) {
            alertify.subCategory().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        after: {
            update: function () {
                $('select[name="categoryId"]').select2('val','');
            }
        }
    }
});

/**
 * Config date picker
 */
var datePicker = function () {
    var dob = $('[name="dob"]');
    DateTimePicker.date(dob);
};
