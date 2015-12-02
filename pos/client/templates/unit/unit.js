var posUnitTPL=Template.pos_unit;
var posUnitInsertTPL=Template.pos_unitInsert;
var posUnitUpdateTPL=Template.pos_unitUpdate;
var posUnitShowTPL=Template.pos_unitShow;

posUnitTPL.onRendered(function(){
    createNewAlertify(['unit','unitShow']);
});
posUnitTPL.events({
    'click .insert': function (e, t) {
        alertify.unit(fa('plus','Add New Unit'),renderTemplate(posUnitInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.Units.findOne(this._id);
        alertify.unit(fa('pencil','Update Existing Unit'),renderTemplate(posUnitUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var canRemove =(this._productCount == null || this._productCount == 0);
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                   /* var relation = relationExist(
                        [
                            {collection: Pos.Collection.Products, selector: {unitId:id}}
                        ]
                    );*/
                    if(canRemove){
                        Pos.Collection.Units.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    }else {
                        alertify.warning("Data has been used. Can't remove.");
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete Unit'
            });
    },
    'click .show': function (e, t) {
        alertify.unitShow(fa('eye','Unit Detail'),renderTemplate(posUnitShowTPL, this))
    }
});
AutoForm.hooks({
    // Customer
    pos_unitInsert: {
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_unitUpdate: {
        onSuccess: function (formType, result) {
            alertify.unit().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

