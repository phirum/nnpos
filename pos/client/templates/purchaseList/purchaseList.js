var posPurchaseUpdate = Template.pos_purchaseUpdate;


Template.pos_purchaseList.helpers({
    selector: function () {
        var selectorSession = Session.get('purchaseSelectorSession');
        if (selectorSession) {
            return selectorSession;
        } else {
            var selector = {branchId: Session.get('currentBranch')};
            var today = moment().format('YYYY-MM-DD');
            var fromDate = moment(today + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
            var toDate = moment(today + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
            selector.purchaseDate = {$gte: fromDate, $lte: toDate};
            return selector;
        }
    }
});
Template.pos_purchaseList.onRendered(function () {
    Session.set('purchaseSelectorSession', null);
    DateTimePicker.dateRange($('#purchase-date-filter'));
    createNewAlertify(['purchaseShow'], {size: 'lg'});
    createNewAlertify(['purchaseUpdate']);
});
Template.pos_purchaseList.events({
    'change #purchase-date-filter': function () {
        setPurchaseSelectorSession();
    },
    'change #purchase-status-filter': function () {
        setPurchaseSelectorSession();
    },
    'click .insert': function (e, t) {
        FlowRouter.go('pos.purchase');
    },
    'click .update': function (e, t) {
        var id = this._id;
        var branchId = Session.get('currentBranch');
        var total = this.total;
        if (this.status != "Unsaved") {
            //alertify.purchaseUpdate(fa('pencil', 'Update Existing Purchase'), renderTemplate(posPurchaseUpdate, purchase));
            Meteor.call('isEnoughStock', id, branchId, function (error, enough) {
                if (error) {
                    alertify.error(error.message);
                } else {
                    if (enough) {
                        alertify.confirm("Are you sure to update this purchase: [" + id + "]? It will recalculate inventory and remove all it's payment(if it has). ")
                            .set({
                                onok: function (closeEvent) {
                                    $.blockUI();
                                    Meteor.call('reduceFromInventory', id, branchId, function (err, result) {
                                        if (err) {
                                            alertify.error(err.message);
                                        } else {
                                            Meteor.call('updatePurchaseToUnsavedAndRemovePayment', id, total, function (er, re) {
                                                if (er) {
                                                    alertify.error(er.message);
                                                } else {
                                                    /* Meteor.setTimeout(function () {
                                                     $.unblockUI();
                                                     FlowRouter.go('pos.purchase', {purchaseId: id});
                                                     Meteor.call('reduceFromInventory', id, branchId);
                                                     },1000);*/

                                                        $.unblockUI();
                                                        FlowRouter.go('pos.purchase', {purchaseId: id});

                                                }
                                            })
                                        }
                                    });
                                },
                                title: '<i class="fa fa-remove"></i> Update Purchase'
                            });
                    } else {
                        alertify.warning("Don't have enough stock for update purchase. Products've been transferred or sold.");
                    }
                }

            });
        } else {
            FlowRouter.go('pos.purchase', {purchaseId: id});
        }
        /*
         Meteor.call('findOneRecord', 'Pos.Collection.Purchases', {_id: id}, {}, function (error, purchase) {
         if (error) {
         alertify.error(error.message);
         } else {

         }

         });*/
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var branchId = Session.get('currentBranch');
        if (this.status != "Unsaved") {
            var arr = [
                {collection: 'Pos.Collection.PurchasePayments', selector: {purchaseId: id}}
            ];
            Meteor.call('isRelationExist', arr, function (error, result) {
                if (error) {
                    alertify.error(error.message);
                } else {
                    if (result) {
                        alertify.warning("Data has been used. Can't remove.");
                    } else {
                        Meteor.call('isEnoughStock', id, branchId, function (err, enough) {
                            if (err) {
                                alertify.error(err.message);
                            } else {
                                if (enough) {
                                    alertify.confirm("Are you sure to remove this purchase: [" + id + "]? It will recalculate inventory and remove all it's payment(if it has). ")
                                        .set({
                                            onok: function (closeEvent) {
                                                $.blockUI();
                                                /*Meteor.call('reduceFromInventory', id, branchId, function (er, re) {
                                                 if (er) {
                                                 alertify.error(er.message);
                                                 }
                                                 if (re) {
                                                 Pos.Collection.Purchases.remove(id, function (le) {
                                                 if (le) {
                                                 alertify.error(le.message);
                                                 } else {
                                                 $.unblockUI();
                                                 alertify.success("Success");
                                                 }
                                                 });
                                                 }
                                                 });*/
                                                Pos.Collection.Purchases.remove(id, function (le) {
                                                    if (le) {
                                                        alertify.error(le.message);
                                                    } else {
                                                        $.unblockUI();
                                                        alertify.success("Success");
                                                    }
                                                });
                                            },
                                            title: '<i class="fa fa-remove"></i> Delete Purchase'
                                        });
                                } else {
                                    alertify.warning("Don't have enough stock for update purchase. Products've been transferred or sold.");
                                }
                            }

                        });

                    }
                }
            });
        }
        else {
            alertify.confirm("Are you sure to delete [" + id + "]?")
                .set({
                    onok: function (closeEvent) {
                        Pos.Collection.Purchases.remove(id, function (err) {
                            if (err) {
                                alertify.error(err.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    },
                    title: '<i class="fa fa-remove"></i> Delete Purchase'
                });
        }

    },
    'click .show': function (e, t) {
        Meteor.call('findOneRecord', 'Pos.Collection.Purchases', {_id: this._id}, function (error, purchase) {
            if (purchase) {
                purchase.pDate = moment(this.purchaseDate).format("YYYY-MM-DD HH:mm:ss");
                //this.saleDetails = Pos.Collection.PurchaseDetails.find({purchaseId: this._id});
                // purchase.retail = this.isRetail ? "Retail" : "Wholesale";
                Meteor.call('findRecords', 'Pos.Collection.PurchaseDetails', {purchaseId: purchase._id}, {},
                    function (error, purchaseDetails) {
                        if (purchaseDetails) {
                            purchase.purchaseDetails = purchaseDetails;
                            alertify.purchaseShow(fa('eye', 'Purchase Detail'),
                                renderTemplate(Template.pos_purchaseShow, purchase));
                        }
                    });
            } else {
                alertify.error(error.message);
            }
        });

    }
});
posPurchaseUpdate.onRendered(function () {
    Meteor.setTimeout(function () {
        $('select[name="supplierId"]').select2();
        /*  $('[name="saleDate"]').datetimepicker({
         format: "YYYY-MM-DD HH:mm:ss"
         });*/
        $('select[name="staffId"]').select2();
    }, 500);
});
posPurchaseUpdate.helpers({
    staffs: function () {
        var userStaff = Pos.Collection.UserStaffs.findOne({userId: Meteor.user()._id});
        if (userStaff != null) {
            var selector = {_id: {$in: userStaff.staffIds}, branchId: Session.get('currentBranch')};
            return ReactiveMethod.call('getList', 'Pos.Collection.Staffs', selector, {}, false);
        } else {
            return [];
        }
    },
    suppliers: function () {
        var selector = {branchId: Session.get('currentBranch')};
        return ReactiveMethod.call('getList', 'Pos.Collection.Suppliers', selector, {}, false);
    }
    ,
    transactionTypes: function () {
        return [
            {value: 'Purchase', label: 'Purchase'},
            {value: 'AdjustmentQtyUp', label: 'AdjustmentQtyUp'}
        ]
    }
});
AutoForm.hooks({
    pos_purchaseUpdate: {
        onSuccess: function (formType, result) {
            alertify.purchaseUpdate().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

function setPurchaseSelectorSession() {
    var selector = {branchId: Session.get('currentBranch')};
    var dateRange = $('#purchase-date-filter').val();
    var status = $('#purchase-status-filter').val();
    if (dateRange != "") {
        var date = dateRange.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
        var toDate = moment(date[1] + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
        selector.purchaseDate = {$gte: fromDate, $lte: toDate};
    } else {
        var today = moment().format('YYYY-MM-DD');
        var fromDate = moment(today + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
        var toDate = moment(today + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
        selector.purchaseDate = {$gte: fromDate, $lte: toDate};
    }
    if (status != "") {
        selector.status = status
    }
    Session.set('purchaseSelectorSession', selector);
}