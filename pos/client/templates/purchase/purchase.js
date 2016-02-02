Session.setDefault('purchaseHasUpdate', false);
Template.pos_purchase.onRendered(function () {
    Meteor.typeahead.inject();
    createNewAlertify(["supplier", "userStaff"]);
    // $('#product-id').select2();
    $('#product-barcode').focus();
    $('#purchase-date').datetimepicker({
        format: "MM/DD/YYYY hh:mm:ss A"
    });
    setTimeout(function () {
        $('.select-two').select2();
        var s = Pos.Collection.Purchases.findOne({
            _id: FlowRouter.getParam('purchaseId'),
            status: "Unsaved",
            branchId: Session.get('currentBranch')
        });
        if (s == null) {
            FlowRouter.go('pos.purchase');
            $('#product-barcode').focus();
        }

    }, 500);
});
Template.pos_purchase.helpers({
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
        var data = getValidatedValues();
        var purchaseId = $('#purchase-id').val();
        var branchId = Session.get('currentBranch');
        if (data.valid) {
            Meteor.call('findOneRecord', 'Pos.Collection.Products', {_id: id}, {}, function (error, product) {
                if (product) {
                    if (product.productType == "Stock") {
                        var defaultPrice = $('#default-price').val() == "" ? product.purchasePrice : parseFloat($('#default-price').val());
                        product.defaultPrice = defaultPrice;
                        addOrUpdateProducts(branchId, purchaseId, product, data.purchaseObj);
                        var defaultPrice = $('#default-price').val() == "" ? product.purchasePrice : parseFloat($('#default-price').val());
                        product.defaultPrice = defaultPrice;
                        if (defaultPrice >= product.wholesalePrice) {
                            alertify.alert('Are you sure to purchase this purchase? ' +
                                    'The price should be lower than wholesale price "' + product.wholesalePrice + '" of this product.')
                                .set({
                                    title: "Price should be changed."
                                });
                        }
                        else if (defaultPrice >= product.wholesalePrice) {
                            alertify.alert('Are you sure to purchase this purchase? ' +
                                    'The price should be lower than retail price "' + product.retailPrice + '" of this product.')
                                .set({
                                    title: "Price should be changed."
                                });
                        }
                    } else {
                        alertify.warning('This Product is non-stock type.');
                    }

                } else {
                    alertify.warning("Cant't find this product.");
                }
            });
        } else {
            alertify.warning(data.message);
            $('#product-id').val('');
            $('#product-barcode').val('');
            $('#product-barcode').focus();
            return;
        }

    },
    locations: function () {
        return Pos.Collection.Locations.find({branchId: Session.get('currentBranch')});
    },
    transactionType: function () {
        return [
            {value: 'Purchase', name: 'Purchase'},
            {value: 'AdjustmentQtyUp', name: 'AdjustmentQtyUp'}
        ]
    },
    imeis: function () {
        var purchaseDetailId = Session.get('purchaseDetailId');
        if (purchaseDetailId != null) {
            var pd = Pos.Collection.PurchaseDetails.findOne(purchaseDetailId);
            return (pd == null || pd.imei == null) ? [] : pd.imei;
        } else {
            return [];
        }
    },
    purchaseHasUpdate: function () {
        var hasUpdate = Session.get('purchaseHasUpdate');
        if (hasUpdate != null && hasUpdate != "null") {
            return hasUpdate;
        }
        return false;
    },
    purchaseDate: function () {
        var purchase = Pos.Collection.Purchases.findOne(FlowRouter.getParam('purchaseId'));
        if (purchase == null) {
            return moment(TimeSync.serverTime(null)).format('MM/DD/YYYY hh:mm:ss A');
        } else {
            return moment(purchase.purchaseDate).format('MM/DD/YYYY hh:mm:ss A');
        }
    },
    getFileOfCurrency: function (id, field) {
        var currency = Cpanel.Collection.Currency.findOne(id);
        return currency[field];
    },
    hasTotal: function (total) {
        return total != null;
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
    currencies: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.find({_id: {$ne: id}});
    },
    baseCurrency: function () {
        var setting = Cpanel.Collection.Setting.findOne();
        if (setting) {
            return Cpanel.Collection.Currency.findOne(setting.baseCurrency);
        }
    },
    exchangeRates: function () {
        var purchase = Pos.Collection.Purchases.findOne(FlowRouter.getParam('purchaseId'));
        if (purchase) {
            return Pos.Collection.ExchangeRates.findOne(purchase.exchangeRateId);
        } else {
            var setting = Cpanel.Collection.Setting.findOne();
            if (setting) {
                return Pos.Collection.ExchangeRates.findOne({
                    base: setting.baseCurrency,
                    branchId: Session.get('currentBranch')
                }, {sort: {_id: -1, createdAt: -1}});
            } else {
                return {};
            }
        }
    },
    compareTwoValue: function (val1, val2) {
        return val1 == val2;
    },
    isPurchase: function () {
        var purchase = Pos.Collection.Purchases.findOne(FlowRouter.getParam('purchaseId'));
        return purchase != null;
    },
    purchase: function () {
        var p = Pos.Collection.Purchases.findOne(FlowRouter.getParam('purchaseId'));
        if (p) {
            p.purchaseDate = moment(p.purchaseDate).format("DD-MM-YY, hh:mm:ss a");
            p.subTotalFormatted = numeral(p.subTotal).format('0,0.00');
            p.totalFormatted = numeral(p.total).format('0,0.00');
            return p;
        } else {
            return {};
        }
    },
    purchaseDetails: function () {
        var purchaseDetailItems = [];
        var sD = Pos.Collection.PurchaseDetails.find({purchaseId: FlowRouter.getParam('purchaseId')});
        var i = 1;
        sD.forEach(function (sd) {
            // var item = _.extend(sd,{});
            /* var product = Pos.Collection.Products.findOne(sd.productId);
             var unit = Pos.Collection.Units.findOne(product.unitId).name;
             sd.productName = product.name + "(" + unit + ")";*/
            sd.amountFormatted = numeral(sd.amount).format('0,0.00');
            //sd.order = pad(i, 2);
            sd.order = i;
            i++;
            purchaseDetailItems.push(sd);
        });
        return purchaseDetailItems;
    },
    staffs: function () {
        var userStaff = Pos.Collection.UserStaffs.findOne({userId: Meteor.user()._id});
        if (userStaff != null) {
            return Pos.Collection.Staffs.find({
                _id: {$in: userStaff.staffIds},
                branchId: Session.get('currentBranch')
            });
        } else {
            return [];
        }
    },
    suppliers: function () {
        return Pos.Collection.Suppliers.find({
            branchId: Session.get('currentBranch')
        });
    },
    products: function () {
        return Pos.Collection.Products.find({
            status: "enable",
            productType: "Stock"
        });
    },
    purchases: function () {
        var id = FlowRouter.getParam('purchaseId');
        if (id != null || id != "") {
            return Pos.Collection.Purchases.find({
                _id: {$ne: id},
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });
        }
        else {
            return Pos.Collection.Purchases.find({
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });

        }
    }
});
Template.pos_purchase.events({
    'click .tt-input': function (e) {
        $(e.currentTarget).focus().selected;
    },
    'change #location-id': function () {
        checkPurchaseIsUpdate();
    },
    'change #transaction-type': function () {
        checkPurchaseIsUpdate();
    },
    'keyup #description': function () {
        checkPurchaseIsUpdate();
    },
    'click .btn-remove-imei': function (e) {
        var purchaseDetailId = Session.get('purchaseDetailId');
        var thisBtn = $(e.currentTarget);
        // var imei = thisBtn.parents('tr').find('.td-imei').text().trim();
        var imei = this;
        var purchaseDetail = Pos.Collection.PurchaseDetails.findOne(purchaseDetailId);
        var obj = {};
        obj.imei = subtractArray(purchaseDetail.imei, [imei]);
        Meteor.call('updatePurchaseDetails', purchaseDetailId, obj);

    },
    'keyup #input-imei': function (e) {
        if (e.which == 13) {
            var element = $(e.currentTarget);
            var imei = element.val().trim();
            if (imei == "") {
                return;
            }
            var purchaseDetailId = Session.get('purchaseDetailId');
            var purchaseDetail = Pos.Collection.PurchaseDetails.findOne(purchaseDetailId);
            var obj = {};
            var imeis = purchaseDetail.imei == null ? [] : purchaseDetail.imei;
            var purchaseHasIMEI = Pos.Collection.PurchaseDetails.findOne({
                imei: {"$in": [imei]}
            });

            if (imeis.indexOf(imei) != -1) {
                alertify.warning('IMEI is already exist.');

            } else if (purchaseHasIMEI) {
                alertify.warning('IMEI is already exist this purchase or other.');
            } else if (purchaseDetail.imei.count() == purchaseDetail.quantity) {
                alertify.warning("Number of IMEI can't greater than Quantity.");
            }
            else {
                Meteor.call('isExistIMEI', imei, purchaseDetail.branchId, purchaseDetail.locationId, function (error, exist) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        if (!exist) {
                            imeis.push(imei);
                            obj.imei = imeis;
                            Meteor.call('updatePurchaseDetails', purchaseDetailId, obj,
                                function (er, re) {
                                    if (er) {
                                        alertify.error(er.message);
                                    } else {
                                        element.val('');
                                        element.focus();
                                    }
                                }
                            );
                        } else {
                            alertify.warning('IMEI already Exist.');
                        }

                    }
                });
            }

        }
    },
    'click .btn-imei': function () {
        Session.set('purchaseDetailId', this._id);
        $('#input-imei').val('');
        $('#imei').modal('show');
    },
    'click .resume': function (e) {
        var purchaseId = $(e.currentTarget).attr('data-id');
        var purchase = Pos.Collection.Purchases.findOne(purchaseId);
        Session.set('purchaseHasUpdate', false);
        $('#location-id').select2('val', purchase.locationId);
        $('#supplier-id').select2('val', purchase.supplierId);
        $('#staff-id').select2('val', purchase.staffId);
        $('#input-purchase-date').val(moment(purchase.purchaseDate).format('MM/DD/YYYY hh:mm:ss A'));
    },
    'click #btn-update-purchase-data': function () {
        var purchaseId = $('#purchase-id').val();
        if (purchaseId == "") return;
        var supplier = $('#supplier-id').val();
        var staff = $('#staff-id').val();
        var date = $('#input-purchase-date').val();
        var transactionType = $('#transaction-type').val();
        var description = $('#description').val();
        var locationId = $('#location-id').val();
        var set = {};
        set.supplierId = supplier;
        set.staffId = staff;
        set.purchaseDate = moment(date).toDate();
        set.transactionType = transactionType;
        set.description = description;
        set.locationId = locationId;
        Meteor.call('directUpdatePurchase', purchaseId, set, function (error, result) {
            if (error)alertify.error(error.message);
        });
        Session.set('purchaseHasUpdate', false);
        $('#product-barcode').focus();

    },
    'blur #input-purchase-date': function () {
        checkPurchaseIsUpdate();
    },
    'change #supplier-id': function () {
        checkPurchaseIsUpdate();
    },
    'change #staff-id': function () {
        checkPurchaseIsUpdate();
    },
    //'click':function(){
    //    $('#product-barcode').focus();
    //},
    'mouseout .handle-mouseout,.la-box': function () {
        $('#product-barcode').focus();
    },
    'click #print-invoice': function () {
        var purchaseId = $('#purchase-id').val();
        if (purchaseId == "") {
            return;
        }
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
        preparePurchaseForm();
    },
    'click #print-purchase': function () {
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var t = true;
        $('#payment-list tr').each(function () {
            t = $(this).find('.pay-amount').val() == "" ? true : false;
            if (t == false) {
                return false
            }
        });
        if ($('#' + baseCurrencyId).val() == "" || t) {
            return;
        }
        var purchaseId = $('#purchase-id').val();
        pay(purchaseId);
        $('#payment').modal('hide');
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
        //clickPrintButton();
        FlowRouter.go('pos.purchase');
        preparePurchaseForm();
    },
    'click #save-purchase': function () {
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var t = true;
        $('#payment-list tr').each(function () {
            t = $(this).find('.pay-amount').val() == "" ? true : false;
            if (t == false) {
                return false
            }
        });
        if ($('#' + baseCurrencyId).val() == "" || t) {
            return;
        }
        var purchaseId = $('#purchase-id').val();
        pay(purchaseId);
        $('#payment').modal('hide');
        //var url = $('#btn-print').attr('href');
        //window.open(url, '_blank');
        //clickPrintButton();
        FlowRouter.go('pos.purchase');
        preparePurchaseForm();
    },
    'keyup .pay-amount': function () {
        calculatePayment();
    },
    'change #total_discount': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var purchaseId = $('#purchase-id').val();
        if (purchaseId == "") {
            return;
        }
        var purchase = Pos.Collection.Purchases.findOne(purchaseId);
        var firstTotalDiscount = purchase.discount == null ? 0 : purchase.discount;
        var discount = parseFloat($(e.currentTarget).val());
        if (!numericReg.test(val) || $(e.currentTarget).val() == "" || discount < 0 || discount > 100) {
            $(e.currentTarget).val(firstTotalDiscount);
            $(e.currentTarget).focus();
            return;
        }
        /*var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
         var total = purchase.subTotal * (1 - discount / 100);
         if (baseCurrencyId == "KHR") {
         total = roundRielCurrency(total);
         }
         var set = {};
         set.discount = discount;
         set.total = total;
         Meteor.call('updatePurchase', purchaseId, set, function (er, re) {
         if (er) {
         alertify.error(er.message);
         }
         });*/
        Meteor.call('updatePurchaseTotalByDiscount', purchaseId, discount, function (er, re) {
            if (er) {
                alertify.error(er.message);
            }
        });
        /*   Pos.Collection.Purchases.update($('#purchase-id').val(),
         {
         $set: {
         discount: discount,
         total: total,
         updatedAt: new Date()
         }
         });
         */
    },
    'click #save-without-pay': function () {
        var purchaseId = $('#purchase-id').val();
        if (purchaseId == "") return;
        var branchId = Session.get('currentBranch');
        Meteor.call('purchaseManageStock', purchaseId, branchId, function (er, re) {
            if (er) {
                alertify(er.message);
            }
            else {
                var purchaseObj = {};
                purchaseObj.status = 'Owed';
                Meteor.call('directUpdatePurchase', purchaseId, purchaseObj);
                alertify.success('Purchase is saved successfully');
                FlowRouter.go('pos.purchase');
            }
        });

    },
    'click #btn-pay': function () {
        if ($('#purchase-id').val() == "") {
            return;
        }
        $('#payment').modal('show');
        clearDataFormPayment();
    },
    'click #cancel-purchase': function () {
        var purchaseId = $('#purchase-id').val();
        if (purchaseId == "") {
            return;
        }
        alertify.confirm("Are you sure to cancel this purchase?")
            .set({
                onok: function (closeEvent) {
                    Meteor.call('cancelPurchase', purchaseId);
                    alertify.success('Purchase is cancelled.');
                    FlowRouter.go('pos.purchase');
                    preparePurchaseForm();
                },
                title: "Cancel Purchase."
            });
    },
    'click #suspend': function () {
        FlowRouter.go('pos.purchase');
        preparePurchaseForm();

    },
    'click #default-price,#default-quantity,#default-discount': function (e) {
        $(e.currentTarget).val('');
    },
    'change #default-price': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var value = parseFloat($(e.currentTarget).val() == "" ? 0 : $(e.currentTarget).val());
        if (!numericReg.test(val) || value <= 0) {
            $(e.currentTarget).val('');
            $(e.currentTarget).focus();
            return;
        }
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
    'keypress #default-quantity,.quantity,.pay-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
        //if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        //    return false;
        //}
        //return true;
    },
    'keypress #default-price,#default-discount,.price,.discount,#total_discount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'change .price': function (e) {
        var val = $(e.currentTarget).val();
        var self = this;
        var firstPrice = self.price;
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var price = parseFloat(val == "" ? 0 : val);
        if (!numericReg.test(val) || price <= 0) {
            $(e.currentTarget).val(firstPrice);
            $(e.currentTarget).focus();
            return;
        }
        var pdId = self._id;
        Meteor.call('findOneRecord', 'Pos.Collection.Products', {_id: self.productId}, {}, function (error, product) {
            if (product) {
                debugger;
                var wholesalePrice = product.wholesalePrice;
                var retailPrice = product.retailPrice;
                var set = {};
                set.price = price;
                set.amount = (price * self.quantity) * (1 - self.discount / 100);
                if (price > wholesalePrice) {
                    alertify.confirm("Are you sure? The price of this product is higher than the Wholesale Price,(" + wholesalePrice + ").")
                        .set({
                            onok: function (closeEvent) {
                                Meteor.call('updatePurchaseDetails', pdId, set);
                            },
                            title: "Product is out of stock.",
                            oncancel: function () {
                                $(e.currentTarget).val(firstPrice);
                                $('#product-id').val('');
                                $('#product-barcode').val('');
                                $('#product-barcode').focus();
                                return;
                            }
                        });
                }
                else if (price > retailPrice) {
                    alertify.confirm("Are you sure? The price of this product is higher than the Retail Price,(" + retailPrice + ").")
                        .set({
                            onok: function (closeEvent) {
                                Meteor.call('updatePurchaseDetails', pdId, set);
                            },
                            title: "Product is out of stock.",
                            oncancel: function () {
                                $(e.currentTarget).val(firstPrice);
                                $('#product-id').val('');
                                $('#product-barcode').val('');
                                $('#product-barcode').focus();
                                return;
                            }
                        });
                }
                else {
                    Meteor.call('updatePurchaseDetails', pdId, set);
                }
            }
        });
        //var product = Pos.Collection.Products.findOne(this.productId);
    },
    'change .quantity': function (e) {
        var val = $(e.currentTarget).val();
        var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
        var firstQuantity = this.quantity;
        var quantity = parseInt($(e.currentTarget).val() == "" ? 0 : $(e.currentTarget).val());
        if (!numericReg.test(val) || quantity <= 0) {
            $(e.currentTarget).val(firstQuantity);
            $(e.currentTarget).focus();
            return;
        }
        if (this.imei.count() > quantity) {
            alertify.warning("Quantity can't be less than number of IMEI.");
            $(e.currentTarget).val(firstQuantity);
            return;
        }

        var set = {};
        set.quantity = quantity;
        set.amount = (this.price * quantity) * (1 - this.discount / 100);
        Meteor.call('updatePurchaseDetails', this._id, set);
        // updatePurchaseSubTotal(FlowRouter.getParam('purchaseId'));
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
        Meteor.call('updatePurchaseDetails', this._id, set);
        //updatePurchaseSubTotal(FlowRouter.getParam('purchaseId'));
    },
    /* 'change #supplier-id': function () {
     var purchaseId = $('#purchase-id').val();
     if (purchaseId == "") {
     return;
     }
     var set = {};
     set.supplierId = $('#supplier-id').val();
     Meteor.call('updatePurchase', FlowRouter.getParam('purchaseId'), set);
     $('#product-barcode').focus();
     },
     'change #staff-id': function () {
     var purchaseId = $('#purchase-id').val();
     if (purchaseId == "") {
     return;
     }
     var set = {};
     set.staffId = $('#staff-id').val();
     Meteor.call('updatePurchase', FlowRouter.getParam('purchaseId'), set);
     $('#product-barcode').focus();
     },*/

    'click .btn-remove': function () {
        Pos.Collection.PurchaseDetails.remove(this._id);
        var sd = Pos.Collection.PurchaseDetails.find({purchaseId: FlowRouter.getParam('purchaseId')});
        if (sd.count() == 0) {
            Pos.Collection.Purchases.remove(FlowRouter.getParam('purchaseId'));
            FlowRouter.go('pos.purchase');
            preparePurchaseForm();
        }
        /*else {
         updatePurchaseSubTotal(FlowRouter.getParam('purchaseId'));
         }*/
    },
    'click .staffInsertAddon': function () {
        alertify.userStaff(fa('plus', 'Add New Staff'), renderTemplate(Template.pos_userStaffInsert));
        // .maximize();
    },
    'click .supplierInsertAddon': function () {
        alertify.supplier(fa('plus', 'Add New Supplier'), renderTemplate(Template.pos_supplierInsert));
        // .maximize();
    },
    'change #product-id': function () {
        var id = $('#product-id').val();
        var purchaseId = $('#purchase-id').val();
        if (id == "") {
            return;
        }
        var branchId = Session.get('currentBranch');
        var data = getValidatedValues('id', id, branchId, purchaseId);
        if (data.valid) {
            addOrUpdateProducts(branchId, purchaseId, data.product, data.purchaseObj);
        } else {
            alertify.warning(data.message);
            $('#product-id').val('');
            $('#product-barcode').val('');
            $('#product-barcode').focus();
            return;
        }
        /* var product = Pos.Collection.Products.findOne(id);
         if (product != null) {
         var purchaseId = $('#purchase-id').val();
         if (product.purchasePrice > product.wholesalePrice) {
         alertify.confirm("Are you sure? The last purchase price higher than the wholesale price? You should update wholesale price?")
         .set({
         onok: function (closeEvent) {
         addOrUpdateProducts(purchaseId, product);
         },
         title: "Product Price.",
         oncancel: function () {
         $('#product-id').val('');
         $('#product-barcode').val('');
         $('#product-barcode').focus();
         return;
         }
         });
         }
         else if (product.purchasePrice > product.wholesalePrice) {
         alertify.confirm("The last purchase price higher than the retail price? You should update retail price?")
         .set({
         onok: function (closeEvent) {
         addOrUpdateProducts(purchaseId, product);
         },
         title: "Product is out of stock.",
         oncancel: function () {
         $('#product-id').val('');
         $('#product-barcode').val('');
         $('#product-barcode').focus();
         return;
         }
         });
         } else {
         addOrUpdateProducts(purchaseId, product);
         }
         } else {
         alertify.error("Can't find Product by this Product");
         $('#product-id').val('');
         $('#product-barcode').val('');
         $('#product-barcode').focus();
         }*/
    },
    'keyup #product-barcode': function (e) {
        var charCode = e.which;
        if (e.which == 13) {
            var barcode = $('#product-barcode').val();
            Meteor.call('findOneRecord', 'Pos.Collection.Products', {barcode: barcode}, {}, function (error, product) {
                if (product) {
                    if (product.productType == "Stock") {
                        var purchaseId = $('#purchase-id').val();
                        var branchId = Session.get('currentBranch');
                        var data = getValidatedValues();
                        if (data.valid) {
                            var defaultPrice = $('#default-price').val() == "" ? product.purchasePrice : parseFloat($('#default-price').val());
                            product.defaultPrice = defaultPrice;
                            addOrUpdateProducts(branchId, purchaseId, product, data.purchaseObj);
                            var defaultPrice = $('#default-price').val() == "" ? product.purchasePrice : parseFloat($('#default-price').val());
                            product.defaultPrice = defaultPrice;
                            if (defaultPrice >= product.wholesalePrice) {
                                alertify.alert('Are you sure to purchase this purchase? ' +
                                        'The price should be lower than wholesale price "' + product.wholesalePrice + '" of this product.')
                                    .set({
                                        title: "Price should be changed."
                                    });
                            }
                            else if (defaultPrice >= product.wholesalePrice) {
                                alertify.alert('Are you sure to purchase this purchase? ' +
                                        'The price should be lower than retail price "' + product.retailPrice + '" of this product.')
                                    .set({
                                        title: "Price should be changed."
                                    });
                            }
                        } else {
                            alertify.warning(data.message);
                            $('#product-id').val('');
                            $('#product-barcode').val('');
                            $('#product-barcode').focus();
                            return;
                        }
                    }
                    else {
                        alertify.warning('This Product is non-stock type.');
                    }
                } else {
                    alertify.warning("Cant't find this product.");
                }
            });
        }
    }
});

