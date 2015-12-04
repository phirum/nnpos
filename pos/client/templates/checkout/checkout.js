Session.setDefault('isRetail', true);
Session.setDefault('hasUpdate', false);
Template.pos_checkout.onRendered(function () {
    createNewAlertify(["customer", "userStaff"]);
    Session.set('isRetail', true);
    $('#sale-date').datetimepicker({
        format: "MM/DD/YYYY hh:mm:ss A"
    });
    //$('#product-id').select2();
    $('#product-barcode').focus();
    setTimeout(function () {
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
            return (sd == null || sd.imei == null) ? [] : sd.imei;
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
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.findOne(id);
    },
    exchangeRates: function () {
        var sale = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        if (sale != null) {
            return Pos.Collection.ExchangeRates.findOne(sale.exchangeRateId);
        } else {
            var id = Cpanel.Collection.Setting.findOne().baseCurrency;
            return Pos.Collection.ExchangeRates.findOne({
                base: id,
                branchId: Session.get('currentBranch')
            }, {sort: {_id: -1, createdAt: -1}});
        }

    },
    compareTwoValue: function (val1, val2) {
        return val1 == val2;
    },
    sale: function () {
        var s = Pos.Collection.Sales.findOne(FlowRouter.getParam('saleId'));
        s.saleDate = moment(s.saleDate).format("DD-MM-YY, hh:mm:ss a");
        s.subTotalFormatted = numeral(s.subTotal).format('0,0.00');
        s.totalFormatted = numeral(s.total).format('0,0.00');
        return s;
    },
    saleDetails: function () {
        var saleDetailItems = [];
        var sD = Pos.Collection.SaleDetails.find({saleId: FlowRouter.getParam('saleId')});
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
    customers: function () {
        return Pos.Collection.Customers.find({
            branchId: Session.get('currentBranch')
        });
    },
    products: function () {
        return Pos.Collection.Products.find({status: "enable"});
        /*.map(function (p) {
         var unit = Pos.Collection.Units.findOne(p.unitId).name;
         p.name = p.name + "(" + unit + ")";
         return p;
         });*/
    },
    sales: function () {
        var id = FlowRouter.getParam('saleId');
        if (id != null || id != "") {
            return Pos.Collection.Sales.find({
                _id: {$ne: id},
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });
        } else {
            return Pos.Collection.Sales.find({branchId: Session.get('currentBranch'), status: "Unsaved"})
        }
    }
});
Template.pos_checkout.events({
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
        var imei = this;
        var saleDetail = Pos.Collection.SaleDetails.findOne(saleDetailId);
        var obj = {};
        obj.imei = subtractArray(saleDetail.imei, [imei]);
        Meteor.call('updateSaleDetails', saleDetailId, obj);

    },
    'keyup #input-imei': function (e) {
        if (e.which == 13) {
            var branchId = Session.get('currentBranch');
            var imei = $(e.currentTarget).val().trim();
            if (imei == "") {
                return;
            }
            var saleDetailId = Session.get('saleDetailId');
            var saleDetail = Pos.Collection.SaleDetails.findOne(saleDetailId);
            var inventoryType = 1;
            var inventory;
            if (inventoryType == 1) {
                inventory = Pos.Collection.FIFOInventory.findOne({
                    branchId: branchId,
                    productId: saleDetail.productId
                    //price: pd.price
                }, {sort: {createdAt: -1}});
            }
            if (inventory != null) {
                if (inventory.imei == null || inventory.imei.indexOf(imei) == -1) {
                    alertify.warning("Can't find this IMEI.");
                    return;
                }
            } else {
                alertify.error("Product is out of stock.");
                return;
            }
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
        $('#customer-id').select2('val', sale.customerId);
        $('#staff-id').select2('val', sale.staffId);
        $('#input-sale-date').val(moment(sale.saleDate).format('MM/DD/YYYY hh:mm:ss A'));
    },
    'click #btn-update-sale-data': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var branchId = Session.get('currentBranch');
        var customer = $('#customer-id').val();
        var staff = $('#staff-id').val();
        var date = $('#input-sale-date').val();
        var transactionType = $('#transaction-type').val();
        var description = $('#description').val();
        var voucher = $('#voucher').val();
        var sale = Pos.Collection.Sales.findOne({branchId: branchId, voucher: voucher, _id: {$ne: saleId}});
        if (sale != null) {
            alertify.warning('Voucher already exists. Please input other one.');
            return;
        }
        var set = {};
        set.customerId = customer;
        set.staffId = staff;
        set.saleDate = moment(date).toDate();
        set.transactionType = transactionType;
        set.description = description;
        set.voucher = voucher;
        Meteor.call('updateSale', saleId, set, function (error, result) {
            if (error)alertify.error(error.message);
        });
        Session.set('hasUpdate', false);
        $('#product-barcode').focus();

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
            var set = {};
            set.isRetail = true;
            Meteor.call('updateSale', saleId, set);
            Pos.Collection.SaleDetails.find({saleId: saleId}).forEach(function (sd) {
                if (!sd.isPromotion) {
                    var retailPrice = Pos.Collection.Products.findOne(sd.productId).retailPrice;
                    var set = {};
                    set.price = retailPrice;
                    set.amount = (set.price * sd.quantity) * (1 - sd.discount / 100);
                    Meteor.call('updateSaleDetails', sd._id, set);
                }
            });
            // updateSaleSubTotal(saleId);
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
            var set = {};
            set.isRetail = false;
            Meteor.call('updateSale', saleId, set);
            Pos.Collection.SaleDetails.find({saleId: saleId}).forEach(function (sd) {
                if (!sd.isPromotion) {
                    var wholesalePrice = Pos.Collection.Products.findOne(sd.productId).wholesalePrice;
                    var set = {};
                    set.price = wholesalePrice;
                    set.amount = (set.price * sd.quantity) * (1 - sd.discount / 100);
                    Meteor.call('updateSaleDetails', sd._id, set);
                }
            });
            // updateSaleSubTotal(saleId);
        }
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
        $('#payment').modal('hide');
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
        FlowRouter.go('pos.checkout');
        prepareForm();
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
        $('#payment').modal('hide');
        FlowRouter.go('pos.checkout');
        prepareForm();
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
        debugger;
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
        var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
        var discountPercentage = 100 * discount / sale.subTotal;
        var total = sale.subTotal - discount;
        if (baseCurrencyId == "KHR") {
            total = roundRielCurrency(total);
        }
        var set = {};
        set.discount = discountPercentage;
        set.discountAmount = discount;
        set.total = total;

        Meteor.call('directUpdateSale', saleId, set);
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
        var set = {};
        set.discount = discount;
        set.discountAmount = discountAmount;
        set.total = total;

        Meteor.call('directUpdateSale', saleId, set);
    },
    'click #save-without-pay': function () {
        var saleId = $('#sale-id').val();
        if (saleId == "") return;
        var branchId = Session.get('currentBranch');
        Meteor.call('saleManageStock', saleId, branchId, function (er, re) {
            if (er) {
                alertify(er.message);
            }
            else {
                var saleObj = {};
                saleObj.status = 'Owed';
                Meteor.call('updateSale', saleId, saleObj);
                alertify.success('Sale is saved successfully');
                FlowRouter.go('pos.checkout');
            }
        });
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
    'keypress #default-quantity,.quantity,.pay-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'keypress #default-discount,.price,.discount,#total_discount': function (evt) {
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
        Meteor.call('updateSaleDetails', this._id, set);
        // updateSaleSubTotal(saleId);
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

        var saleId = $('#sale-id').val();
        var branchId = Session.get('currentBranch');
        var sdId = this._id;
        var locationId = $('#location-id').val();
        var set = {};
        set.quantity = quantity;
        set.amount = (this.price * quantity) * (1 - this.discount / 100);

        var data = checkoutStock(this.productId, quantity, branchId, saleId, locationId);
        if (data.valid) {
            Meteor.call('updateSaleDetails', sdId, set);
        } else {
            alertify.warning(data.message);
            $(e.currentTarget).val(firstQuantity);
        }
        // updateSaleSubTotal(FlowRouter.getParam('saleId'));
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
        Meteor.call('updateSaleDetails', this._id, set);
        // updateSaleSubTotal(FlowRouter.getParam('saleId'));
    },
    'click .btn-remove': function () {
        Pos.Collection.SaleDetails.remove(this._id);
        var sd = Pos.Collection.SaleDetails.find({saleId: FlowRouter.getParam('saleId'), isPromotion: {$ne: true}});
        if (sd.count() == 0) {
            Pos.Collection.Sales.remove(FlowRouter.getParam('saleId'));
            FlowRouter.go('pos.checkout');
            prepareForm();
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
    'change #product-id': function () {
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
    },
    'keyup #product-barcode': function (e) {
        var charCode = e.which;
        if (e.which == 13) {
            var barcode = $('#product-barcode').val();
            var isRetail = Session.get('isRetail');
            var saleId = $('#sale-id').val();
            var branchId = Session.get('currentBranch');
            var data = getValidatedValues('barcode', barcode, branchId, saleId);
            if (data.valid) {
                addOrUpdateProducts(branchId, saleId, isRetail, data.product, data.saleObj);
            } else {
                alertify.warning(data.message);
            }
            $('#product-id').select2('val', '');
            $('#product-barcode').val('');
            $('#product-barcode').focus();
        }
    }
});
function checkoutStock(productId, newQty, branchId, saleId, locationId) {
    var data = {};
    var product = Pos.Collection.Products.findOne(productId);
    if (product.productType == "Stock") {
        //---Open Inventory type block "FIFO Inventory"---
        var inventory = Pos.Collection.FIFOInventory.findOne({
            branchId: branchId,
            productId: productId,
            locationId: locationId
            //price: pd.price
        }, {sort: {createdAt: -1}});

        if (inventory != null) {
            var remainQuantity = inventory.remainQty - newQty;
            if (remainQuantity < 0) {
                data.valid = false;
                data.message = 'Product is out of stock. Quantity in stock is "' + inventory.remainQty + '".';
                return data;
            }
            var unSavedSaleId = Pos.Collection.Sales.find({
                status: "Unsaved",
                branchId: Session.get('currentBranch'),
                _id: {$ne: saleId}
            }).map(function (s) {
                return s._id;
            });
            var otherSaleDetails = Pos.Collection.SaleDetails.find({
                saleId: {$in: unSavedSaleId},
                productId: product._id
            });
            var otherQuantity = 0;
            if (otherSaleDetails != null) {
                otherSaleDetails.forEach(function (sd) {
                    otherQuantity += sd.quantity;
                });
            }
            remainQuantity = remainQuantity - otherQuantity;
            if (remainQuantity < 0) {
                data.valid = false;
                data.message = 'Product is out of stock. Quantity in stock is "' +
                    inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity + '".';
                return data;
            }
        } else {
            data.valid = false;
            data.message = "Don't have product in stock.";
            return data;
        }
    }
    data.valid = true;
    data.message = "Product is OK.";
    return data;

}
function getValidatedValues(fieldName, val, branchId, saleId) {
    var data = {};
    var id = Cpanel.Collection.Setting.findOne().baseCurrency;
    var exchangeRate = Pos.Collection.ExchangeRates.findOne({
        base: id,
        branchId: branchId
    }, {sort: {_id: -1, createdAt: -1}});
    if (exchangeRate == null) {
        data.valid = false;
        data.message = "Please input exchange rate for this branch.";
        return data;
    }
    var voucher = $('#voucher').val();
    if (voucher == '') {
        data.valid = false;
        data.message = "Please input voucher.";
        return data;
    } else {
        if (saleId == '') {
            var sale = Pos.Collection.Sales.findOne({voucher: voucher, branchId: branchId});
            if (sale != null) {
                data.valid = false;
                data.message = 'Voucher already exists. Please input the other one.';
                return data;
            }
        }
    }
    var saleDate = $('#input-sale-date').val();
    if (saleDate == '') {
        data.valid = false;
        data.message = "Please input saleDate";
        return data;
    }
    var locationId = $('#location-id').val();
    if (locationId == '') {
        data.valid = false;
        data.message = "Please select location name.";
        return data;
    }

    var staffId = $('#staff-id').val();
    if (staffId == '') {
        data.valid = false;
        data.message = "Please select staff name.";
        return data;
    }

    var customerId = $('#customer-id').val();
    if (customerId == "") {
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

    var product;
    if (fieldName == 'id') {
        product = Pos.Collection.Products.findOne(val);
    } else {
        product = Pos.Collection.Products.findOne({barcode: val, status: "enable"});
    }
    if (product != null) {
        var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
        if (product.productType == "Stock") {
            var sd = Pos.Collection.SaleDetails.findOne({
                productId: product._id,
                saleId: saleId,
                locationId: locationId
            });
            if (sd != null) {
                defaultQuantity = defaultQuantity + sd.quantity;
            }

            //---Open Inventory type block "FIFO Inventory"---
            var inventory = Pos.Collection.FIFOInventory.findOne({
                branchId: branchId,
                productId: product._id,
                locationId: locationId
                //price: pd.price
            }, {sort: {createdAt: -1}});
            //---End Inventory type block "FIFO Inventory"---
            if (inventory != null) {
                var remainQuantity = inventory.remainQty - defaultQuantity;
                if (remainQuantity < 0) {
                    data.valid = false;
                    data.message = 'Product is out of stock. Quantity in stock is "' + inventory.remainQty + '".';
                    return data;
                }
                var unSavedSaleId = Pos.Collection.Sales.find({
                    status: "Unsaved",
                    branchId: Session.get('currentBranch'),
                    _id: {$ne: saleId}
                }).map(function (s) {
                    return s._id;
                });
                var otherSaleDetails = Pos.Collection.SaleDetails.find({
                    saleId: {$in: unSavedSaleId},
                    productId: product._id,
                    locationId: locationId
                });
                var otherQuantity = 0;
                if (otherSaleDetails != null) {
                    otherSaleDetails.forEach(function (sd) {
                        otherQuantity += sd.quantity;
                    });
                }
                remainQuantity = remainQuantity - otherQuantity;
                if (remainQuantity < 0) {
                    data.valid = false;
                    data.message = 'Product is out of stock. Quantity in stock is "' +
                        inventory.remainQty + '". And quantity on sale of other seller is "' + otherQuantity + '".';
                    return data;
                }
            } else {
                data.valid = false;
                data.message = "Don't have product in stock.";
                return data;
            }

        }

    } else {
        data.valid = false;
        data.message = "Can't find this Product";
        return data;
    }
    data.message = "Add product to list is successfully.";
    data.valid = true;
    data.saleObj = {
        saleDate: moment(saleDate).toDate(),
        staffId: staffId,
        customerId: customerId,
        exchangeRateId: exchangeRate._id,
        description: $('#description').val(),
        transactionType: transactionType,
        voucher: voucher,
        locationId: locationId
    };
    data.product = product;
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
        Meteor.call('insertSaleAndSaleDetail', saleObj, saleDetailObj, function (e, r) {
            $('#product-barcode').focus();
            if (e) {
                alertify.error("Can't make a sale.");
            } else {
                // updateSaleSubTotal(newId);
                $('#product-barcode').val('');
                $('#product-barcode').focus();
                $('#product-id').select2('val', '');
                FlowRouter.go('pos.checkout', {saleId: r});
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
        Meteor.call('insertSaleAndSaleDetail', saleObj, saleDetailObj, function (e, r) {
            $('#product-barcode').focus();
            if (e) {
                alertify.error("Can't make a sale.");
            } else {
                // updateSaleSubTotal(newId);
                $('#product-barcode').val('');
                $('#product-barcode').focus();
                $('#product-id').select2('val', '');
                FlowRouter.go('pos.checkout', {saleId: r});
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
function pay(saleId) {
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
    /*if(totalPay==0){
     return;
     }*/
    var baseCurrencyId = Cpanel.Collection.Setting.findOne().baseCurrency;
    obj._id = idGenerator.genWithPrefix(Pos.Collection.Payments, saleId, 3);
    obj.paymentDate = new Date();
    obj.saleId = saleId;

    obj.payAmount = totalPay;
    obj.payAmount = numeral().unformat(numeral(totalPay).format('0,0.00'));
    obj.dueAmount = parseFloat($('#due-grand-total').text().trim());
    obj.balanceAmount = numeral().unformat(numeral(obj.dueAmount - obj.payAmount).format('0,0.00'));
    //obj.balanceAmount = numeral().unformat($('#' + baseCurrencyId).val());
    obj.status = obj.balanceAmount >= 0 ? "Paid" : "Owed";
    obj.branchId = branchId;
    Meteor.call('insertPayment', obj);

    Meteor.call('saleManageStock', saleId, branchId, function (er, re) {
        if (er) alertify(er.message);
    });
    /*   var saleDetails = Pos.Collection.SaleDetails.find({saleId: saleId});
     var prefix = branchId + "-";
     saleDetails.forEach(function (sd) {
     var product = Pos.Collection.Products.findOne(sd.productId);
     if (product.productType == "Stock") {
     var stock = Pos.Collection.Stocks.findOne({productId: sd.productId, branchId: branchId});
     if (stock == null) {
     var obj = {};
     obj._id = idGenerator.genWithPrefix(Pos.Collection.Stocks, prefix, 6);
     obj.productId = sd.productId;
     obj.branchId = branchId;
     obj.quantity = 0 - sd.quantity;
     Meteor.call('insertStock', obj);
     } else {
     var set = {};
     set.quantity = stock.quantity - sd.quantity;
     Meteor.call('updateStock', stock._id, set);
     }
     }
     });*/
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
    if (date != saleDate || customer != sale.customerId ||
        staff != sale.staffId || transactionType != sale.transactionType ||
        description != sale.description || voucher != sale.voucher) {
        hasUpdate = true;
    }
    Session.set('hasUpdate', hasUpdate);
}
function prepareForm() {
    setTimeout(function () {
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
