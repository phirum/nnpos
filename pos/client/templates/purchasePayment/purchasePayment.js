var posPurchasePaymentTPL = Template.pos_purchasePayment;
var posPurchasePaymentInsertTPL = Template.pos_purchasePaymentInsert;
var posPurchasePaymentUpdateTPL = Template.pos_purchasePaymentUpdate;
var posPurchasePaymentShowTPL = Template.pos_purchasePaymentShow;

posPurchasePaymentTPL.onRendered(function () {
    createNewAlertify(['purchasePayment', 'purchasePaymentShow']);
});
posPurchasePaymentTPL.helpers({
    selector: function () {
        var selector = {};
        selector.saleId = null;
        selector.branchId = Session.get('currentBranch');
        return selector;
    }
});
posPurchasePaymentTPL.events({
    'click .insert': function (e, t) {
        alertify.purchasePayment(fa('plus', 'Add New Payment'), renderTemplate(posPurchasePaymentInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.Payments.findOne(this._id);
        Session.set('paymentObj', data);
        var payment = Pos.Collection.Payments.findOne({
                purchaseId: data.purchaseId,
                branchId: Session.get('currentBranch')
            },
            {
                sort: {_id: -1, paymentDate: -1}

            });
        if (data._id == payment._id && data.status != "firstPay") {
            alertify.purchasePayment(fa('pencil', 'Update Existing Payment'), renderTemplate(posPurchasePaymentUpdateTPL, data)).maximize()
        } else {
            alertify.warning("This payment not the last one");
        }
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var data = Pos.Collection.Payments.findOne(id);
        var payment = Pos.Collection.Payments.findOne({
                purchaseId: data.purchaseId,
                branchId: Session.get('currentBranch')
            },
            {sort: {_id: -1, paymentDate: -1}}
        );
        if (data._id == payment._id && data.status != "firstPay") {
            alertify.confirm("Are you sure to delete [" + id + "]?")
                .set({
                    onok: function (closeEvent) {
                        Pos.Collection.Payments.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
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

    },
    'click .show': function (e, t) {
        alertify.purchasePaymentShow(fa('eye', 'Payment Detail'), renderTemplate(posPurchasePaymentShowTPL, this));
    }
});
posPurchasePaymentInsertTPL.onRendered(function () {
    datePicker();
});
posPurchasePaymentInsertTPL.helpers({
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
        var payment = Pos.Collection.Payments.findOne({
                purchaseId: purchaseId,
                branchId: Session.get('currentBranch')
                //balanceAmount: {$gt: 0}
            },
            {
                sort: {_id: -1, paymentDate: -1}
            }
        );
        if (payment != null) {
            paymentDate = moment(paymentDate).toDate();
            if (paymentDate < payment.paymentDate) {
                alertify.alert("Payment date can't less than the Last payment date.");
                return;
            }
        }
        pay(purchaseId);
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
        if(purchaseId==""){
            Session.set('dueAmount', 0);
            return;
        }

        var payment = Pos.Collection.Payments.findOne({
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
        }
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
        var payment = Session.get('paymentObj');
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
        var payment = Session.get('paymentObj');
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
        var payment = Pos.Collection.Payments.findOne({
                purchaseId: purchaseId,
                branchId: Session.get('currentBranch')
                //balanceAmount: {$gt: 0}
            },
            {
                sort: {_id: -1, paymentDate: -1}
            }
        );
        if (payment == null) {
            return false;
        }
        if (payment.balanceAmount <= 0) {
            alertify.alert('DueAmount <=0 : ' + payment.balanceAmount);
            Session.set('updatedDueAmount', null);
        } else {
            Session.set('updatedDueAmount', payment.balanceAmount);
        }
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
    obj._id = idGenerator.genWithPrefix(Pos.Collection.Payments, purchaseId, 3);
    obj.paymentDate = moment($('[name="paymentDate"]').val()).toDate();
    obj.purchaseId = purchaseId;
    //obj.status = "firstPay";
    obj.payAmount = numeral().unformat(numeral(totalPay).format('0,0.00'));
    obj.dueAmount = parseFloat($('#base-total').val().trim());
    obj.balanceAmount = numeral().unformat(numeral(obj.dueAmount - obj.payAmount).format('0,0.00'));
    obj.status = obj.balanceAmount > 0 ? "Owed" : "Paid";
    obj.branchId = branchId;

    Meteor.call('insertPayment', obj, function (error, result) {
        if (error != null) {
            alertify.error(error.message);
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


    Meteor.call('updatePayment', paymentId, obj, function (error, result) {
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
