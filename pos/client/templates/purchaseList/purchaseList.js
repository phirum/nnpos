Template.pos_purchaseList.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')}
    }
});
Template.pos_purchaseList.onRendered(function () {
    createNewAlertify(['purchaseShow']);
});
Template.pos_purchaseList.events({
    'click .insert': function (e, t) {
        FlowRouter.go('pos.purchase');
    },
    'click .update': function (e, t) {
        FlowRouter.go('pos.purchase', {purchaseId: this._id});
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var canRemove = (this._paymenyCount == null || this._paymenyCount == 0);
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    /* var relation = relationExist(
                     [
                     {collection: Pos.Collection.Payments, selector: {purchaseId: id}}
                     ]
                     );*/
                    if (canRemove) {
                        Pos.Collection.Purchases.remove(id, function (error) {
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
                title: '<i class="fa fa-remove"></i> Delete Purchase'
            });
    },
    'click .show': function (e, t) {
        //var purchase = Pos.Collection.Purchases.findOne(this._id);
        this.pDate = moment(this.purchaseDate).format("YYYY-MM-DD HH:mm:ss");
        this.saleDetails = Pos.Collection.PurchaseDetails.find({purchaseId: this._id});
        this.retail = this.isRetail ? "Retail" : "Wholesale";
        alertify.purchaseShow(fa('eye', 'Purchase Detail'),
            renderTemplate(Template.pos_purchaseShow, this));
    }
});
