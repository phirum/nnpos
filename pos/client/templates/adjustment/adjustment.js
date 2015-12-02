Session.setDefault('adjustmentHasUpdate', false);
Template.pos_adjustment.onRendered(function () {
    createNewAlertify(["supplier", "userStaff"]);
    // $('#product-id').select2();
    $('#product-barcode').focus();
    $('#adjustment-date').datetimepicker({
        format: "MM/DD/YYYY hh:mm:ss A"
    });
    setTimeout(function () {
        $('.select-two').select2();
        var s = Pos.Collection.Adjustments.findOne({
            _id: FlowRouter.getParam('adjustmentId'),
            status: "Unsaved",
            branchId: Session.get('currentBranch')
        });
        if (s == null) {
            FlowRouter.go('pos.adjustment');
            $('#product-barcode').focus();
        }
    }, 700);
});

Template.pos_adjustment.helpers({
    adjustmentHasUpdate: function () {
        var hasUpdate = Session.get('adjustmentHasUpdate');
        if (hasUpdate != null && hasUpdate != "null") {
            return hasUpdate;
        }
        return false;
    },
    adjustmentDate: function () {
        var adjustment = Pos.Collection.Adjustments.findOne(FlowRouter.getParam('adjustmentId'));
        if (adjustment == null) {
            return "";
            // return moment(TimeSync.serverTime(null)).format('MM/DD/YYYY hh:mm:ss A');
        } else {
            return moment(adjustment.adjustmentDate).format('MM/DD/YYYY hh:mm:ss A');
        }
    },
    baseCurrency: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.findOne(id);
    },
    compareTwoValue: function (val1, val2) {
        return val1 == val2;
    },
    adjustment: function () {
        var s = Pos.Collection.Adjustments.findOne(FlowRouter.getParam('adjustmentId'));
        s.adjustmentDate = moment(s.adjustmentDate).format("DD-MM-YY, hh:mm:ss a");
        s.diffCostFormatted = numeral(s.diffCost).format('0,0.00');
        return s;
    },
    adjustmentDetails: function () {
        var adjustmentDetailItems = [];
        var sD = Pos.Collection.AdjustmentDetails.find({adjustmentId: FlowRouter.getParam('adjustmentId')});
        var i = 1;
        sD.forEach(function (sd) {
            // var item = _.extend(sd,{});
           /* var product = Pos.Collection.Products.findOne(sd.productId);
            sd.unit = Pos.Collection.Units.findOne(product.unitId).name;
            sd.productName = product.name;*/
            sd.diffCostFormatted = numeral(sd.diffCost).format('0,0.00');
            //sd.order = pad(i, 2);
            sd.order = i;
            i++;
            adjustmentDetailItems.push(sd);
        });
        return adjustmentDetailItems;
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
    Reasons: function () {
        return [
            {name: "Adjustment Qty"},
            {name: "Damaged"},
            {name: "Shrink"}
        ]
    },
    products: function () {
        return Pos.Collection.Products.find({status: "enable"});
    },
    adjustments: function () {
        var id = FlowRouter.getParam('adjustmentId');
        if (id != null || id != "") {
            return Pos.Collection.Adjustments.find({
                _id: {$ne: id},
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });
        }
        else {
            return Pos.Collection.Adjustments.find({
                branchId: Session.get('currentBranch'),
                status: "Unsaved"
            });

        }
    }
});

