var posSupplierTPL = Template.pos_supplier;
var posSupplierInsertTPL = Template.pos_supplierInsert;
var posSupplierUpdateTPL = Template.pos_supplierUpdate;
var posSupplierShowTPL = Template.pos_supplierShow;

posSupplierTPL.onRendered(function () {
    createNewAlertify(['supplier', 'supplierShow']);
});
posSupplierTPL.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')};
    }
});
posSupplierTPL.events({
    'click .insert': function (e, t) {
        alertify.supplier(fa('plus', 'Add New Supplier'), renderTemplate(posSupplierInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.Suppliers.findOne(this._id);
        alertify.supplier(fa('pencil', 'Update Existing Supplier'), renderTemplate(posSupplierUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var canRemove = (this._purchaseCount == null || this._purchaseCount == 0);
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    /*  var relation = relationExist(
                     [
                     {collection: Pos.Collection.Purchases, selector: {supplierId:id}}
                     ]
                     );*/
                    if (canRemove) {
                        Pos.Collection.Suppliers.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    } else {
                        alertify.warning("Data has been used. Can't remove.");
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete Supplier'
            });

    },
    'click .show': function (e, t) {
        alertify.supplierShow(fa('eye', 'Supplier Detail'), renderTemplate(posSupplierShowTPL, this));
    }
});
AutoForm.hooks({
    pos_supplierInsert: {
        before: {
            insert: function (doc) {
                var branchId = Session.get('currentBranch');
                doc.branchId = branchId;
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
    pos_supplierUpdate: {
        onSuccess: function (formType, result) {
            alertify.supplier().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
