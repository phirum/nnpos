var posSaleListTPL = Template.pos_saleList;
var posSaleShow = Template.pos_saleShow;


posSaleListTPL.onRendered(function () {
    createNewAlertify(['saleShow'], {size: 'lg'});
});

posSaleListTPL.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')}
    }
});

posSaleListTPL.events({
    'click .insert': function (e, t) {
        FlowRouter.go('pos.checkout');
    },
    'click .update': function (e, t) {
        FlowRouter.go('pos.checkout', {saleId: this._id});
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var arr = [
                        {collection: 'Pos.Collection.Payments', selector: {saleId: id}}
                    ];
                    Meteor.call('isRelationExist', arr, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            if (result) {
                                alertify.warning("Data has been used. Can't remove.");
                            } else {
                                Pos.Collection.Sales.remove(id, function (err) {
                                    if (err) {
                                        alertify.error(err.message);
                                    } else {
                                        alertify.success("Success");
                                    }
                                });
                            }
                        }
                    });
                },
                title: '<i class="fa fa-remove"></i> Delete Sale'
            });

    },
    'click .show': function (e, t) {
        //var sale=Pos.Collection.Sales.findOne(this._id);
        var self = this;
        self.sDate = moment(this.saleDate).format("YYYY-MM-DD HH:mm:ss");
        //self.saleDetails = Pos.Collection.SaleDetails.find({saleId: this._id});
        self.retail = this.isRetail ? "Retail" : "Wholesale";
        Meteor.call('findRecords', 'Pos.Collection.SaleDetails', {saleId: this._id}, {},
            function (error, saleDetails) {
                if (saleDetails) {
                    self.saleDetails = saleDetails;
                    alertify.saleShow(fa('eye', 'Sale Detail'), renderTemplate(posSaleShow, self));
                } else {
                    alertify.error(error.message);
                }
            });


    }
});