function addOrUpdateProducts(branchId, purchaseId, product, purchaseObj) {
    var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
    var defaultDiscount = $('#default-discount').val() == "" ? 0 : parseFloat($('#default-discount').val());
    debugger;
    if (purchaseId == '') {
        // var exchange=parseFloat($('#last-exchange-rate').text());
        var totalDiscount = $('#total_discount').val() == "" ? 0 : parseFloat($('#total_discount').val());
        // var purchaseObj = {};
        //purchaseObj._id = newId;
        //purchaseObj.supplierId = supplierId;
        //purchaseObj.staffId = staffId;
        purchaseObj.status = "Unsaved";
        purchaseObj.subTotal = 0;
        purchaseObj.discount = totalDiscount;
        purchaseObj.total = 0;
        purchaseObj.branchId = branchId;
        purchaseObj.owedAmount = 0;
        //purchaseObj.exchangeRateId = exchangeRateId;
        //purchaseObj.purchaseDate = moment(purchaseDate).toDate();
        //purchaseObj.transactionType = transactionType;
        var purchaseDetailObj = {};
        purchaseDetailObj.productId = product._id;
        purchaseDetailObj.quantity = defaultQuantity;
        purchaseDetailObj.discount = defaultDiscount;
        purchaseDetailObj.price = product.defaultPrice;
        purchaseDetailObj.imei = [];
        purchaseDetailObj.amount = (purchaseDetailObj.price * defaultQuantity) * (1 - defaultDiscount / 100);
        purchaseDetailObj.branchId = branchId;
        purchaseDetailObj.locationId = purchaseObj.locationId;
        purchaseDetailObj.status = "Unsaved";
        Meteor.call('insertPurchaseAndPurchaseDetail',
            purchaseObj,
            purchaseDetailObj,
            function (error, purchaseId) {
                if (purchaseId) {
                    $('#product-barcode').val('');
                    $('#product-barcode').focus();
                    $('#product-id').select2('val', '');
                    FlowRouter.go('pos.purchase', {purchaseId: purchaseId});
                    $('#product-barcode').focus();
                } else {
                    alertify.error(error.message);
                }
            });
    } else {
        var purchaseDetail = Pos.Collection.PurchaseDetails.findOne({
            productId: product._id,
            purchaseId: purchaseId,
            locationId: purchaseObj.locationId
        });
        if (purchaseDetail == null) {
            var purchaseDetailObj = {};
            purchaseDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.PurchaseDetails, purchaseId, 3);
            purchaseDetailObj.purchaseId = purchaseId;
            purchaseDetailObj.productId = product._id;
            purchaseDetailObj.quantity = defaultQuantity;
            purchaseDetailObj.discount = defaultDiscount;
            purchaseDetailObj.price = product.defaultPrice;
            purchaseDetailObj.imei = [];
            purchaseDetailObj.amount = (purchaseDetailObj.price * defaultQuantity) * (1 - defaultDiscount / 100);
            purchaseDetailObj.branchId = branchId;
            purchaseDetailObj.locationId = purchaseObj.locationId;
            purchaseDetailObj.status = "Unsaved";
            Meteor.call('insertPurchaseDetails', purchaseDetailObj, function (error, result) {
                if (error) alertify.error(error.message);
            });
        } else {
            var purchaseDetailSetObj = {};
            purchaseDetailSetObj.discount = defaultDiscount;
            purchaseDetailSetObj.quantity = purchaseDetail.quantity + defaultQuantity;
            purchaseDetailSetObj.amount = (purchaseDetail.price * purchaseDetailSetObj.quantity) * (1 - defaultDiscount / 100);
            Meteor.call('updatePurchaseDetails', purchaseDetail._id, purchaseDetailSetObj, function (error, result) {
                if (error) alertify.error(error.message);
            });
        }

        $('#product-barcode').val('');
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        //updatePurchaseSubTotal(purchaseId);
    }
}
updatePurchaseSubTotal = function (purchaseId) {
    var discount = Pos.Collection.Purchases.findOne(purchaseId).discount;
    var purchaseSubTotal = 0;
    var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
    purchaseDetails.forEach(function (purchaseDetail) {
        purchaseSubTotal += parseFloat(purchaseDetail.amount);
    });
    var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;

    var total = purchaseSubTotal * (1 - discount / 100);
    if (baseCurrencyId == "KHR") {
        total = roundRielCurrency(total);
    }
    var purchaseSetObj = {};
    purchaseSetObj.subTotal = purchaseSubTotal;
    purchaseSetObj.total = total;
    Meteor.call('updatePurchase', purchaseId, purchaseSetObj);
};
function clearDataFormPayment() {
    $('.pay-amount').val('');
    $('.return-amount').val('');
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
function pay(purchaseId) {
    var branchId = Session.get('currentBranch');
    var obj = {};
    obj.payments = [];
    var totalPay = 0;
    $('#payment-list tr').each(function () {
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
    obj.purchaseId = purchaseId;
    //obj.status = "firstPay";
    obj.payAmount = numeral().unformat(numeral(totalPay).format('0,0.00'));
    obj.dueAmount = parseFloat($('#due-grand-total').text().trim());
    obj.balanceAmount = numeral().unformat(numeral(obj.dueAmount - obj.payAmount).format('0,0.00'));
    //obj.balanceAmount = numeral().unformat($('#' + baseCurrencyId).val());
    obj.status = obj.balanceAmount >= 0 ? "Paid" : "Owed";
    obj.branchId = branchId;
    Meteor.call('insertPurchasePayment', obj);
    Meteor.call('purchaseManageStock', purchaseId, branchId, function (er, re) {
        if (er) alertify(er.message);
    });

    /*var purchaseDetails = Pos.Collection.PurchaseDetails.find({purchaseId: purchaseId});
     var prefix = branchId + "-";
     purchaseDetails.forEach(function (sd) {
     // var product=Pos.Collection.Products.findOne(sd.productId);
     var productSet = {};
     productSet.purchasePrice = sd.price;
     Meteor.call('updateProduct', sd.productId, productSet);
     var stock = Pos.Collection.Stocks.findOne({productId: sd.productId, branchId: branchId});
     if (stock == null) {
     var obj = {};
     obj._id = idGenerator.genWithPrefix(Pos.Collection.Stocks, prefix, 6);
     obj.productId = sd.productId;
     obj.branchId = branchId;
     obj.quantity = sd.quantity;
     Meteor.call('insertStock', obj);
     } else {
     var set = {};
     set.quantity = stock.quantity + sd.quantity;
     Meteor.call('updateStock', stock._id, set);
     }
     });
     var purchaseUpdateObj = {};
     purchaseUpdateObj.status = "Paid";
     Meteor.call('updatePurchase', purchaseId, purchaseUpdateObj);
     */
}
function checkPurchaseIsUpdate() {
    var purchaseId = $('#purchase-id').val();
    if (purchaseId == "") {
        Session.set('purchaseHasUpdate', false);
        return;
    }
    var purchase = Pos.Collection.Purchases.findOne(purchaseId);
    var supplier = $('#supplier-id').val();
    var staff = $('#staff-id').val();
    var date = $('#input-purchase-date').val();
    var transactionType = $('#transaction-type').val();
    var locationId = $('#location-id').val();
    var purchaseDate = moment(purchase.purchaseDate).format('MM/DD/YYYY hh:mm:ss A');
    var hasUpdate = false;
    var description = $('#description').val();
    if (date != purchaseDate || supplier != purchase.supplierId ||
        staff != purchase.staffId || transactionType != purchase.transactionType ||
        description != purchase.description || locationId != purchase.locationId) {
        hasUpdate = true;
    }
    Session.set('purchaseHasUpdate', hasUpdate);
}
function preparePurchaseForm() {
    setTimeout(function () {
        Session.set('purchaseHasUpdate', false);
        $('#input-purchase-date').val('');
        $('#location-id').select2();
        $('#staff-id').select2();
        $('#supplier-id').select2();
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        $('#transaction-type').select2('val', 'Purchase');
    }, 300);
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
function getValidatedValues() {
    var data = {};
    var id = Cpanel.Collection.Setting.findOne().baseCurrency;
    var exchangeRate = Pos.Collection.ExchangeRates.findOne({
        base: id,
        branchId: Session.get('currentBranch')
    }, {sort: {_id: -1, createdAt: -1}});
    if (exchangeRate == null) {
        data.valid = false;
        data.message = "Please input exchange rate for this branch.";
        return data;
    }
    var purchaseDate = $('#input-purchase-date').val();
    if (purchaseDate == '') {
        data.valid = false;
        data.message = "Please input purchaseDate";
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
    var supplierId = $('#supplier-id').val();
    if (supplierId == "" || supplierId == null) {
        data.valid = false;
        data.message = "Please select supplier name.";
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
    data.purchaseObj = {
        purchaseDate: moment(purchaseDate, 'MM/DD/YYYY hh:mm:ss a').toDate(),
        staffId: staffId,
        supplierId: supplierId,
        exchangeRateId: exchangeRate._id,
        description: $('#description').val(),
        transactionType: transactionType,
        locationId: locationId
    };
    return data;
}
