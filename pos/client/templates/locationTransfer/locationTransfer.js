Session.setDefault('hasLocationTransferUpdate', false);
Session.setDefault('fromLocationId', '');
Template.pos_locationTransfer.onRendered(function () {
    createNewAlertify(["location", "userStaff"]);
    $('#locationTransfer-date').datetimepicker({
        format: "MM/DD/YYYY hh:mm:ss A"
    });
    $('#product-barcode').focus();
    setTimeout(function () {
        $('.select-two').select2();
        var s = Pos.Collection.LocationTransfers.findOne({
            _id: FlowRouter.getParam('locationTransferId'),
            status: "Unsaved",
            branchId: Session.get('currentBranch')
        });
        if (s == null) {
            FlowRouter.go('pos.locationTransfer');
            $('#product-barcode').focus();
        }
    }, 500);
});
Template.pos_locationTransfer.helpers({
    imeis: function () {
        var locationTransferDetailId = Session.get('locationTransferDetailId');
        if (locationTransferDetailId != null) {
            var sd = Pos.Collection.LocationTransferDetails.findOne(locationTransferDetailId);
            return (sd == null || sd.imei == null) ? [] : sd.imei;
        } else {
            return [];
        }
    },
    locations: function () {
        return Pos.Collection.Locations.find({branchId: Session.get('currentBranch')});
    },
    toLocations: function () {
        return Pos.Collection.Locations.find({
            branchId: Session.get('currentBranch'),
            _id: {$ne: Session.get('fromLocationId')}
        });
    },
    hasLocationTransferUpdate: function () {
        var hasLocationTransferUpdate = Session.get('hasLocationTransferUpdate');
        if (hasLocationTransferUpdate != null && hasLocationTransferUpdate != "null") {
            return hasLocationTransferUpdate;
        }
        return false;
    },
    locationTransferDate: function () {
        var locationTransfer = Pos.Collection.LocationTransfers.findOne(FlowRouter.getParam('locationTransferId'));
        if (locationTransfer == null) {
            //return "";
            return moment(TimeSync.serverTime(null)).format('MM/DD/YYYY hh:mm:ss A');
        } else {
            return moment(locationTransfer.locationTransferDate).format('MM/DD/YYYY hh:mm:ss A');
        }
    },
    getFileOfCurrency: function (id, field) {
        var currency = Cpanel.Collection.Currency.findOne(id);
        return currency[field];
    },
    compareTwoValue: function (val1, val2) {
        return val1 == val2;
    },
    locationTransfer: function () {
        // s.locationTransferDate = moment(s.locationTransferDate).format("DD-MM-YY, hh:mm:ss a");
        return Pos.Collection.LocationTransfers.findOne(FlowRouter.getParam('locationTransferId'));
    },
    locationTransferDetails: function () {
        var locationTransferDetailItems = [];
        var sD = Pos.Collection.LocationTransferDetails.find({locationTransferId: FlowRouter.getParam('locationTransferId')});
        var i = 1;
        sD.forEach(function (sd) {
            // var item = _.extend(sd,{});
            /*var product = Pos.Collection.Products.findOne(sd.productId);
             var unit = Pos.Collection.Units.findOne(product.unitId).name;
             sd.productName = product.name + "(" + unit + ")";*/
            //sd.amountFormatted = numeral(sd.amount).format('0,0.00');
            //sd.order = pad(i, 2);
            sd.order = i;
            i++;
            locationTransferDetailItems.push(sd);
        });
        return locationTransferDetailItems;
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
    products: function () {
        return Pos.Collection.Products.find({status: "enable"});
        /*.map(function (p) {
         var unit = Pos.Collection.Units.findOne(p.unitId).name;
         p.name = p.name + "(" + unit + ")";
         return p;
         });*/
    },
    locationTransfers: function () {
        var id = FlowRouter.getParam('locationTransferId');
        if (id != null || id != "") {
            return Pos.Collection.LocationTransfers.find({
                _id: {$ne: id},
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });
        } else {
            return Pos.Collection.LocationTransfers.find({branchId: Session.get('currentBranch'), status: "Unsaved"})
        }
    }
});
Template.pos_locationTransfer.events({
    'keyup #input-imei': function (e) {
        if (e.which == 13) {
            var branchId = Session.get('currentBranch');
            var imei = $(e.currentTarget).val().trim();
            if (imei == "") {
                return;
            }
            var locationTransferDetailId = Session.get('locationTransferDetailId');
            var locationTransferDetail = Pos.Collection.LocationTransferDetails.findOne(locationTransferDetailId);
            var inventoryType = 1;
            var inventory;
            if (inventoryType == 1) {
                inventory = Pos.Collection.FIFOInventory.findOne({
                    branchId: branchId,
                    productId: locationTransferDetail.productId
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
            var imeis = locationTransferDetail.imei == null ? [] : locationTransferDetail.imei;
            if (imeis.indexOf(imei) != -1) {
                alertify.warning('IMEI is already exist.');
                return;
            } else if (locationTransferDetail.imei.count() == locationTransferDetail.quantity) {
                alertify.warning("Number of IMEI can't greater than Quantity.");
                return;
            } else {
                imeis.push(imei);
            }
            obj.imei = imeis;
            Meteor.call('updateLocationTransferDetails', locationTransferDetailId, obj, function (er, re) {
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
        Session.set('locationTransferDetailId', this._id);
        $('#input-imei').val('');
        $('#imei').modal('show');
    },
    'click .btn-remove-imei': function (e) {
        var locationTransferDetailId = Session.get('locationTransferDetailId');
        var thisBtn = $(e.currentTarget);
        // var imei = thisBtn.parents('tr').find('.td-imei').text().trim();
        var imei = this;
        var locationTransferDetail = Pos.Collection.LocationTransferDetails.findOne(locationTransferDetailId);
        var obj = {};
        obj.imei = subtractArray(locationTransferDetail.imei, [imei]);
        Meteor.call('updateLocationTransferDetails', locationTransferDetailId, obj);
    },
    'click .resume': function (e) {
        var locationTransferId = $(e.currentTarget).attr('data-id');
        var locationTransfer = Pos.Collection.LocationTransfers.findOne(locationTransferId);
        Session.set('hasLocationTransferUpdate', false);
        $('#from-location-id').select2('val', locationTransfer.fromLocationId);
        $('#to-location-id').select2('val', locationTransfer.toLocationId);
        $('#staff-id').select2('val', locationTransfer.staffId);
        $('#input-locationTransfer-date').val(moment(locationTransfer.locationTransferDate).format('MM/DD/YYYY hh:mm:ss A'));
    },
    'click #btn-update-locationTransfer-data': function () {
        var locationTransferId = $('#locationTransfer-id').val();
        if (locationTransferId == "") return;
        var toLocationId = $('#to-location-id').val();
        var staff = $('#staff-id').val();
        var date = $('#input-locationTransfer-date').val();

        var set = {};
        set.staffId = staff;
        set.locationTransferDate = moment(date).toDate();
        set.toLocationId = toLocationId;

        Meteor.call('updateLocationTransfer', locationTransferId, set, function (error, result) {
            if (error)alertify.error(error.message);
        });
        Session.set('hasLocationTransferUpdate', false);
        $('#product-barcode').focus();

    },
    'blur #input-locationTransfer-date': function () {
        checkIsUpdate();
    },
    'change #from-location-id': function (e) {
        Session.set('fromLocationId', $(e.currentTarget).val());
        $('#to-location-id').select('val', '');
        checkIsUpdate();
    },
    'change #to-location-id': function () {
        checkIsUpdate();
    },
    'change #staff-id': function () {
        checkIsUpdate();
    },
    'mouseout .la-box,#total_discount,#total_discount_amount': function () {
        $('#product-barcode').focus();
    },
    'click #print-invoice': function () {
        var locationTransferId = $('#locationTransfer-id').val();
        if (locationTransferId == "") return;
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
        prepareForm();
    },
    'click #print-locationTransfer': function () {
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
        var locationTransferId = $('#locationTransfer-id').val();
        pay(locationTransferId);
        $('#payment').modal('hide');
        var url = $('#btn-print').attr('href');
        window.open(url, '_blank');
        FlowRouter.go('pos.locationTransfer');
        prepareForm();
    },
    'click #save-locationTransfer': function () {
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
        var locationTransferId = $('#locationTransfer-id').val();
        pay(locationTransferId);
        $('#payment').modal('hide');
        FlowRouter.go('pos.locationTransfer');
        prepareForm();
    },
    'click #save-without-pay': function () {
        var locationTransferId = $('#locationTransfer-id').val();
        if (locationTransferId == "") return;
        var branchId = Session.get('currentBranch');
        Meteor.call('locationTransferManageStock', locationTransferId, branchId, function (er, re) {
            if (er) {
                alertify(er.message);
            }
            else {
                var locationTransferObj = {};
                locationTransferObj.status = 'Saved';
                Meteor.call('updateLocationTransfer', locationTransferId, locationTransferObj);
                alertify.success('LocationTransfer is saved successfully');
                FlowRouter.go('pos.locationTransfer');
            }
        });
    },
    'click #cancel-locationTransfer': function () {
        var locationTransferId = $('#locationTransfer-id').val();
        if (locationTransferId == "") return;
        alertify.confirm("Are you sure to cancel this order?")
            .set({
                onok: function (closeEvent) {
                    Meteor.call('cancelLocationTransfer', locationTransferId, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success('LocationTransfer is cancelled.');
                        }
                    });
                    FlowRouter.go('pos.locationTransfer');
                    prepareForm();
                },
                title: "Cancel LocationTransfer."
            });
    },
    'click #suspend': function () {
        FlowRouter.go('pos.locationTransfer');
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
    'keypress #default-quantity,.quantity,.pay-amount': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
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

        var locationId = this.fromLocationId;//$('#from-location-id').val();
        var branchId = Session.get('currentBranch');
        var ltdId = this._id;
        var ltId=$('#locationTransfer-id').val();
        var set = {};
        set.quantity = quantity;
        //set.amount = (this.price * quantity) * (1 - this.discount / 100);

        var data = locationTransferStock(this.productId, quantity, branchId, ltId, locationId);
        if (data.valid) {
            Meteor.call('updateLocationTransferDetails', ltdId, set);
        } else {
            alertify.warning(data.message);
            $(e.currentTarget).val(firstQuantity);
        }
        // updateLocationTransferSubTotal(FlowRouter.getParam('locationTransferId'));
    },
    'click .btn-remove': function () {
        Pos.Collection.LocationTransferDetails.remove(this._id);
        var ltd = Pos.Collection.LocationTransferDetails.find({
            locationTransferId: FlowRouter.getParam('locationTransferId'),
            isPromotion: {$ne: true}
        });
        if (ltd.count() == 0) {
            Pos.Collection.LocationTransfers.remove(FlowRouter.getParam('locationTransferId'));
            FlowRouter.go('pos.locationTransfer');
            prepareForm();
        }
        /*else {
         updateLocationTransferSubTotal(FlowRouter.getParam('locationTransferId'));
         }*/
    },
    'click .staffInsertAddon': function () {
        alertify.userStaff(fa('plus', 'Add New Staff'), renderTemplate(Template.pos_userStaffInsert));
        // .maximize();
    },
    'click .locationInsertAddon': function () {
        alertify.location(fa('plus', 'Add New Location'), renderTemplate(Template.pos_locationInsert));
        // .maximize();
    },
    'change #product-id': function () {
        var id = $('#product-id').val();
        if (id == "") return;
        var locationTransferId = $('#locationTransfer-id').val();
        var branchId = Session.get('currentBranch');
        var data = getValidatedValues('id', id, branchId, locationTransferId);
        if (data.valid) {
            addOrUpdateProducts(branchId, locationTransferId, data.product, data.locationTransferObj);
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
            var locationTransferId = $('#locationTransfer-id').val();
            var branchId = Session.get('currentBranch');
            var data = getValidatedValues('barcode', barcode, branchId, locationTransferId);
            if (data.valid) {
                addOrUpdateProducts(branchId, locationTransferId, data.product, data.locationTransferObj);
            } else {
                alertify.warning(data.message);
            }
            $('#product-id').select2('val', '');
            $('#product-barcode').val('');
            $('#product-barcode').focus();
        }
    }
});
function locationTransferStock(productId, newQty, branchId, locationTransferId, locationId) {
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
            debugger;
            var unSavedLocationTransferId = Pos.Collection.LocationTransfers.find({
                status: "Unsaved",
                branchId: Session.get('currentBranch'),
                _id: {$ne: locationTransferId}
            }).map(function (s) {
                return s._id;
            });
            var otherLocationTransferDetails = Pos.Collection.LocationTransferDetails.find({
                locationTransferId: {$in: unSavedLocationTransferId},
                productId: product._id
            });
            var otherQuantity = 0;
            if (otherLocationTransferDetails != null) {
                otherLocationTransferDetails.forEach(function (sd) {
                    otherQuantity += sd.quantity;
                });
            }
            remainQuantity = remainQuantity - otherQuantity;
            if (remainQuantity < 0) {
                data.valid = false;
                data.message = 'Product is out of stock. Quantity in stock is "' +
                    inventory.remainQty + '". And quantity on locationTransfer of other seller is "' + otherQuantity + '".';
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
function getValidatedValues(fieldName, val, branchId, locationTransferId) {
    var data = {};
    var locationTransferDate = $('#input-locationTransfer-date').val();
    if (locationTransferDate == '') {
        data.valid = false;
        data.message = "Please input Location Transfer Date";
        return data;
    }

    var fromLocationId = $('#from-location-id').val();
    if (fromLocationId == "") {
        data.valid = false;
        data.message = "Please select From Location.";
        return data;
    }
    var toLocationId = $('#to-location-id').val();
    if (toLocationId == "") {
        data.valid = false;
        data.message = "Please select To Location.";
        return data;
    }
    var staffId = $('#staff-id').val();
    if (staffId == '') {
        data.valid = false;
        data.message = "Please select staff name.";
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
            var sd = Pos.Collection.LocationTransferDetails.findOne({
                productId: product._id,
                branchId: branchId,
                LocationTransferId: locationTransferId
            });
            if (sd != null) {
                defaultQuantity = defaultQuantity + sd.quantity;
            }
            //---Open Inventory type block "FIFO Inventory"---
            var inventory = Pos.Collection.FIFOInventory.findOne({
                branchId: branchId,
                productId: product._id,
                locationId: fromLocationId
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
                var unSavedLocationTransferId = Pos.Collection.LocationTransfers.find({
                    status: "Unsaved",
                    branchId: Session.get('currentBranch'),
                    _id: {$ne: locationTransferId}
                }).map(function (s) {
                    return s._id;
                });
                var otherLocationTransferDetails = Pos.Collection.LocationTransferDetails.find({
                    locationTransferId: {$in: unSavedLocationTransferId},
                    productId: product._id
                });
                var otherQuantity = 0;
                if (otherLocationTransferDetails != null) {
                    otherLocationTransferDetails.forEach(function (sd) {
                        otherQuantity += sd.quantity;
                    });
                }
                remainQuantity = remainQuantity - otherQuantity;
                if (remainQuantity < 0) {
                    data.valid = false;
                    data.message = 'Product is out of stock. Quantity in stock is "' +
                        inventory.remainQty + '". And quantity on locationTransfer of other seller is "' + otherQuantity + '".';
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
    data.locationTransferObj = {
        locationTransferDate: moment(locationTransferDate).toDate(),
        staffId: staffId,
        fromLocationId: fromLocationId,
        toLocationId: toLocationId
    };
    data.product = product;
    return data;
}
function addOrUpdateProducts(branchId, locationTransferId, product, locationTransferObj) {
    var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
    var defaultDiscount = $('#default-discount').val() == "" ? 0 : parseFloat($('#default-discount').val());
    if (locationTransferId == '') {
        locationTransferObj.status = "Unsaved";
        locationTransferObj.branchId = branchId;
        var locationTransferDetailObj = {};
        locationTransferDetailObj.productId = product._id;
        locationTransferDetailObj.quantity = defaultQuantity;
        locationTransferDetailObj.branchId = branchId;
        locationTransferDetailObj.fromLocationId = locationTransferObj.fromLocationId;
        locationTransferDetailObj.toLocationId = locationTransferObj.toLocationId;
        locationTransferDetailObj.imei = [];
        Meteor.call('insertLocationTransferAndLocationTransferDetail', locationTransferObj, locationTransferDetailObj, function (e, r) {
            $('#product-barcode').focus();
            if (e) {
                alertify.error("Can't make a locationTransfer.");
            } else {
                // updateLocationTransferSubTotal(newId);
                $('#product-barcode').val('');
                $('#product-barcode').focus();
                $('#product-id').select2('val', '');
                FlowRouter.go('pos.locationTransfer', {locationTransferId: r});
            }
        });
    } else {
        var locationTransferDetail = Pos.Collection.LocationTransferDetails.findOne({
            productId: product._id,
            locationTransferId: locationTransferId
        });
        if (locationTransferDetail == null) {
            var locationTransferDetailObj = {};
            locationTransferDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.LocationTransferDetails, locationTransferId, 3);
            locationTransferDetailObj.locationTransferId = locationTransferId;
            locationTransferDetailObj.productId = product._id;
            locationTransferDetailObj.quantity = defaultQuantity;
            locationTransferDetailObj.branchId = branchId;
            locationTransferDetailObj.fromLocationId = locationTransferObj.fromLocationId;
            locationTransferDetailObj.toLocationId = locationTransferObj.toLocationId;
            locationTransferDetailObj.imei = [];
            Meteor.call('insertLocationTransferDetails', locationTransferDetailObj);
        } else {
            var set = {};
            //need to locationTransfer
            set.quantity = (locationTransferDetail.quantity + defaultQuantity);
            Meteor.call('updateLocationTransferDetails', locationTransferDetail._id, set);
        }
        $('#product-barcode').val('');
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        // updateLocationTransferSubTotal(locationTransferId);
    }
}
function pay(locationTransferId) {
    var branchId = Session.get('currentBranch');
    Meteor.call('locationTransferManageStock', locationTransferId, branchId, function (er, re) {
        if (er) {
            alertify(er.message);
        }
        else {
            var locationTransferObj = {};
            locationTransferObj.status = 'Saved';
            Meteor.call('updateLocationTransfer', locationTransferId, locationTransferObj);
            alertify.success('LocationTransfer is saved successfully');
            FlowRouter.go('pos.locationTransfer');
        }
    });
}
function checkIsUpdate() {
    debugger;
    var locationTransferId = $('#locationTransfer-id').val();
    if (locationTransferId == "") {
        Session.set('hasLocationTransferUpdate', false);
        return;
    }
    var locationTransfer = Pos.Collection.LocationTransfers.findOne(locationTransferId);
    var fromLocationId = $('#from-location-id').val();
    var toLocationId = $('#to-location-id').val();
    var staff = $('#staff-id').val();
    var date = $('#input-locationTransfer-date').val();
    var locationTransferDate = moment(locationTransfer.locationTransferDate).format('MM/DD/YYYY hh:mm:ss A');
    var hasLocationTransferUpdate = false;
    if (date != locationTransferDate || fromLocationId != locationTransfer.fromLocationId ||
        staff != locationTransfer.staffId || toLocationId != locationTransfer.toLocationId) {
        hasLocationTransferUpdate = true;
    }
    Session.set('hasLocationTransferUpdate', hasLocationTransferUpdate);
}
function prepareForm() {
    setTimeout(function () {
        Session.set('hasLocationTransferUpdate', false);
        //$('#input-locationTransfer-date').val('');
        $('#staff-id').select2();
        $('#from-location-id').select2();
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        $('#to-location-id').select2();
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