Template.pos_adjustment.events({
    'click #btn-update-adjustment-data': function () {
        var adjustmentId = $('#adjustment-id').val();
        if (adjustmentId == "") return;
        var reason = $('#reason').val();
        var staff = $('#staff-id').val();
        var description=$('#description').val();
        var date = $('#input-adjustment-date').val();
        var set = {};
        set.reason = reason;
        set.description=description;
        set.staffId = staff;
        set.adjustmentDate = moment(date).toDate();
        Meteor.call('updateAdjustment', adjustmentId, set, function (error, result) {
            if (error) alertify.error(error.message);
        });
        Session.set('adjustmentHasUpdate', false);
        $('#product-barcode').focus();

    },
    'click #btn-save': function () {
        var adjustmentId = $('#adjustment-id').val();
        if (adjustmentId == "") {
            alertify.warning("Nothing to Save");
            return;
        }
        var hasChange = true;
        $('#adjustment-list tr').each(function () {
            var diffQty = $(this).find('.diff-qty').text();
            if (diffQty == 0) {
                $(this).find('.new-qty').focus();
                alertify.alert("New quantity can't be the same as old quantity.");
                hasChange = false;
                return false;
            }
        });
        if (!hasChange) {
            return;
        }
        payAdjustment(adjustmentId);
        prepareAdjustmentForm();
    },
    'click #cancel-adjustment': function () {
        var adjustmentId = $('#adjustment-id').val();
        if (adjustmentId == "") {
            return;
        }
        alertify.confirm("Are you sure to cancel this adjustment?")
            .set({
                onok: function (closeEvent) {
                    Meteor.call('cancelAdjustment', adjustmentId);
                    alertify.success('Adjustment is cancelled.');
                    FlowRouter.go('pos.adjustment');
                    prepareAdjustmentForm();
                },
                title: "Cancel Adjustment."
            });
    },
    'click #suspend': function () {
        FlowRouter.go('pos.adjustment');
        prepareAdjustmentForm();

    },
    'keypress .new-qty': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('-') != -1) {
            if (charCode == 45) {
                return false;
            }
        }
        // return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
        return !(charCode > 31 && (charCode < 45 || charCode > 57) || charCode == 47 || charCode == 46);

    },
    'change .new-qty, mouseleave .new-qty': function (e) {
        var val = $(e.currentTarget).val();
        // var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/; //positive number
        //var numericReg = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/; //negative and positive decimal number
        var numericReg = /^[+-]?[0-9]{1,9}(?:\[0-9]{1,2})?$/; //negative and positive number
        var firstNewQty = this.newQuantity;
        if (!numericReg.test(val) || val == "") {
            $(e.currentTarget).val(firstNewQty);
            $(e.currentTarget).focus();
            return;
        }
        var price = Pos.Collection.Products.findOne(this.productId).purchasePrice;
        var newQty = parseFloat(val);
        var set = {};
        set.newQuantity = newQty;
        set.diffQuantity = newQty - this.oldQuantity;
        set.diffCost = set.diffQuantity * price;
        Meteor.call('updateAdjustmentDetails', this._id, set);
        updateAdjustmentTotalDiffCost(FlowRouter.getParam('adjustmentId'));
    },
    'blur #input-adjustment-date': function () {
        checkAdjustmentIsUpdate();
    },
    'change #reason': function () {
        checkAdjustmentIsUpdate();
       /* if ($('#adjustment-id').val() == "") {
            return;
        }
        var set = {};
        set.reason = $('#reason').val();
        Meteor.call('updateAdjustment', FlowRouter.getParam('adjustmentId'), set);
        $('#product-barcode').focus();*/
    },
    'change #staff-id': function () {
        checkAdjustmentIsUpdate();
       /* if ($('#adjustment-id').val() == "") {
            return;
        }
        var set = {};
        set.staffId = $('#staff-id').val();
        Meteor.call('updateAdjustment', FlowRouter.getParam('adjustmentId'), set);
        $('#product-barcode').focus();*/
    },
    'keyup #description': function () {
        checkAdjustmentIsUpdate();
       /* if ($('#adjustment-id').val() == "") {
            return;
        }
        var set = {};
        set.description = $('#description').val();
        Meteor.call('updateAdjustment', FlowRouter.getParam('adjustmentId'), set);
        $('#product-barcode').focus();*/
    },

    'click .btn-remove': function () {
        Pos.Collection.AdjustmentDetails.remove(this._id);
        var sd = Pos.Collection.AdjustmentDetails.find({adjustmentId: FlowRouter.getParam('adjustmentId')});
        if (sd.count() == 0) {
            Pos.Collection.Adjustments.remove(FlowRouter.getParam('adjustmentId'));
            FlowRouter.go('pos.adjustment');
            prepareAdjustmentForm();
        } else {
            updateAdjustmentTotalDiffCost(FlowRouter.getParam('adjustmentId'));
        }
    },
    'click .staffInsertAddon': function () {
        alertify.userStaff(renderTemplate(Template.pos_userStaffInsert))
            .set({
                title: "<i class='fa fa-plus'></i> Add New Staff"
            });
        // .maximize();
    },
    'click .supplierInsertAddon': function () {
        alertify.supplier(renderTemplate(Template.pos_supplierInsert))
            .set({
                title: "<i class='fa fa-plus'></i> Add New Supplier"
            });
        // .maximize();
    },
    'change #product-id': function () {
        var id = $('#product-id').val();
        if (id == "") {
            return;
        }
        var product = Pos.Collection.Products.findOne(id);
        if (product != null) {
            var adjustmentId = $('#adjustment-id').val();
            if (product.adjustmentPrice > product.wholesalePrice) {
                alertify.confirm("Are you sure? The last adjustment price higher than the wholesale price? You should update wholesale price?")
                    .set({
                        onok: function (closeEvent) {
                            addOrUpdateProductsToList(adjustmentId, product);
                        },
                        title: "Product is out of stock.",
                        oncancel: function () {
                            $('#product-id').val('');
                            $('#product-barcode').val('');
                            $('#product-barcode').focus();
                            return;
                        }
                    });
            } else if (product.adjustmentPrice > product.wholesalePrice) {
                alertify.confirm("Are you sure? The last adjustment price higher than the retail price? You should update retail price?")
                    .set({
                        onok: function (closeEvent) {
                            addOrUpdateProductsToList(adjustmentId, product);
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
                addOrUpdateProductsToList(adjustmentId, product);
            }
        } else {
            alertify.error("Can't find Product by this Product");
            $('#product-id').val('');
            $('#product-barcode').val('');
            $('#product-barcode').focus();
        }
    },
    'keyup #product-barcode': function (e) {
        var charCode = e.which;
        if (e.which == 13) {
            var product = Pos.Collection.Products.findOne({barcode: $('#product-barcode').val(), status: "enable"});
            if (product != null) {
                var adjustmentId = $('#adjustment-id').val();
                addOrUpdateProductsToList(adjustmentId, product);
            } else {
                alertify.error("Can't find Product by this Barcode");
                $('#product-barcode').val('');
                $('#product-barcode').focus();
            }
        }
    }
});

function addOrUpdateProductsToList(adjustmentId, product) {
    var stock = Pos.Collection.Stocks.findOne({productId: product._id, branchId: Session.get('currentBranch')});
    var stockQty = stock == null ? 0 : stock.quantity;
    var branchId = Session.get('currentBranch');
    var reason = $('#reason').val();
    var staffId = $('#staff-id').val();
    var description = $('#description').val();
    var adjustmentDate = $('#input-adjustment-date').val();
    if (reason == "" || staffId == "" || reason == null || staffId == null || adjustmentDate == "") {
        alertify.alert("Please input all Require data (*)")
            .set({title: "Data is required."});
        $('#product-barcode').val('');
        $('#product-barcode').focus();
        return;
    }
    //var defaultQuantity = $('#default-quantity').val() == "" ? 1 : parseInt($('#default-quantity').val());
    //var defaultDiscount = $('#default-discount').val() == "" ? 0 : parseFloat($('#default-discount').val());
    if (adjustmentId == '') {
        var todayDate = moment(TimeSync.serverTime(null)).format('YYYYMMDD');
        var prefix = branchId + "-" + todayDate;
        var newId = idGenerator.genWithPrefix(Pos.Collection.Adjustments, prefix, 4);
        // var exchange=parseFloat($('#last-exchange-rate').text());
        var totalDiscount = $('#total_discount').val() == "" ? 0 : parseFloat($('#total_discount').val());
        var adjustmentObj = {};
        adjustmentObj._id = newId;
        adjustmentObj.reason = reason;
        adjustmentObj.adjustmentDate = moment(adjustmentDate).toDate();
        adjustmentObj.staffId = staffId;
        adjustmentObj.status = "Unsaved";
        adjustmentObj.oldQuantity = 0;
        adjustmentObj.newQuantity = 0;
        adjustmentObj.diffQuantity = 0;
        adjustmentObj.diffCost = 0;
        adjustmentObj.description = description;
        adjustmentObj.branchId = branchId;

        var adjustmentDetailObj = {};
        adjustmentDetailObj.productId = product._id;
        adjustmentDetailObj.oldQuantity = stockQty;
        adjustmentDetailObj.newQuantity = stockQty;
        adjustmentDetailObj.diffQuantity = 0;
        adjustmentDetailObj.diffCost = 0;
        adjustmentDetailObj.branchId = branchId;
        Meteor.call('insertAdjustmentAndAdjustmentDetail', adjustmentObj, adjustmentDetailObj);
        updateAdjustmentTotalDiffCost(newId);

        $('#product-barcode').val('');
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        FlowRouter.go('pos.adjustment', {adjustmentId: newId});
        $('#product-barcode').focus();
        //
    } else {
        var adjustmentDetail = Pos.Collection.AdjustmentDetails.findOne({
            productId: product._id,
            adjustmentId: adjustmentId
        });
        if (adjustmentDetail == null) {
            var adjustmentDetailObj = {};
            adjustmentDetailObj._id = idGenerator.genWithPrefix(Pos.Collection.AdjustmentDetails, adjustmentId, 3);
            adjustmentDetailObj.adjustmentId = adjustmentId;
            adjustmentDetailObj.productId = product._id;
            adjustmentDetailObj.oldQuantity = stockQty;
            adjustmentDetailObj.newQuantity = stockQty;
            adjustmentDetailObj.diffQuantity = 0;
            adjustmentDetailObj.diffCost = 0;
            adjustmentDetailObj.branchId = branchId;
            Meteor.call('insertAdjustmentDetails', adjustmentDetailObj);
        } else {
            alertify.alert("This product has been added to list.");
            //var adjustmentDetailSetObj = {};
            //adjustmentDetailSetObj.discount = defaultDiscount;
            //adjustmentDetailSetObj.quantity = adjustmentDetail.quantity + defaultQuantity;
            //adjustmentDetailSetObj.amount = (adjustmentDetail.price * adjustmentDetailSetObj.quantity) * (1 - defaultDiscount / 100);
            //Meteor.call('updateAdjustmentDetails', adjustmentDetail._id, adjustmentDetailSetObj);
        }
        $('#product-barcode').val('');
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
        //updateAdjustmentTotalDiffCost(adjustmentId);
    }
}

updateAdjustmentTotalDiffCost = function (adjustmentId) {
    var diffCostTotal = 0;
    var diffQty = 0;
    var oldQty = 0;
    var newQty = 0;
    var adjustmentDetails = Pos.Collection.AdjustmentDetails.find({adjustmentId: adjustmentId});
    adjustmentDetails.forEach(function (adjustmentDetail) {
        diffCostTotal += parseFloat(adjustmentDetail.diffCost);
        diffQty += parseInt(adjustmentDetail.diffQuantity);
        oldQty += parseInt(adjustmentDetail.oldQuantity);
        newQty += parseInt(adjustmentDetail.newQuantity);
    });
    var adjustmentSetObj = {};
    adjustmentSetObj.diffCost = diffCostTotal;
    adjustmentSetObj.diffQuantity = diffQty;
    adjustmentSetObj.oldQuantity = oldQty;
    adjustmentSetObj.newQuantity = newQty;
    Meteor.call('updateAdjustment', adjustmentId, adjustmentSetObj);
};


function payAdjustment(adjustmentId) {
    var branchId = Session.get('currentBranch');
    var adjustmentDetails = Pos.Collection.AdjustmentDetails.find({adjustmentId: adjustmentId});
    var prefix = branchId + "-";
    adjustmentDetails.forEach(function (ad) {
        var product = Pos.Collection.Products.findOne(ad.productId);
        if (product.productType == "Stock") {
            var stock = Pos.Collection.Stocks.findOne({productId: ad.productId, branchId: branchId});
            if (stock == null) {
                var obj = {};
                obj._id = idGenerator.genWithPrefix(Pos.Collection.Stocks, prefix, 6);
                obj.productId = ad.productId;
                obj.branchId = branchId;
                obj.quantity = ad.newQuantity;
                Meteor.call('insertStock', obj);
            } else {
                var set = {};
                set.quantity = ad.newQuantity;
                Meteor.call('updateStock', stock._id, set);
            }
        }
    });
    var setObj = {};
    setObj.status = "Saved";
    Meteor.call('updateAdjustment', adjustmentId, setObj);
    FlowRouter.go('pos.adjustment');
    alertify.success("Successfully");
}

function checkAdjustmentIsUpdate() {
    var adjustmentId = $('#adjustment-id').val();
    if (adjustmentId == "") {
        Session.set('adjustmentHasUpdate', false);
        return;
    }
    var adjustment = Pos.Collection.Adjustments.findOne(adjustmentId);
    var reason = $('#reason').val();
    var staff = $('#staff-id').val();
    var date = $('#input-adjustment-date').val();
    var description = $('#description').val();
    var purchaseDate = moment(adjustment.adjustmentDate).format('MM/DD/YYYY hh:mm:ss A');
    var hasUpdate = false;
    if (date != purchaseDate || reason != adjustment.reason ||
        staff != adjustment.staffId || description != adjustment.description) {
        hasUpdate = true;
    }
    Session.set('adjustmentHasUpdate', hasUpdate);
}

function prepareAdjustmentForm() {
    setTimeout(function () {
        Session.set('adjustmentHasUpdate', false);
        $('#input-adjustment-date').val('');
        $('#staff-id').select2();
        $('#reason').select2();
        $('#product-barcode').focus();
        $('#product-id').select2('val', '');
    }, 300);
}