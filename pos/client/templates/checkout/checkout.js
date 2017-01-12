Session.setDefault('isRetail', true);
Session.setDefault('hasUpdate', false);
Template.pos_checkout.onRendered(function () {
    Meteor.typeahead.inject();
    createNewAlertify(["customer", "userStaff", 'customerLocation']);
    if (Session.get('isRetail') == null) {
        Session.set('isRetail', true);
    }
    $('#sale-date').datetimepicker({
        format: "MM/DD/YYYY hh:mm:ss A"
    });
    //$('#product-id').select2();
    $('#product-barcode').focus();
    Meteor.setTimeout(function () {
        $('.select-two').select2();
        var s = Pos.Collection.Sales.findOne({
            _id: FlowRouter.getParam('saleId'),
            status: "Unsaved",
            branchId: Session.get('currentBranch')
        });
        if (s == null) {
            FlowRouter.go('pos.checkout');
            $('#product-barcode').focus();
        }
    }, 500);
});
Template.pos_checkout.helpers({
    searchProductPromotion: function (query, sync, callback) {
        Meteor.call('searchProduct', query, {}, function (err, res) {
            if (err) {
                console.log(err);
                return;
            } else {
                callback(res);
            }

        })
    },
    selectedPromotion: function (event, suggestion, dataSetName) {
        var id = suggestion._id;
        var saleId = $('#sale-id').val();
        if (saleId == '') {
            return;
        }
        var selector = {_id: id};
        checkBeforeAddOrUpdatePromotion(selector);
        $('#product-barcode-promotion').focus();
    },
    search: function (query, sync, callback) {
        Meteor.call('searchProduct', query, {}, function (err, res) {
            if (err) {
                console.log(err);
                return;
            }
            callback(res);
        });
    },
    selected: function (event, suggestion, dataSetName) {
        // event - the jQuery event object
        // suggestion - the suggestion object
        // datasetName - the name of the dataset the suggestion belongs to
        // TODO your event handler here
        var id = suggestion._id;
        var selector = {_id: id};
        var data = getValidatedValues();
        if (data.valid) {
            checkBeforeAddOrUpdate(selector, data);
        } else {
            alertify.warning(data.message);
        }
        $('#product-barcode').focus();
    },
    location: function () {
        var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        if (sale != null) {
            return Pos.Collection.Locations.findOne(sale.locationId);
        } else {
            var locationSetting = Pos.Collection.LocationSettings.findOne();
            if (locationSetting != null) {
                return {_id: locationSetting.saleLocationId, name: locationSetting._location.name}
            } else {
                return {_id: '', name: 'N/A'}
            }
        }
    },
    /*locations: function () {
     return Pos.Collection.Locations.find({branchId: Session.get('currentBranch')});
     },*/
    transactionType: function () {
        return [
            {value: 'Sale', name: 'Sale'},
            {value: 'AdjustmentQtyDown', name: 'AdjustmentQtyDown'}
        ]
    },
    imeis: function () {
        var saleDetailId = Session.get('saleDetailId');
        if (saleDetailId != null) {
            var sd = Pos.Collection.SaleDetails.findOne(saleDetailId);
            var imeis = [];
            if (sd.imei) {
                for (var i = 0; i < sd.imei.length; i++) {
                    imeis.push({order: i + 1, code: sd.imei[i]});
                }
            }
            return imeis;
        } else {
            return [];
        }
    },
    hasUpdate: function () {
        var hasUpdate = Session.get('hasUpdate');
        if (hasUpdate != null && hasUpdate != "null") {
            return hasUpdate;
        }
        return false;
    },
    saleDate: function () {
        var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        if (sale == null) {
            //return "";
            return moment(TimeSync.serverTime(null)).format('MM/DD/YYYY hh:mm:ss A');
        } else {
            return moment(sale.saleDate).format('MM/DD/YYYY hh:mm:ss A');
        }
    },
    isRetailHelper: function () {
        var isRetail = true;
        var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        if (sale != null) {
            isRetail = sale.isRetail;
        }
        return isRetail == true;
    },
    getFileOfCurrency: function (id, field) {
        var currency = Cpanel.Collection.Currency.findOne(id);
        return currency[field];
    },
    hasTotal: function (total) {
        return total != null;
    },
    multiply: function (val1, val2, id) {
        if (val1 != null && val2 != null) {
            var value = (val1 * val2);
            if (id != null && id == "KHR") {
                value = roundRielCurrency(value);
                return numeral(value).format('0,0');
            }
            return numeral(value).format('0,0.00');
        }
    },
    currencies: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.find({_id: {$ne: id}});
    },
    baseCurrency: function () {
        var setting = Cpanel.Collection.Setting.findOne();
        if (setting != null) {
            return Cpanel.Collection.Currency.findOne(setting.baseCurrency);
        } else {
            return {};
        }

    },
    exchangeRate: function () {
        var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        if (sale != null) {
            return Pos.Collection.ExchangeRates.findOne(sale.exchangeRateId);
        } else {
            return false;
            /* var id = "";
             var setting = Cpanel.Collection.Setting.findOne();
             if (setting != null) {
             id = setting.baseCurrency;
             }
             return Pos.Collection.ExchangeRates.findOne({
             base: id,
             branchId: Session.get('currentBranch')
             }, {sort: {_id: -1, createdAt: -1}});*/

        }

    },
    compareTwoValue: function (val1, val2) {
        return val1 == val2;
    },
    sale: function () {
        var s = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        if (s != null) {
            s.saleDate = moment(s.saleDate).format("DD-MM-YY, hh:mm:ss a");
            s.subTotalFormatted = numeral(s.subTotal).format('0,0.00');
            s.totalFormatted = numeral(s.total).format('0,0.00');
            //s.discountFormatted = numeral(s.discount).format('0.00');
            //s.discountAmountFormatted = numeral(s.discountAmount).format('0.00');
            s.discount = numeral(s.discount).format('0.00');
            s.discountAmount = numeral(s.discountAmount).format('0.00');
            return s;
        } else {
            return {};
        }
    },
    saleDetails: function () {
        var saleDetailItems = [];
        var sD = Pos.Collection.SaleDetails.find({
            saleId: FlowRouter.getParam('saleId'),
            isPromotion: {$ne: true}
        });
        if (sD.count() > 0) {
            var i = 1;
            sD.forEach(function (sd) {
                // var item = _.extend(sd,{});
                /*var product = Pos.Collection.Products.findOne(sd.productId);
                 var unit = Pos.Collection.Units.findOne(product.unitId).name;
                 sd.productName = product.name + "(" + unit + ")";*/
                sd.amountFormatted = numeral(sd.amount).format('0,0.00');
                //sd.order = pad(i, 2);
                sd.order = i;
                i++;
                saleDetailItems.push(sd);
            });
            return saleDetailItems;
        } else {
            return [];
        }
    },
    numberOfPromotionItems: function () {
        var saleId = FlowRouter.getParam('saleId');
        var sD = Pos.Collection.SaleDetails.find({saleId: saleId, isPromotion: true});
        return sD.count();
    },
    promotionSaleDetails: function () {
        var saleDetailItems = [];
        var saleId = FlowRouter.getParam('saleId');
        var sD = Pos.Collection.SaleDetails.find({saleId: saleId, isPromotion: true});
        if (sD.count() > 0) {
            var i = 1;
            sD.forEach(function (sd) {
                sd.amountFormatted = numeral(sd.amount).format('0,0.00');
                sd.order = i;
                i++;
                saleDetailItems.push(sd);
            });
            return saleDetailItems;
        } else {
            return [];
        }
    },
    staffs: function () {
        var userStaff = Pos.Collection.UserStaffs.findOne({userId: Meteor.user()._id});
        if (userStaff != null) {
            return Pos.Collection.Staffs.find({
                _id: {$in: userStaff.staffIds},
                branchId: Session.get('currentBranch')
            }, {fields: {_id: 1, name: 1}});
        } else {
            return [];
        }
    },
    customerLocations: function () {
        return Pos.Collection.CustomerLocations.find({
            branchId: Session.get('currentBranch')
        }, {fields: {_id: 1, name: 1}});
    },
    customers: function () {
        var selector = {branchId: Session.get('currentBranch')};
        var customerLocationId = Session.get('customerLocationId');
        if (customerLocationId) {
            selector.customerLocationId = customerLocationId;
        }
        debugger;
        return Pos.Collection.Customers.find(selector, {fields: {_id: 1, name: 1}});
    },
    // products: function () {
    // return Pos.Collection.Products.find({status: "enable"}, {fields: {_id: 1, name: 1, _unit: 1}, limit: 10});
    /*.map(function (p) {
     var unit = Pos.Collection.Units.findOne(p.unitId).name;
     p.name = p.name + "(" + unit + ")";
     return p;
     });*/
    //},
    sales: function () {
        var id = FlowRouter.getParam('saleId');
        if (id != null || id != "") {
            var sales = Pos.Collection.Sales.find({
                _id: {$ne: id},
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });
            if (sales.count() > 0) {
                return sales;
            } else {
                return false;
            }
        } else {
            var sales = Pos.Collection.Sales.find({branchId: Session.get('currentBranch'), status: "Unsaved"})
            if (sales.count() > 0) {
                return sales;
            } else {
                return false;
            }
        }
    }
});
function checkBeforeAddOrUpdate(selector, data) {
    var locationId = $('#location-id').val();
    var isRetail = Session.get('isRetail');
    var saleId = $('#sale-id').val();
    var branchId = Session.get('currentBranch');
    Meteor.call('findOneRecord', 'Pos.Collection.Products', selector, {}, function (error, product) {
        var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
        if (product) {
            if (product.productType == "Stock") {
                var saleDetails = Pos.Collection.SaleDetails.find({
                    productId: product._id,
                    saleId: saleId,
                    locationId: locationId
                });
                if (saleDetails.count() > 0) {
                    var saleDetailQty = 0;
                    saleDetails.forEach(function (saleDetail) {
                        saleDetailQty += saleDetail.quantity;
                    });
                    defaultQuantity = defaultQuantity + saleDetailQty;
                }
                debugger;
                //---Open Inventory type block "FIFO Inventory"---
                Meteor.call('findOneRecord', 'Pos.Collection.FIFOInventory', {
                    branchId: branchId,
                    productId: product._id,
                    locationId: locationId
                }, {sort: {createdAt: -1}}, function (error, inventory) {
                    if (inventory) {
                        var remainQuantity = inventory.remainQty - defaultQuantity;
                        if (remainQuantity < 0) {
                            alertify.warning('Product is out of stock. Quantity in stock is "' + inventory.remainQty + '".');
                        } else {
                            var unSavedSaleId = Pos.Collection.Sales.find({
                                status: "Unsaved",
                                branchId: Session.get('currentBranch'),
                                locationId: locationId,
                                _id: {$ne: saleId}
                            }, {fields: {_id: 1}}).map(function (s) {
                                return s._id;
                            });
                            var otherSaleDetails = Pos.Collection.SaleDetails.find({
                                saleId: {$in: unSavedSaleId},
                                productId: product._id,
                                locationId: locationId
                            }, {fields: {quantity: 1}});
                            var otherQuantity = 0;
                            if (otherSaleDetails.count() > 0) {
                                otherSaleDetails.forEach(function (sd) {
                                    otherQuantity += sd.quantity;
                                });
                            }

                            remainQuantity = remainQuantity - otherQuantity;
                            if (remainQuantity < 0) {
                                alertify.warning('Product is out of stock. Quantity in stock is "' +
                                    inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity + '".');
                            }
                            else {
                                var unSavedLocationTransferId = Pos.Collection.LocationTransfers.find({
                                    status: "Unsaved",
                                    branchId: Session.get('currentBranch'),
                                    fromLocationId: locationId,
                                }, {fields: {_id: 1}}).map(function (lt) {
                                    return lt._id;
                                });
                                var otherLocationTransferDetails = Pos.Collection.LocationTransferDetails.find({
                                    locationTransferId: {$in: unSavedLocationTransferId},
                                    fromLocationId: locationId,
                                    productId: product._id
                                }, {fields: {quantity: 1}});
                                var locationTransferQuantity = 0;
                                if (otherLocationTransferDetails.count() > 0) {
                                    otherLocationTransferDetails.forEach(function (ltd) {
                                        locationTransferQuantity += ltd.quantity;
                                    });
                                }
                                remainQuantity = remainQuantity - locationTransferQuantity;
                                if (remainQuantity < 0) {
                                    alertify.warning('Product is out of stock. Quantity in stock is "' +
                                        inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity +
                                        '". And quantity of location transfer is "' + locationTransferQuantity + '".');
                                } else {
                                    addOrUpdateProducts(branchId, saleId, isRetail, product, data.saleObj);
                                }
                            }
                        }
                    }
                    else {
                        alertify.warning("Don't have product in stock.");
                    }
                });
                //---End Inventory type block "FIFO Inventory"---
            }
            else {
                addOrUpdateProducts(branchId, saleId, isRetail, product, data.saleObj);
            }
        }
        else {
            alertify.warning("Can't find this Product");
        }
    });
}
Template.pos_checkout.events({
    'change #customer-location-id': function (e) {
        Session.set('customerLocationId', $(e.currentTarget).val());
        checkIsUpdate();
    },
    'click #promotion-toggle': function () {
        $('#promotion-div').toggle();
    },
    'keyup #voucher': function () {
        checkIsUpdate();
    },
    'keyup #description': function () {
        checkIsUpdate();
    },
    'change #transaction-type': function () {
        checkIsUpdate();
    },
    'click .btn-remove-imei': function (e) {
        var saleDetailId = Session.get('saleDetailId');
        var thisBtn = $(e.currentTarget);
        // var imei = thisBtn.parents('tr').find('.td-imei').text().trim();
        var imei = this.code;
        var saleDetail = Pos.Collection.SaleDetails.findOne(saleDetailId);
        var obj = {};
        obj.imei = subtractArray(saleDetail.imei, [imei]);
        Meteor.call('updateSaleDetails', saleDetailId, obj);

    },
    //update more here
    'keyup #input-imei': function (e) {
        if (e.which == 13) {
            var branchId = Session.get('currentBranch');
            var imei = $(e.currentTarget).val().trim();
            if (imei == "") {
                return;
            }
            var saleDetailId = Session.get('saleDetailId');
            var saleDetail = Pos.Collection.SaleDetails.findOne(saleDetailId);
            //---Open Inventory type block "FIFO Inventory"---
            Meteor.call('findOneRecord', 'Pos.Collection.FIFOInventory', {
                branchId: branchId,
                productId: saleDetail.productId,
                locationId: saleDetail.locationId
            }, {sort: {createdAt: -1}}, function (error, inventory) {
                if (inventory) {
                    if (inventory.imei == null || inventory.imei.indexOf(imei) == -1) {
                        alertify.warning("Can't find this IMEI.");
                    } else {
                        var obj = {};
                        var imeis = saleDetail.imei == null ? [] : saleDetail.imei;
                        if (imeis.indexOf(imei) != -1) {
                            alertify.warning('IMEI is already exist.');
                            return;
                        } else if (saleDetail.imei.count() == saleDetail.quantity) {
                            alertify.warning("Number of IMEI can't greater than Quantity.");
                            return;
                        } else {
                            imeis.push(imei);
                        }
                        obj.imei = imeis;
                        Meteor.call('updateSaleDetails', saleDetailId, obj, function (er, re) {
                            if (er) {
                                alertify.error(er.message);
                            } else {
                                $(e.currentTarget).val('');
                                $(e.currentTarget).focus();
                            }
                        });
                    }

                } else {
                    alertify.error("Product is out of stock.");
                }
            });
            //---End Inventory type block "FIFO Inventory"---
        }
    },
    'click .btn-imei': function () {
        Session.set('saleDetailId', this._id);
        $('#input-imei').val('');
        $('#imei').modal('show');
    },
    'click .resume': function (e) {
        var saleId = $(e.currentTarget).attr('data-id');
        var sale = Pos.Collection.Sales.findOne(saleId);
        Session.set('hasUpdate', false);
        Session.set('isRetail', sale.isRetail);
        $('#customer-id').select2('val', sale.customerId);
        $('#staff-id').select2('val', sale.staffId);
        $('#input-sale-date').val(moment(sale.saleDate).format('MM/DD/YYYY hh:mm:ss A'));
    },
    'click #btn-update-sale-data': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var branchId = Session.get('currentBranch');
        var customerLocationId = $('#customer-location-id').val();
        var customerId = $('#customer-id').val();
        var staffId = $('#staff-id').val();
        var date = $('#input-sale-date').val();
        var transactionType = $('#transaction-type').val();
        var description = $('#description').val();
        var voucher = $('#voucher').val();
        var sale = Pos.Collection.Sales.findOne();
        Meteor.call('findOneRecord', 'Pos.Collection.Sales',
            {branchId: branchId, voucher: voucher, _id: {$ne: saleId}}, {},
            function (error, sale) {
                if (sale) {
                    alertify.warning('Voucher already exists. Please input other one.');
                } else {
                    var set = {};
                    set.customerId = customerId;
                    set.staffId = staffId;
                    set.saleDate = moment(date).toDate();
                    set.transactionType = transactionType;
                    set.description = description;
                    set.voucher = voucher;
                    set.customerLocationId = customerLocationId;
                    Meteor.call('updateSale', saleId, set, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        }
                        else {
                            Session.set('hasUpdate', false);
                            $('#product-barcode').focus();
                        }
                    });

                }
            });
    },
    'blur #input-sale-date': function () {
        checkIsUpdate();
    },
    'change #customer-id': function () {
        checkIsUpdate();
    },
    'change #staff-id': function () {
        checkIsUpdate();
    },
    'click #retail': function (e) {
        var saleId = $('#sale-id').val();
        $('#wholesale').removeClass('btn-primary');
        $('#wholesale').addClass('btn-default');
        $('#wholesale').attr('disabled', false);
        $(e.currentTarget).removeClass('btn-default');
        $(e.currentTarget).addClass('btn-primary');
        $(e.currentTarget).attr('disabled', true);
        if (saleId == "") {
            Session.set('isRetail', true);
        } else {
            // var sale=Pos.Collection.Sales.findOne(saleId);
            Session.set('isRetail', true);
            Meteor.call('updateToRetailOrWholesale', saleId, true, function (error, result) {
                if (error) {
                    alertify.error(error.message);
                }
            });
        }
    },
    'click #wholesale': function (e) {
        var saleId = $('#sale-id').val();
        $('#retail').removeClass('btn-primary');
        $('#retail').addClass('btn-default');
        $('#retail').attr('disabled', false);
        $(e.currentTarget).removeClass('btn-default');
        $(e.currentTarget).addClass('btn-primary');
        $(e.currentTarget).attr('disabled', true);
        if (saleId == "") {
            Session.set('isRetail', false);
        } else {
            Session.set('isRetail', false);
            Meteor.call('updateToRetailOrWholesale', saleId, false, function (error, result) {
                if (error) {
                    alertify.error(error.message);
                }
            });
        }
    },
    'click .la-box,#total_discount,#total_discount_amount': function (e) {
        $(e.currentTarget).select();
    },
    'mouseout .la-box,#total_discount,#total_discount_amount': function () {
        $('#product-barcode').focus();
    },
    'click #print-invoice': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
        prepareForm();
    },
    'click #print-invoice-small': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var url = '/pos/checkout/printSmallInvoice/' + saleId;
        window.open(url, '_blank');
        prepareForm();
    },
    'click #print-sale': function () {
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var t = true;
        $('#payment-list tr').each(function () {
            t = $(this).find('.pay-amount').val() == "" ? true : false;
            if (t == false) {
                return false
            }
        });
        if ($('#' + baseCurrencyId).val() == "" || t) {
            alertify.warning("Please input payment amount.");
            return;
        }
        var saleId = $('#sale-id').val();
        pay(saleId);
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
    },
    'click #print-sale-small': function () {
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var t = true;
        $('#payment-list tr').each(function () {
            t = $(this).find('.pay-amount').val() == "" ? true : false;
            if (t == false) {
                return false
            }
        });
        if ($('#' + baseCurrencyId).val() == "" || t) {
            alertify.warning("Please input payment amount.");
            return;
        }
        var saleId = $('#sale-id').val();
        pay(saleId);
        var url = '/pos/checkout/printSmallInvoice/' + saleId;
        window.open(url, '_blank');
    },
    'click #save-sale': function () {
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var t = true;
        $('#payment-list tr').each(function () {
            t = $(this).find('.pay-amount').val() == "" ? true : false;
            if (t == false) {
                return false
            }
        });
        if ($('#' + baseCurrencyId).val() == "" || t) {
            alertify.warning("Please input payment amount.");
            return
        }
        var saleId = $('#sale-id').val();
        pay(saleId);
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
    'keyup .pay-amount': function () {
        calculatePayment();
    },
    'change #total_discount_amount': function (e) {
        var value = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var sale = Pos.Collection.Sales.findOne(saleId);
        var firstTotalDiscount = sale.discountAmount == null ? 0 : sale.discountAmount;
        var discount = parseFloat(value);
        if (!numericReg.test(value) || value == "" || discount < 0) {
            $(e.currentTarget).val(firstTotalDiscount);
            $(e.currentTarget).focus();
            return;
        }
        Meteor.call('updateSaleTotalByDiscountAmount', saleId, discount, function (error, result) {
            if (error) alertify.error(error.message);
        });
    },
    'change #total_discount': function (e) {
        var value = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var sale = Pos.Collection.Sales.findOne(saleId);
        var firstTotalDiscount = sale.discount == null ? 0 : sale.discount;
        var discount = parseFloat($(e.currentTarget).val());
        if (!numericReg.test(value) || $(e.currentTarget).val() == "" || discount < 0 || discount > 100) {
            $(e.currentTarget).val(firstTotalDiscount);
            $(e.currentTarget).focus();
            return;
        }
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var total = sale.subTotal * (1 - discount / 100);
        var discountAmount = sale.subTotal * discount / 100;
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        }
        /*  var set = {};
         set.discount = discount;
         set.discountAmount = discountAmount;
         set.total = total;

         Meteor.call('directUpdateSale', saleId, set, function (error, result) {
         if (error) alertify.error(error.message);
         });*/
        Meteor.call('updateSaleTotalByDiscount', saleId, discount, function (error, result) {
            if (error) alertify.error(error.message);
        });
    },
    'click #save-without-pay': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var branchId = Session.get('currentBranch');
        var saleObj = {};
        saleObj.status = 'Owed';
        Pos.Collection.Sales.direct.update(saleId, {$set: saleObj});
        alertify.success('Sale is saved successfully');
        FlowRouter.go('pos.checkout');
        Meteor.call('directUpdateSale', saleId, saleObj);
        Meteor.call('saleManageStock', saleId, branchId);
    },
    'click #btn-pay': function () {
        if ($('#sale-id').val() == "") return;
        $('#payment').modal('show');
        clearDataFormPayment();
    },
    'click #cancel-sale': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        alertify.confirm("Are you sure to cancel this order?")
            .set({
                onok: function (closeEvent) {
                    Meteor.call('cancelSale', saleId, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success('Sale is cancelled.');
                        }
                    });
                    FlowRouter.go('pos.checkout');
                    prepareForm();
                },
                title: "Cancel Sale."
            });
    },
    'click #suspend': function () {
        FlowRouter.go('pos.checkout');
        prepareForm();
    },
    'change #default-quantity': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var value = parseFloat($(e.currentTarget).val() == "" ? 0 : $(e.currentTarget).val());
        if (!numericReg.test(val) || value <= 0) {
            $(e.currentTarget).val(1);
            $(e.currentTarget).focus();
            return;
        }
    },
    'change #default-discount': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var value = parseFloat($(e.currentTarget).val());
        if (!numericReg.test(val) || $(e.currentTarget).val() == "" || value < 0 || value > 100) {
            $(e.currentTarget).val(0);
            $(e.currentTarget).focus();
            return;
        }
    },
    'keypress #default-quantity,.quantity': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'keypress .pay-amount,#default-discount,.price,.discount,#total_discount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'change .price': function (e) {
        var saleId = $('#sale-id').val();
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var firstPrice = this.price;
        var price = parseFloat($(e.currentTarget).val() == "" ? 0 : $(e.currentTarget).val());
        if (!numericReg.test(val) || price <= 0) {
            $(e.currentTarget).val(firstPrice);
            $(e.currentTarget).focus();
            return;
        }
        var set = {};
        set.price = price;
        set.amount = (price * this.quantity) * (1 - this.discount / 100);
        Meteor.call('updateSaleDetails', this._id, set, function (error, result) {
            if (error) alertify.error(error.message);
        });
        // updateSaleSubTotal(saleId);
    },
    'change .quantity': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var self = this;

        var firstQuantity = self.quantity;
        var quantity = parseInt($(e.currentTarget).val() == "" ? 0 : $(e.currentTarget).val());
        if (!numericReg.test(val) || quantity <= 0) {
            $(e.currentTarget).val(firstQuantity);
            $(e.currentTarget).focus();
            return;
        }
        if (self.imei.count() > quantity) {
            alertify.warning("Quantity can't be less than number of IMEI.");
            $(e.currentTarget).val(firstQuantity);
            return;
        }
        checkoutStock(self, firstQuantity, quantity, e);
        /*  if (data.valid) {
         Meteor.call('updateSaleDetails', sdId, set);
         } else {
         alertify.warning(data.message);
         $(e.currentTarget).val(firstQuantity);
         }*/

    },
    'change .discount': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;

        var firstDiscount = this.discount;
        var discount = parseFloat($(e.currentTarget).val());
        if (!numericReg.test(val) || discount < 0 || discount > 100 || $(e.currentTarget).val() == "") {
            $(e.currentTarget).val(firstDiscount);
            $(e.currentTarget).focus();
            return;
        }
        var set = {};
        set.discount = discount;
        set.amount = (this.price * this.quantity) * (1 - discount / 100);
        Meteor.call('updateSaleDetails', this._id, set, function (error, result) {
            if (error) alertify.error(error.message);
        });
        // updateSaleSubTotal(FlowRouter.getParam('saleId'));
    },
    'click .btn-remove': function () {
        var sd = Pos.Collection.SaleDetails.find({
            _id: {$ne: this._id},
            saleId: FlowRouter.getParam('saleId'),
            isPromotion: {$ne: true}
        });
        if (sd.count() == 0) {
            Pos.Collection.Sales.remove(FlowRouter.getParam('saleId'));
            FlowRouter.go('pos.checkout');
            prepareForm();
        } else {
            Pos.Collection.SaleDetails.remove(this._id);
        }
        /*else {
         updateSaleSubTotal(FlowRouter.getParam('saleId'));
         }*/
    },
    'click .staffInsertAddon': function () {
        alertify.userStaff(fa('plus', 'Add New Staff'), renderTemplate(Template.pos_userStaffInsert));
        // .maximize();
    },
    'click .customerInsertAddon': function () {
        alertify.customer(fa('plus', 'Add New Customer'), renderTemplate(Template.pos_customerInsert));
        // .maximize();
    },
    'click .customerLocationInsertAddon': function () {
        alertify.customerLocation(fa('plus', 'Add New Customer Location'), renderTemplate(Template.pos_customerLocationInsert));
        // .maximize();
    },
    /*'change #product-id': function () {
     var id = $('#product-id').val();
     if (id == "") return;
     var isRetail = Session.get('isRetail');
     var saleId = $('#sale-id').val();
     var branchId = Session.get('currentBranch');
     var data = getValidatedValues('id', id, branchId, saleId);
     if (data.valid) {
     addOrUpdateProducts(branchId, saleId, isRetail, data.product, data.saleObj);
     } else {
     alertify.warning(data.message);
     }
     $('#product-id').select2('val', '');
     $('#product-barcode').val('');
     $('#product-barcode').focus();
     },*/
    'keyup #product-barcode': function (e) {
        var charCode = e.which;
        if (e.which == 13) {
            var data = getValidatedValues();
            var barcode = $(e.currentTarget).val();
            var selector = {barcode: barcode, status: "enable"};
            if (data.valid) {
                checkBeforeAddOrUpdate(selector, data);
            } else {
                alertify.warning(data.message);
            }
            $('#product-barcode').focus();
        }
    },
    'keyup #product-barcode-promotion': function (e) {
        var charCode = e.which;
        if (e.which == 13) {
            var saleId = $('#sale-id').val();
            if (saleId == '') {
                return;
            }
            var barcode = $(e.currentTarget).val();
            var selector = {barcode: barcode, status: "enable"};
            checkBeforeAddOrUpdatePromotion(selector);
            $('#product-barcode-promotion').focus();
        }
    }
});
function checkoutStock(self, oldQty, newQty, e) {
    var saleId = $('#sale-id').val();
    var branchId = Session.get('currentBranch');
    var sdId = self._id;
    var locationId = $('#location-id').val();
    var set = {};
    set.quantity = newQty;
    set.amount = (self.price * newQty) * (1 - self.discount / 100);
    //var product = Pos.Collection.Products.findOne(productId);
    Meteor.call('findOneRecord', 'Pos.Collection.Products', {_id: self.productId}, {}, function (error, product) {
        if (product) {
            if (product.productType == "Stock") {
                //---Open Inventory type block "FIFO Inventory"---
                Meteor.call('findOneRecord', 'Pos.Collection.FIFOInventory', {
                    branchId: branchId,
                    productId: product._id,
                    locationId: locationId
                }, {sort: {createdAt: -1}}, function (error, inventory) {
                    if (inventory) {
                        var remainQuantity = inventory.remainQty - newQty;
                        var saleDetails = Pos.Collection.SaleDetails.find({
                            _id: {$ne: self._id},
                            productId: product._id,
                            saleId: saleId,
                            locationId: locationId
                        });
                        if (saleDetails.count() > 0) {
                            var saleDetailQty = 0;
                            saleDetails.forEach(function (saleDetail) {
                                saleDetailQty += saleDetail.quantity;
                            });
                            remainQuantity = remainQuantity - saleDetailQty;
                        }
                        if (remainQuantity < 0) {
                            alertify.warning('Product is out of stock. Quantity in stock is "' + inventory.remainQty + '".');
                            $(e.currentTarget).val(oldQty);
                        } else {
                            var unSavedSaleId = Pos.Collection.Sales.find({
                                status: "Unsaved",
                                branchId: Session.get('currentBranch'),
                                _id: {$ne: saleId},
                                locationId: locationId
                            }, {fields: {_id: 1}}).map(function (s) {
                                return s._id;
                            });
                            var otherSaleDetails = Pos.Collection.SaleDetails.find({
                                saleId: {$in: unSavedSaleId},
                                productId: product._id,
                                locationId: locationId
                            }, {fields: {quantity: 1}});
                            var otherQuantity = 0;
                            if (otherSaleDetails != null) {
                                otherSaleDetails.forEach(function (sd) {
                                    otherQuantity += sd.quantity;
                                });
                            }
                            remainQuantity = remainQuantity - otherQuantity;
                            if (remainQuantity < 0) {
                                $(e.currentTarget).val(oldQty);
                                alertify.warning('Product is out of stock. Quantity in stock is "' +
                                    inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity + '".');

                            } else {
                                var unSavedLocationTransferId = Pos.Collection.LocationTransfers.find({
                                    status: "Unsaved",
                                    branchId: Session.get('currentBranch'),
                                    fromLocationId: locationId
                                }, {fields: {_id: 1}}).map(function (lt) {
                                    return lt._id;
                                });
                                var otherLocationTransferDetails = Pos.Collection.LocationTransferDetails.find({
                                    locationTransferId: {$in: unSavedLocationTransferId},
                                    fromLocationId: locationId,
                                    productId: product._id
                                }, {fields: {quantity: 1}});
                                var locationTransferQuantity = 0;
                                if (otherLocationTransferDetails.count() > 0) {
                                    otherLocationTransferDetails.forEach(function (ltd) {
                                        locationTransferQuantity += ltd.quantity;
                                    });
                                }
                                remainQuantity = remainQuantity - locationTransferQuantity;
                                if (remainQuantity < 0) {
                                    $(e.currentTarget).val(oldQty);
                                    alertify.warning('Product is out of stock. Quantity in stock is "' +
                                        inventory.remainQty + '". And quantity on sale of other seller is "' +
                                        otherQuantity + '". And quantity of location transfer is "' + locationTransferQuantity + '".');
                                } else {
                                    Meteor.call('updateSaleDetails', self._id, set);
                                }
                            }
                        }
                    } else {
                        alertify.warning("Don't have product in stock.");
                        $(e.currentTarget).val(oldQty);
                    }
                });
            } else {
                Meteor.call('updateSaleDetails', self._id, set);
            }
        }
        else {
            alertify.warning("Can't find this product.");
            $(e.currentTarget).val(oldQty);
        }
    });

}
function getValidatedValues() {
    var data = {};
    var id = Cpanel.Collection.Setting.findOne().baseCurrency;
    /* var exchangeRate = Pos.Collection.ExchangeRates.findOne({
     base: id,
     branchId: Session.get('currentBranch')
     }, {sort: {_id: -1, createdAt: -1}});
     if (exchangeRate == null) {
     data.valid = false;
     data.message = "Please input exchange rate for this branch.";
     return data;
     }*/
    var voucher = $('#voucher').val();
    /*if (voucher == '') {
     data.valid = false;
     data.message = "Please input voucher.";
     return data;
     }*/
    /*else {
     if (saleId == '') {
     Meteor.call();
     var sale = Pos.Collection.Sales.findOne({voucher: voucher, branchId: branchId});
     if (sale != null) {
     data.valid = false;
     data.message = 'Voucher already exists. Please input the other one.';
     return data;
     }
     }
     }*/
    var saleDate = $('#input-sale-date').val();
    if (saleDate == '') {
        data.valid = false;
        data.message = "Please input saleDate";
        return data;
    }
    var locationId = $('#location-id').val();
    if (locationId == '' || locationId == null) {
        data.valid = false;
        data.message = "Please select location name.";
        return data;
    }

    var staffId = $('#staff-id').val();
    if (staffId == '' || staffId == null) {
        data.valid = false;
        data.message = "Please select staff name.";
        return data;
    }
    var customerLocationId = $('#customer-location-id').val();
    if (customerLocationId == "" || customerLocationId == null) {
        data.valid = false;
        data.message = "Please select customer Location name.";
        return data;
    }
    var customerId = $('#customer-id').val();
    if (customerId == "" || customerId == null) {
        data.valid = false;
        data.message = "Please select customer name.";
        return data;
    }
    var transactionType = $('#transaction-type').val();
    if (transactionType == "") {
        data.valid = false;
        data.message = "Please select transaction type.";
        return data;
    }

    data.message = "Add product to list is successfully.";
    data.valid = true;
    data.saleObj = {
        saleDate: moment(saleDate, 'MM/DD/YYYY hh:mm:ss a').toDate(),
        staffId: staffId,
        customerId: customerId,
        //exchangeRateId: exchangeRate._id,
        description: $('#description').val(),
        transactionType: transactionType,
        voucher: voucher,
        locationId: locationId,
        customerLocationId: customerLocationId
    };
    var exchangeRate = Pos.Collection.ExchangeRates.findOne({
        base: id,
        branchId: Session.get('currentBranch')
    }, {sort: {_id: -1, createdAt: -1}});
    if (exchangeRate) {
        data.saleObj.exchangeRateId = exchangeRate._id;
    }

    //data.product = product;
    return data;
}
function addOrUpdateProducts(branchId, saleId, isRetail, product, saleObj) {

    var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
    var defaultDiscount = $('#default-discount').val() == "" ? 0 : parseFloat($('#default-discount').val());
    if (saleId == '') {
        // var exchange=parseFloat($('#last-exchange-rate').text());
        var totalDiscount = $('#total_discount').val() == "" ? 0 : parseFloat($('#total_discount').val());
        saleObj.status = "Unsaved";
        saleObj.subTotal = 0;
        saleObj.discount = totalDiscount;
        saleObj.discountAmount = 0;
        saleObj.total = 0;
        saleObj.branchId = branchId;
        saleObj.isRetail = isRetail;
        var saleDetailObj = {};
        saleDetailObj.productId = product._id;
        saleDetailObj.quantity = defaultQuantity;
        saleDetailObj.discount = defaultDiscount;
        saleDetailObj.imei = [];
        saleDetailObj.price = isRetail ? product.retailPrice : product.wholesalePrice;
        saleDetailObj.amount = (saleDetailObj.price * defaultQuantity) * (1 - defaultDiscount / 100);
        saleDetailObj.branchId = branchId;
        saleDetailObj.locationId = saleObj.locationId;
        saleDetailObj.status = "Unsaved";
        Meteor.call('insertSaleAndSaleDetail', saleObj, saleDetailObj, function (error, saleId) {
            if (saleId) {
                $('#product-barcode').val('');
                $('#product-barcode').focus();
                $('#product-id').select2('val', '');
                FlowRouter.go('pos.checkout', {saleId: saleId});
            } else {
                alertify.error(error.message);
                $('#product-barcode').focus();
            }

        });
    } else {
        var saleDetail = Pos.Collection.SaleDetails.findOne({
            productId: product._id,
            saleId: saleId,
            isPromotion: {$ne: true}
        });
        if (saleDetail == null) {
            var saleDetailObj = {};
            saleDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.SaleDetails, saleId, 3);
            saleDetailObj.saleId = saleId;
            saleDetailObj.quantity = defaultQuantity;
            saleDetailObj.discount = defaultDiscount;
            saleDetailObj.productId = product._id;
            saleDetailObj.price = isRetail == true ? product.retailPrice : product.wholesalePrice;
            saleDetailObj.amount = (saleDetailObj.price * defaultQuantity) * (1 - defaultDiscount / 100);
            saleDetailObj.branchId = branchId;
            saleDetailObj.locationId = saleObj.locationId;
            saleDetailObj.imei = [];
            saleDetailObj.status = "Unsaved";
            Meteor.call('insertSaleDetails', saleDetailObj, function (error, result) {
                if (error) alertify.error(error.message);
            });
        } else {
            var set = {};
            //need to checkout
            set.discount = defaultDiscount;
            set.quantity = (saleDetail.quantity + defaultQuantity);
            set.amount = (saleDetail.price * set.quantity) * (1 - defaultDiscount / 100);
            Meteor.call('updateSaleDetails', saleDetail._id, set, function (error, result) {
                if (error) alertify.error(error.message);
            });
        }
        $('#product-barcode').val('');
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        // updateSaleSubTotal(saleId);
    }
}
function addOrUpdateProductsOld(saleId, product, isRetail) {
    var saleDate = $('#input-sale-date').val();
    var branchId = Session.get('currentBranch');
    var id = Cpanel.Collection.Setting.findOne().baseCurrency;
    var exchangeRate = Pos.Collection.ExchangeRates.findOne({
        base: id,
        branchId: branchId
    }, {sort: {_id: -1, createdAt: -1}});
    var exchangeRateId = "";
    if (exchangeRate == null) {
        alertify.alert("Please set your exchange rate for this branch.")
            .set({title: "Exchange Rate is required."});
        $('#product-id').select2('val', '');
        return;
    } else {
        exchangeRateId = exchangeRate._id
    }
    var customerId = $('#customer-id').val();
    var staffId = $('#staff-id').val();
    if (customerId == "" || staffId == "" || customerId == null || staffId == null || saleDate == "") {
        alertify.alert("Please input all Require data (*)")
            .set({title: "Data is Required."});
        $('#product-id').select2('val', '');
        $('#product-barcode').val('');
        $('#product-barcode').focus();
        return;
    }
    var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
    var defaultDiscount = $('#default-discount').val() == "" ? 0 : parseFloat($('#default-discount').val());
    if (saleId == '') {
        // var exchange=parseFloat($('#last-exchange-rate').text());
        var totalDiscount = $('#total_discount').val() == "" ? 0 : parseFloat($('#total_discount').val());
        var saleObj = {};
        //saleObj._id = newId;
        saleObj.customerId = customerId;
        saleObj.staffId = staffId;
        saleObj.status = "Unsaved";
        saleObj.subTotal = 0;
        saleObj.discount = totalDiscount;
        saleObj.discountAmount = 0;
        saleObj.total = 0;
        saleObj.branchId = branchId;
        saleObj.isRetail = isRetail;
        saleObj.exchangeRateId = exchangeRateId;
        saleObj.saleDate = moment(saleDate).toDate();
        var saleDetailObj = {};
        saleDetailObj.productId = product._id;
        saleDetailObj.quantity = defaultQuantity;
        saleDetailObj.discount = defaultDiscount;

        saleDetailObj.price = isRetail ? product.retailPrice : product.wholesalePrice;
        saleDetailObj.amount = (saleDetailObj.price * defaultQuantity) * (1 - defaultDiscount / 100);
        saleDetailObj.branchId = branchId;
        Meteor.call('insertSaleAndSaleDetail', saleObj, saleDetailObj, function (error, saleId) {
            $('#product-barcode').focus();
            if (e) {
                alertify.error("Can't make a sale.");
            } else {
                // updateSaleSubTotal(newId);
                $('#product-barcode').val('');
                $('#product-barcode').focus();
                $('#product-id').select2('val', '');
                FlowRouter.go('pos.checkout', {saleId: saleId});
            }
        });


        //
    } else {
        var saleDetail = Pos.Collection.SaleDetails.findOne({
            productId: product._id,
            saleId: saleId,
            isPromotion: {$ne: true}
        });
        if (saleDetail == null) {
            var saleDetailObj = {};
            saleDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.SaleDetails, saleId, 3);
            saleDetailObj.saleId = saleId;
            saleDetailObj.quantity = defaultQuantity;
            saleDetailObj.discount = defaultDiscount;
            saleDetailObj.productId = product._id;
            saleDetailObj.price = isRetail == true ? product.retailPrice : product.wholesalePrice;
            saleDetailObj.amount = (saleDetailObj.price * defaultQuantity) * (1 - defaultDiscount / 100);
            saleDetailObj.branchId = branchId;
            Meteor.call('insertSaleDetails', saleDetailObj);
        } else {
            var set = {};
            //need to checkout
            set.discount = defaultDiscount;
            set.quantity = (saleDetail.quantity + defaultQuantity);
            set.amount = (saleDetail.price * set.quantity) * (1 - defaultDiscount / 100);
            Meteor.call('updateSaleDetails', saleDetail._id, set);
        }
        $('#product-barcode').val('');
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        // updateSaleSubTotal(saleId);
    }
}
function updateSaleSubTotal(saleId) {
    var discount = Pos.Collection.Sales.findOne(saleId).discount;
    var saleSubTotal = 0;
    var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
    saleDetails.forEach(function (saleDetail) {
        saleSubTotal += parseFloat(saleDetail.amount);
    });
    var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
    var total = saleSubTotal * (1 - discount / 100);
    if (baseCurrencyId == "KHR") {
        total = roundRielCurrency(total);
    }
    var set = {};
    set.subTotal = saleSubTotal;
    set.total = total;
    Meteor.call('updateSale', saleId, set);
}
function clearDataFormPayment() {
    var grandTotal = $('#due-grand-total').text().trim();
    $('.pay-amount:first').val(grandTotal);
    $('.return-amount').val('0');
}
function calculatePayment() {
    var total = 0;
    var dueTotal = parseFloat($('#due-grand-total').text().trim());
    $('#payment-list tr').each(function () {
        var currencyId = $(this).find('.currency-id').text();
        var pay = $(this).find('.pay-amount').val() == "" ? 0 : $(this).find('.pay-amount').val();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var payCheckCurrency = currencyId == "KHR" ? roundDownRielCurrency(parseFloat(pay)) : parseFloat(pay);
        total += payCheckCurrency / parseFloat(rate);
    });
    total = total - dueTotal;
    $('#payment-list tr').each(function () {
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
function pay(saleId) {
    var branchId = Session.get('currentBranch');
    var obj = {};
    obj.payments = [];
    var totalPay = 0;
    $('#payment-list tr').each(function () {
        var currencyId = $(this).find('.currency-id').text().trim();
        var pay = $(this).find('.pay-amount').val() == "" ? 0 : $(this).find('.pay-amount').val();
        var rate = $(this).find('.exchange-rate').val() == "" ? 0 : $(this).find('.exchange-rate').val();
        var returnAmount = $(this).find('.return-amount').val();
        returnAmount = numeral().unformat(returnAmount);
        returnAmount = math.round(returnAmount, 2);
        pay = parseFloat(pay);
        rate = parseFloat(rate);
        if (currencyId == "KHR") {
            pay = roundRielCurrency(pay);
        } else {
            pay = math.round(pay, 2);
        }
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
    /*if(totalPay==0){
     return;
     }*/
    var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
    obj.saleId = saleId;
    obj.payAmount = math.round(totalPay, 2);
    // obj.payAmount = numeral().unformat(numeral(totalPay).format('0,0.00'));
    obj.dueAmount = math.round(parseFloat($('#due-grand-total').text().trim()), 2);
    obj.balanceAmount = math.round((obj.dueAmount - obj.payAmount), 2);
    //obj.balanceAmount = numeral().unformat($('#' + baseCurrencyId).val());
    obj.status = obj.balanceAmount <= 0 ? "Paid" : "Owed";
    obj.branchId = branchId;

    $('#payment').modal('hide');
    FlowRouter.go('pos.checkout');
    prepareForm();
    Meteor.call('insertPayment', obj);
    Meteor.call('saleManageStock', saleId, branchId);
}
function checkIsUpdate() {
    var saleId = $('#sale-id').val();
    if (saleId == "") {
        Session.set('hasUpdate', false);
        return;
    }
    var sale = Pos.Collection.Sales.findOne(saleId);
    var transactionType = $('#transaction-type').val();
    var customer = $('#customer-id').val();
    var staff = $('#staff-id').val();
    var date = $('#input-sale-date').val();
    var saleDate = moment(sale.saleDate).format('MM/DD/YYYY hh:mm:ss A');
    var description = $('#description').val();
    var hasUpdate = false;
    var voucher = $('#voucher').val();
    var saleVoucher = sale.voucher == null ? '' : sale.voucher;
    var saleDescription = sale.description == null ? '' : sale.description;
    var customerLocationId = $('#customer-location-id').val();
    if (date != saleDate || customer != sale.customerId ||
        staff != sale.staffId || transactionType != sale.transactionType ||
        description != saleDescription || voucher != saleVoucher || customerLocationId != sale.customerLocationId) {
        hasUpdate = true;
    }
    Session.set('hasUpdate', hasUpdate);
}
function prepareForm() {
    Meteor.setTimeout(function () {
        Session.set('isRetail', true);
        Session.set('hasUpdate', false);
        $('#input-sale-date').val('');
        $('#voucher').val('');
        $('#staff-id').select2();
        $('#customer-id').select2();
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        $('#transaction-type').select2('val', 'Sale');
    }, 200);
}
function subtractArray(src, filt) {
    var temp = {}, i, result = [];
    // load contents of filt into an object
    // for faster lookup
    for (i = 0; i < filt.length; i++) {
        temp[filt[i]] = true;
    }

    // go through each item in src
    for (i = 0; i < src.length; i++) {
        if (!(src[i] in temp)) {
            result.push(src[i]);
        }
    }
    return (result);
}

function checkBeforeAddOrUpdatePromotion(selector) {
    var locationId = $('#location-id').val();
    var isRetail = Session.get('isRetail');
    var saleId = $('#sale-id').val();
    var branchId = Session.get('currentBranch');
    Meteor.call('findOneRecord', 'Pos.Collection.Products', selector, {}, function (error, product) {
        var defaultQuantity = $('#default-quantity-promotion').val() == "" ? 1 : parseInt($('#default-quantity-promotion').val());
        if (product) {
            if (product.productType == "Stock") {
                var saleDetails = Pos.Collection.SaleDetails.find({
                    productId: product._id,
                    saleId: saleId,
                    locationId: locationId
                });
                if (saleDetails.count() > 0) {
                    var saleDetailQty = 0;
                    saleDetails.forEach(function (saleDetail) {
                        saleDetailQty += saleDetail.quantity;
                    });
                    defaultQuantity = defaultQuantity + saleDetailQty;
                }
                debugger;
                //---Open Inventory type block "FIFO Inventory"---
                Meteor.call('findOneRecord', 'Pos.Collection.FIFOInventory', {
                    branchId: branchId,
                    productId: product._id,
                    locationId: locationId
                }, {sort: {createdAt: -1}}, function (error, inventory) {
                    if (inventory) {
                        var remainQuantity = inventory.remainQty - defaultQuantity;
                        if (remainQuantity < 0) {
                            alertify.warning('Product is out of stock. Quantity in stock is "' + inventory.remainQty + '".');
                        } else {
                            var unSavedSaleId = Pos.Collection.Sales.find({
                                status: "Unsaved",
                                branchId: Session.get('currentBranch'),
                                locationId: locationId,
                                _id: {$ne: saleId}
                            }, {fields: {_id: 1}}).map(function (s) {
                                return s._id;
                            });
                            var otherSaleDetails = Pos.Collection.SaleDetails.find({
                                saleId: {$in: unSavedSaleId},
                                productId: product._id,
                                locationId: locationId
                            }, {fields: {quantity: 1}});
                            var otherQuantity = 0;
                            if (otherSaleDetails.count() > 0) {
                                otherSaleDetails.forEach(function (sd) {
                                    otherQuantity += sd.quantity;
                                });
                            }

                            remainQuantity = remainQuantity - otherQuantity;
                            if (remainQuantity < 0) {
                                alertify.warning('Product is out of stock. Quantity in stock is "' +
                                    inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity + '".');
                            }
                            else {
                                var unSavedLocationTransferId = Pos.Collection.LocationTransfers.find({
                                    status: "Unsaved",
                                    branchId: Session.get('currentBranch'),
                                    fromLocationId: locationId,
                                }, {fields: {_id: 1}}).map(function (lt) {
                                    return lt._id;
                                });
                                var otherLocationTransferDetails = Pos.Collection.LocationTransferDetails.find({
                                    locationTransferId: {$in: unSavedLocationTransferId},
                                    fromLocationId: locationId,
                                    productId: product._id
                                }, {fields: {quantity: 1}});
                                var locationTransferQuantity = 0;
                                if (otherLocationTransferDetails.count() > 0) {
                                    otherLocationTransferDetails.forEach(function (ltd) {
                                        locationTransferQuantity += ltd.quantity;
                                    });
                                }
                                remainQuantity = remainQuantity - locationTransferQuantity;
                                if (remainQuantity < 0) {
                                    alertify.warning('Product is out of stock. Quantity in stock is "' +
                                        inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity +
                                        '". And quantity of location transfer is "' + locationTransferQuantity + '".');
                                } else {
                                    addOrUpdatePromotionProducts(branchId, saleId, product, locationId);
                                }
                            }
                        }
                    }
                    else {
                        alertify.warning("Don't have product in stock.");
                    }
                });
                //---End Inventory type block "FIFO Inventory"---
            }
            else {
                addOrUpdatePromotionProducts(branchId, saleId, product, locationId);
            }
        }
        else {
            alertify.warning("Can't find this Product");
        }
    });
}

function addOrUpdatePromotionProducts(branchId, saleId, product, locationId) {
    var defaultQuantity = $('#default-quantity-promotion').val() == "" ? 1 : parseInt($('#default-quantity').val());
    var saleDetail = Pos.Collection.SaleDetails.findOne({
        productId: product._id,
        saleId: saleId,
        isPromotion: true
    });
    if (saleDetail == null) {
        var saleDetailObj = {};
        saleDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.SaleDetails, saleId, 3);
        saleDetailObj.saleId = saleId;
        saleDetailObj.quantity = defaultQuantity;
        saleDetailObj.discount = 0;
        saleDetailObj.productId = product._id;
        saleDetailObj.price = 0;
        saleDetailObj.amount = 0;
        saleDetailObj.branchId = branchId;
        saleDetailObj.locationId = locationId;
        saleDetailObj.imei = [];
        saleDetailObj.status = "Unsaved";
        saleDetailObj.isPromotion = true;
        Meteor.call('insertSaleDetails', saleDetailObj, function (error, result) {
            if (error) alertify.error(error.message);
        });
    }
    else {
        var set = {};
        set.quantity = (saleDetail.quantity + defaultQuantity);
        Meteor.call('updateSaleDetails', saleDetail._id, set, function (error, result) {
            if (error) alertify.error(error.message);
        });
    }
    $('#product-barcode-promotion').val('');
    $('#product-barcode-promotion').focus();
    $('#product-id').select2('val', '');
    // updateSaleSubTotal(saleId);

}