var posSaleListTPL = Template.pos_saleList;
var posSaleShow = Template.pos_saleShow;
var posSaleUpdate = Template.pos_saleUpdate;

posSaleUpdate.onRendered(function () {
    Meteor.setTimeout(function () {
        $('select[name="customerId"]').select2();
        /* $('[name="saleDate"]').datetimepicker({
         format: "YYYY-MM-DD HH:mm:ss"
         });*/
        $('select[name="staffId"]').select2();
    }, 500);
});

posSaleUpdate.helpers({
    staffs: function () {
        var userStaff = Pos.Collection.UserStaffs.findOne({userId: Meteor.user()._id});
        if (userStaff != null) {
            var selector = {_id: {$in: userStaff.staffIds}, branchId: Session.get('currentBranch')};
            return ReactiveMethod.call('getList', 'Pos.Collection.Staffs', selector, {}, false);
        } else {
            return [];
        }
    },
    customers: function () {
        var selector = {branchId: Session.get('currentBranch')};
        return ReactiveMethod.call('getList', 'Pos.Collection.Customers', selector, {}, false);
    }
    ,
    transactionTypes: function () {
        return [
            {value: 'Sale', label: 'Sale'},
            {value: 'AdjustmentQtyDown', label: 'AdjustmentQtyDown'}
        ]
    }
});

posSaleListTPL.onRendered(function () {
    createNewAlertify(['saleShow'], {size: 'lg'});
    createNewAlertify(['saleUpdate']);
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
        var id = this._id;
        Meteor.call('findOneRecord', 'Pos.Collection.Sales', {_id: id}, {}, function (error, sale) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (sale.status != "Unsaved") {
                    alertify.saleUpdate(fa('pencil', 'Update Existing Sale'), renderTemplate(posSaleUpdate, sale));
                } else {
                    FlowRouter.go('pos.checkout', {saleId: id});
                }
            }

        });

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


AutoForm.hooks({
    pos_saleUpdate: {
        onSuccess: function (formType, result) {
            alertify.saleUpdate().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

