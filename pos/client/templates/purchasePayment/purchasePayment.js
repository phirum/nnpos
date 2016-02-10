var posPurchasePaymentTPL = Template.pos_purchasePayment;
var posPurchasePaymentInsertTPL = Template.pos_purchasePaymentInsert;
var posPurchasePaymentUpdateTPL = Template.pos_purchasePaymentUpdate;
var posPurchasePaymentShowTPL = Template.pos_purchasePaymentShow;

posPurchasePaymentTPL.onRendered(function () {
    Session.set('purchasePaymentSelectorSession', null);
    DateTimePicker.dateRange($('#purchase-payment-date-filter'));
    createNewAlertify(['purchasePayment', 'purchasePaymentShow']);
});
posPurchasePaymentTPL.helpers({
    selector: function () {
        var selectorSession = Session.get('purchasePaymentSelectorSession');
        if (selectorSession) {
            return selectorSession;
        } else {
            var selector = {branchId: Session.get('currentBranch')};
            var today = moment().format('YYYY-MM-DD');
            var fromDate = moment(today + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
            var toDate = moment(today + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
            selector.paymentDate = {$gte: fromDate, $lte: toDate};
            return selector;
        }
    }
});
posPurchasePaymentTPL.events({
    'change #purchase-payment-date-filter': function () {
        setPurchasePaymentSelectorSession();
    },
    'change #purchase-payment-status-filter': function () {
        setPurchasePaymentSelectorSession();
    },
    'click .insert': function (e, t) {
        alertify.purchasePayment(fa('plus', 'Add New Payment'), renderTemplate(posPurchasePaymentInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        Meteor.call('findOneRecord', 'Pos.Collection.PurchasePayments', {_id: this._id}, {},
            function (error, payment) {
                if (payment) {
                    Session.set('purchasePaymentObj', payment);
                    Meteor.call('findOneRecord', 'Pos.Collection.PurchasePayments', {
                        purchaseId: payment.purchaseId,
                        branchId: Session.get('currentBranch')
                    }, {sort: {_id: -1, paymentDate: -1}}, function (error, lastPayment) {
                        if (lastPayment) {
                            if (payment._id == lastPayment._id) {
                                alertify.purchasePayment(fa('pencil', 'Update Existing Payment'), renderTemplate(posPurchasePaymentUpdateTPL, payment)).maximize();
                            } else {
                                alertify.warning("This payment not the last one");
                            }
                        } else {
                            alertify.error(error.message);
                        }
                    });
                } else {
                    alertify.error(error.message);
                }
            });
    },
    'click .remove': function (e, t) {
        var id = this._id;
        Meteor.call('findOneRecord', 'Pos.Collection.PurchasePayments', {_id: id}, {}, function (error, payment) {
            if (payment) {
                Meteor.call('findOneRecord', 'Pos.Collection.PurchasePayments', {
                    purchaseId: payment.purchaseId,
                    branchId: Session.get('currentBranch')
                }, {sort: {_id: -1, paymentDate: -1}}, function (err, lastPayment) {
                    if (lastPayment) {
                        if (payment._id == lastPayment._id) {
                            alertify.confirm("Are you sure to delete [" + id + "]?")
                                .set({
                                    onok: function (closeEvent) {
                                        Pos.Collection.PurchasePayments.remove(id, function (e) {
                                            if (e) {
                                                alertify.error(e.message);
                                            } else {
                                                alertify.success("Success");
                                            }
                                        });
                                    },
                                    title: '<i class="fa fa-remove"></i> Delete Payment'
                                });
                        } else {
                            alertify.warning("This payment not the last one");
                        }
                    } else {
                        alertify.error(err.message);
                    }
                });
            } else {
                alertify.error(error.message);
            }
        });
    },
    'click .show': function (e, t) {
        alertify.purchasePaymentShow(fa('eye', 'Payment Detail'), renderTemplate(posPurchasePaymentShowTPL, this));
    }
});
posPurchasePaymentInsertTPL.onRendered(function () {
    Session.set("posPurchasePaymentDate",null);
    datePicker();
});
posPurchasePaymentInsertTPL.helpers({
    paymentDate: function () {
        //var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        var paymentDateSession = Session.get('posPurchasePaymentDate');
        if (paymentDateSession) {
            return paymentDateSession;
            //return moment(paymentDateSession).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return moment(TimeSync.serverTime(null)).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    purchaseList: function () {
        var supplierSession = Session.get('supplierId');
        var branchIdSession = Session.get('currentBranch');
        var selector = {};
        selector.status = "Owed";
        selector.transactionType = "Purchase";
        if (branchIdSession != null) selector.branchId = branchIdSession;
        if (supplierSession != null) selector.supplierId = supplierSession;
        return ReactiveMethod.call('getPurchaseList',selector);
    },
    supplierList: function () {
        var branchIdSession = Session.get('currentBranch');
        var selector = {};
        if (branchIdSession != null) selector.branchId = branchIdSession;
        return ReactiveMethod.call('getSupplierList', selector);
    },
    dueAmount: function () {
        var dueAmount = Session.get('dueAmount');
        return dueAmount == null ? 0 : dueAmount;
    },
    getFileOfCurrency: function (id, field) {
        var currency = Cpanel.Collection.Currency.findOne(id);
        return currency[field];
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
    baseCurrency: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.findOne(id);
    },
    exchangeRates: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Pos.Collection.ExchangeRates.findOne({base: id, branchId: Session.get('currentBranch')}, {
            sort: {
                _id: -1,
                createdAt: -1
            }
        });
    }
});
posPurchasePaymentInsertTPL.events({
    'blur #paymentDate': function (e) {
        var paymentDate = $(e.currentTarget).val();
        Session.set("posPurchasePaymentDate",paymentDate);
    },
    'click #save-payment': function () {
        var purchaseId = $('select[name="purchaseId"]').val();
        var paymentDate = $('[name="paymentDate"]').val();
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var t = true;
        $('#purchase-payment-list tr').each(function () {
            t = $(this).find('.pay-amount').val() == "" ? true : false;
            if (t == false) {
                return false
            }
        });
        if (paymentDate == "" || purchaseId == "" || $('#' + baseCurrencyId).val() == "" || t) {
            alertify.error('Please input all requirement input.');
            return;
        }
        Meteor.call('findOneRecord', 'Pos.Collection.PurchasePayments',
            {
                purchaseId: purchaseId,
                branchId: Session.get('currentBranch')
            }, {sort: {_id: -1, paymentDate: -1}}, function (error, payment) {
                if (error) {
                    alertify.error(error.message);
                } else {
                    if (payment) {
                        paymentDate = moment(paymentDate).toDate();
                        if (paymentDate < payment.paymentDate) {
                            alertify.alert("Payment date can't less than the Last payment date.");
                        } else {
                            pay(purchaseId);
                        }
                    } else {
                        pay(purchaseId);
                    }
                }

            });

    },
    'mouseleave .pay-amount': function (e) {
        var value = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        if (!numericReg.test(value)) {
            $(e.currentTarget).val('');
        }
    },
    'change .pay-amount': function (e) {
        var value = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        if (!numericReg.test(value)) {
            $(e.currentTarget).val('');
        }
    },
    'keypress .pay-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'keyup .pay-amount': function () {
        calculatePurchasePayment();
    },
    'change select[name="supplierId"]': function (e) {
        var supplierId = $(e.currentTarget).val();
        supplierId == "" ? Session.set('supplierId', null) : Session.set('supplierId', supplierId);
    },
    'change select[name="purchaseId"]': function (e) {
        var purchaseId = $(e.currentTarget).val();
        clearFormData();
        if (purchaseId == "") {
            Session.set('dueAmount', 0);
            return;
        }
        Meteor.call('findOneRecord', 'Pos.Collection.PurchasePayments', {
                purchaseId: purchaseId,
                branchId: Session.get('currentBranch')
            }, {sort: {_id: -1, paymentDate: -1}},
            function (error, payment) {
                if (error) {
                    alertify.error(error.message);
                } else {
                    if (payment == null) {
                        Meteor.call('findOneRecord', 'Pos.Collection.Purchases', {_id: purchaseId}, {}, function (err, purchase) {
                            if (purchase) {
                                Session.set('dueAmount', purchase.total);
                            } else {
                                Session.set('dueAmount', null);
                            }
                        });
                    } else if (payment.balanceAmount <= 0) {
                        alertify.alert('Paid');
                        Session.set('dueAmount', null);
                    } else {
                        Session.set('dueAmount', payment.balanceAmount);
                    }
                }
            });

        /*var payment = Pos.Collection.Payments.findOne({
         purchaseId: purchaseId,
         branchId: Session.get('currentBranch')
         //balanceAmount: {$gt: 0}
         },
         {
         sort: {_id: -1, paymentDate: -1}
         }
         );
         if (payment == null) {
         var purchase = Pos.Collection.Purchases.findOne(purchaseId);
         Session.set('dueAmount', purchase.total);
         } else if (payment.balanceAmount <= 0) {
         alertify.alert('Paid');
         Session.set('dueAmount', null);
         } else {
         Session.set('dueAmount', payment.balanceAmount);
         }*/
    }
});
posPurchasePaymentUpdateTPL.helpers({
    compareTwoValue: function (val1, val2) {
        return val1 == val2;
    },
    baseCurrency: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.findOne(id);
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
    getFileOfCurrency: function (id, field) {
        var currency = Cpanel.Collection.Currency.findOne(id);
        return currency[field];
    },
    payment: function () {
        var payment = Session.get('purchasePaymentObj');
        payment.paymentDate = moment(payment.paymentDate).format('YYYY-MM-DD HH:mm:ss');
        return payment;
    }

    /*
     exchangeRates: function () {
     var id = Cpanel.Collection.Setting.findOne().baseCurrency;
     return Pos.Collection.ExchangeRates.findOne({base: id, branchId: Session.get('currentBranch')}, {
     sort: {
     _id: -1,
     createdAt: -1
     }
     });
     }*/
});
posPurchasePaymentUpdateTPL.onRendered(function () {
    datePicker();
});

posPurchasePaymentUpdateTPL.events({
    'click #update-payment': function () {
        // var purchaseId = $('select[name="purchaseId"]').val();
        // var paymentDate = $('[name="paymentDate"]').val();
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var empty = true;
        $('#purchase-payment-list-update tr').each(function () {
            empty = $(this).find('.pay-amount').val() == "";
            if (empty == false) {
                return false;
            }
        });
        if ($('#' + baseCurrencyId).val() == "" || empty) {
            alertify.error('Please input all requirement input.');
            return;
        }
        var payment = Session.get('purchasePaymentObj');
        var paymentId = payment._id;
        updatePayment(paymentId);
    },
    'mouseleave .pay-amount': function (e) {
        var value = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        if (!numericReg.test(value)) {
            $(e.currentTarget).val('');
        }
    },
    'change .pay-amount': function (e) {
        var value = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        if (!numericReg.test(value)) {
            $(e.currentTarget).val('');
        }
    },
    'keypress .pay-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'keyup .pay-amount': function () {
        calculateUpdatePayment();
    },
    'change select[name="supplierId"]': function (e) {
        var supplierId = $(e.currentTarget).val();
        supplierId == "" ? Session.set('supplierId', null) : Session.set('supplierId', supplierId);
    },
    'change select[name="purchaseId"]': function (e) {
        var purchaseId = $(e.currentTarget).val();
        clearFormData();
        Meteor.call('findOneRecord', 'Pos.Collection.Payments', {
            purchaseId: purchaseId,
            branchId: Session.get('currentBranch')
        }, {sort: {_id: -1, paymentDate: -1}}, function (error, payment) {
            if (payment) {
                if (payment.balanceAmount <= 0) {
                    alertify.alert('DueAmount <=0 : ' + payment.balanceAmount);
                    Session.set('updatedDueAmount', null);
                } else {
                    Session.set('updatedDueAmount', payment.balanceAmount);
                }
            } else {
                Session.set('updatedDueAmount', null);
                alertify.error(error.message);
            }
        });
        /* var payment = Pos.Collection.Payments.findOne({
         purchaseId: purchaseId,
         branchId: Session.get('currentBranch')
         //balanceAmount: {$gt: 0}
         },
         {
         sort: {_id: -1, paymentDate: -1}
         }
         );*/

    }
});

AutoForm.hooks({
    pos_purchasePaymentInsert: {
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_purchasePaymentUpdate: {
        onSuccess: function (formType, result) {
            alertify.purchasePayment().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

var datePicker = function () {
    var dob = $('[name="paymentDate"]');
    DateTimePicker.dateTime(dob);
    /*    $('[name="paymentDate"]').datetimepicker({
     format: "MM/DD/YYYY HH:mm:ss"
     }
     )*/
};
function clearFormData() {
    $('.pay-amount').val('');
    $('.return-amount').val('');
}

function calculatePurchasePayment() {
    var total = 0;
    var dueTotal = parseFloat($('#base-total').val().trim());
    $('#purchase-payment-list tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var pay = $(this).find('.pay-amount').val() == "" ? 0 : $(this).find('.pay-amount').val();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var payCheckCurrency = currencyId == "KHR" ? roundDownRielCurrency(parseFloat(pay)) : parseFloat(pay);
        total += payCheckCurrency / parseFloat(rate);
    });
    debugger;
    total = total - dueTotal;
    $('#purchase-payment-list tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var returnAmount = (total) * parseFloat(rate);
        if (currencyId == "KHR") {
            $(this).find('.return-amount').val(numeral(roundRielCurrency(returnAmount)).format('0,0.00'));
        } else {
            $(this).find('.return-amount').val(numeral(returnAmount).format('0,0.00'));
        }
    });
    var returnKHR = $('#KHR').val();
    if (returnKHR != null) {
        if (parseFloat(returnKHR) == 0) {
            $('.return-amount').val(numeral(0).format('0,0.00'));
        }
    }
}
function pay(purchaseId) {
    var branchId = Session.get('currentBranch');
    var obj = {};
    obj.payments = [];
    var totalPay = 0;
    $('#purchase-payment-list tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var pay = $(this).find('.pay-amount').val() == "" ? 0 : $(this).find('.pay-amount').val();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var returnAmount = $(this).find('.return-amount').val();
        returnAmount = numeral().unformat(returnAmount);
        pay = parseFloat(pay);
        rate = parseFloat(rate);
        totalPay += pay / rate;
        obj.payments.push(
            {
                currencyId: currencyId,
                payAmount: pay,
                rate: rate,
                return: returnAmount
            }
        );
    });
    var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
    obj.paymentDate = moment($('[name="paymentDate"]').val()).toDate();
    obj.purchaseId = purchaseId;
    //obj.status = "firstPay";
    obj.payAmount = numeral().unformat(numeral(totalPay).format('0,0.00'));
    obj.dueAmount = parseFloat($('#base-total').val().trim());
    obj.balanceAmount = numeral().unformat(numeral(obj.dueAmount - obj.payAmount).format('0,0.00'));
    obj.status = obj.balanceAmount > 0 ? "Owed" : "Paid";
    obj.branchId = branchId;
    debugger;

    Meteor.call('insertPurchasePayment', obj, function (err, result) {
        if (err) {
            alertify.error(err.message);
        } else {
            alertify.success("payment is successfully.");
            alertify.purchasePayment().close();
        }
    });

}

function updatePayment(paymentId) {
    var obj = {};
    obj.payments = [];
    var totalPay = 0;
    $('#purchase-payment-list-update tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var pay = $(this).find('.pay-amount').val() == "" ? 0 : $(this).find('.pay-amount').val();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var returnAmount = $(this).find('.return-amount').val();
        returnAmount = numeral().unformat(returnAmount);
        pay = parseFloat(pay);
        rate = parseFloat(rate);
        totalPay += pay / rate;
        obj.payments.push(
            {
                currencyId: currencyId,
                payAmount: pay,
                rate: rate,
                return: returnAmount
            }
        );
    });
    //var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
    //obj._id = idGenerator.genWithPrefix(Pos.Collection.Payments, purchaseId, 3);
    //obj.paymentDate = $('[name="paymentDate"]').val();
    //obj.purchaseId = purchaseId;
    //obj.status = "firstPay";
    obj.payAmount = numeral().unformat(numeral(totalPay).format('0,0.00'));
    obj.dueAmount = parseFloat($('#base-total').val().trim());
    obj.balanceAmount = numeral().unformat(numeral(obj.dueAmount - obj.payAmount).format('0,0.00'));
    obj.status = obj.balanceAmount > 0 ? "Owed" : "Paid";
    //obj.branchId = branchId;

    Meteor.call('updatePurchasePayment', paymentId, obj, function (error, result) {
        if (error != null) {
            alertify.error(error.message);
        } else {
            alertify.success("Update successfully.");
            alertify.purchasePayment().close();
        }
    });

}

function calculateUpdatePayment() {
    var total = 0;
    var dueTotal = parseFloat($('#base-total').val().trim());
    $('#purchase-payment-list-update tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var pay = $(this).find('.pay-amount').val() == "" ? 0 : $(this).find('.pay-amount').val();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var payCheckCurrency = currencyId == "KHR" ? roundDownRielCurrency(parseFloat(pay)) : parseFloat(pay);
        total += payCheckCurrency / parseFloat(rate);
    });
    total = total - dueTotal;
    $('#purchase-payment-list-update tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var returnAmount = (total) * parseFloat(rate);
        if (currencyId == "KHR") {
            $(this).find('.return-amount').val(numeral(roundRielCurrency(returnAmount)).format('0,0.00'));
        } else {
            $(this).find('.return-amount').val(numeral(returnAmount).format('0,0.00'));
        }
    });
    var returnKHR = $('#KHR').val();
    if (returnKHR != null) {
        if (parseFloat(returnKHR) == 0) {
            $('.return-amount').val(numeral(0).format('0,0.00'));
        }
    }
}

function setPurchasePaymentSelectorSession() {
    var selector = {branchId: Session.get('currentBranch')};
    var dateRange = $('#purchase-payment-date-filter').val();
    var status = $('#purchase-payment-status-filter').val();
    if (dateRange != "") {
        var date = dateRange.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
        var toDate = moment(date[1] + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
        selector.paymentDate = {$gte: fromDate, $lte: toDate};
    } else {
        var today = moment().format('YYYY-MM-DD');
        var fromDate = moment(today + " 00:00:00", "YYYY-MM-DD HH:mm:ss").toDate();
        var toDate = moment(today + " 23:59:59", "YYYY-MM-DD HH:mm:ss").toDate();
        selector.paymentDate = {$gte: fromDate, $lte: toDate};
    }
    if (status != "") {
        selector.status = status
    }
    Session.set('purchasePaymentSelectorSession', selector);
}