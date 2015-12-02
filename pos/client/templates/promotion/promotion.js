/**
 * Create new custom  alertify
 */

Template.pos_promotion.onRendered(function () {
    createNewAlertify("promotion");
});
/**
 * Index
 */
Template.pos_promotion.events({
    'click .insert': function (e, t) {

        alertify.promotion(renderTemplate(Template.pos_promotionInsert))
            .set({
                title: "<i class='fa fa-plus'></i>Add New Promotion"
            })
            .maximize();

    },
    'click .update': function (e, t) {

        var data = Pos.Collection.Promotions.findOne(this._id);

        alertify.promotion(renderTemplate(Template.pos_promotionUpdate, data))
            .set({
                title: '<i class="fa fa-pencil"></i> Update Existing Promotion'
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
                            {collection: Pos.Collection.SubPromotions, selector: {promotionId: id}}
                        ]
                    );
                    if (relation) {
                        alertify.alert("Data has been used. Can't remove.").set({title: "Data has been used."});
                    } else {
                        Pos.Collection.Promotions.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete Promotion'
            });

    },
    'click .show': function (e, t) {

        alertify.alert(renderTemplate(Template.pos_promotionShow, this))
            .set({
                title: '<i class="fa fa-eye"></i> Promotion Detail'
            });

    }
});

/**
 * Insert
 */
Template.pos_promotionInsert.onRendered(function () {
    DateTimePicker.date($('[name="startDate"]'));
    DateTimePicker.date($('[name="endDate"]'));
    $('[name="startDate"]').on("dp.change", function (e) {
        $('[name="endDate"]').data("DateTimePicker").minDate(e.date);
    });
    $('[name="endDate"]').on("dp.change", function (e) {
        $('[name="startDate"]').data("DateTimePicker").maxDate(e.date);
    });
    // datePicker();
});

Template.pos_promotionInsert.events({});

/**
 * Update
 */
Template.pos_promotionUpdate.onRendered(function () {
    // datePicker();
});

Template.pos_promotionUpdate.events({});

/**
 * Hook
 */
AutoForm.hooks({
    // Customer
    pos_promotionInsert: {
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_promotionUpdate: {
        onSuccess: function (formType, result) {
            alertify.promotion().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
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
