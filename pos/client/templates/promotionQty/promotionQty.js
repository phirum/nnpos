/*
 var posPQTPL = Template.pos_promotionQtyInsert;
 var posPQInsertTPL = Template.pos_promotionQtyInsert;
 var posPQUpdateTPL = Template.pos_promotionQtyUpdate;
 var posPQShowTPL = Template.pos_promotionQtyShow;

 promotionItemsState = new ReactiveList();
 posPQTPL.onRendered(function () {
 createNewAlertify(['promotionQty', 'promotionQtyShow']);
 });
 posPQTPL.events({
 'click .insert': function (e, t) {
 promotionItemsState.clear();
 alertify.promotionQty(fa('plus', 'Add New PromotionQty'), renderTemplate(posPQInsertTPL)).maximize();
 },
 'click .update': function (e, t) {
 promotionItemsState.clear();
 var data = Pos.Collection.PromotionQuantities.findOne(this._id);
 if (!_.isUndefined(data)) {
 _.each(data.promotionItems, function (item, index) {
 item.indexProductId = 'promotionItems.' + index + '.productId';
 item.indexQuantity = 'promotionItems.' + index + '.quantity';
 promotionItemsState.insert(item.productId, item);
 });
 }
 alertify.promotionQty(fa('pencil', 'Update Existing PromotionQty'), renderTemplate(posPQUpdateTPL, data)).maximize();
 },
 'click .remove': function (e, t) {
 var id = this._id;
 alertify.confirm("Are you sure to delete [" + id + "]?")
 .set({
 onok: function (closeEvent) {
 var relation = relationExist(
 [
 {collection: Pos.Collection.Sales, selector: {promotionQtyId: id}}
 ]
 );
 if (relation) {
 alertify.alert("Data has been used. Can't remove.").set({title: "Data has been used."});
 } else {
 Pos.Collection.PromotionQuantities.remove(id, function (error) {
 if (error) {
 alertify.error(error.message);
 } else {
 alertify.success("Success");
 }
 });
 }
 },
 title: '<i class="fa fa-remove"></i> Delete PromotionQty'
 });
 },
 'click .show': function (e, t) {
 this.sDate = moment(this.startDate).format('YYYY-MM-DD');
 this.eDate = moment(this.endDate).format('YYYY-MM-DD');
 alertify.promotionQtyShow(fa('eye', 'Promotion Detail'), renderTemplate(posPQShowTPL, this));
 }
 });
 posPQInsertTPL.onRendered(function () {
 /!*   this.$('.startDate').datetimepicker({
 format: 'YYYY-MM-DD HH:mm:ss'
 });
 this.$('.endDate').datetimepicker({
 format: 'YYYY-MM-DD HH:mm:ss'
 });
 this.$('.startDate').on("dp.change", function (e) {
 $('.endDate').data("DateTimePicker").minDate(e.date);
 });
 this.$('.endDate').on("dp.change", function (e) {
 $('.startDate').data("DateTimePicker").maxDate(e.date);
 });*!/
 DateTimePicker.date($('[name="startDate"]'));
 DateTimePicker.date($('[name="endDate"]'));
 this.$('[name="startDate"]').on("dp.change", function (e) {
 $('[name="endDate"]').data("DateTimePicker").minDate(e.date);
 });
 this.$('[name="endDate"]').on("dp.change", function (e) {
 $('[name="startDate"]').data("DateTimePicker").maxDate(e.date);
 });
 $('[name="startTime"]').datetimepicker({
 format: 'HH:mm'
 });
 $('[name="endTime"]').datetimepicker({
 format: 'HH:mm'
 });
 this.$('[name="startTime"]').on("dp.change", function (e) {
 $('[name="endTime"]').data("DateTimePicker").minDate(e.date);
 });
 this.$('[name="endTime"]').on("dp.change", function (e) {
 $('[name="startTime"]').data("DateTimePicker").maxDate(e.date);
 });
 });
 posPQInsertTPL.helpers({
 products: function () {
 var list = [{label: "(Select One)", value: ""}];
 Pos.Collection.Products.find().forEach(function (obj) {
 list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
 });
 return list;
 }
 });
 posPQUpdateTPL.onRendered(function () {
 /!*this.$('.startDate').datetimepicker({
 format: 'YYYY-MM-DD HH:mm:ss'
 });
 this.$('.endDate').datetimepicker({
 format: 'YYYY-MM-DD HH:mm:ss'
 });
 this.$('.startDate').on("dp.change", function (e) {
 $('.endDate').data("DateTimePicker").minDate(e.date);
 });
 this.$('.endDate').on("dp.change", function (e) {
 $('.startDate').data("DateTimePicker").maxDate(e.date);
 });*!/
 DateTimePicker.date($('[name="startDate"]'));
 DateTimePicker.date($('[name="endDate"]'));
 this.$('[name="startDate"]').on("dp.change", function (e) {
 $('[name="endDate"]').data("DateTimePicker").minDate(e.date);
 });
 this.$('[name="endDate"]').on("dp.change", function (e) {
 $('[name="startDate"]').data("DateTimePicker").maxDate(e.date);
 });
 $('[name="startTime"]').datetimepicker({
 format: 'HH:mm'
 });
 $('[name="endTime"]').datetimepicker({
 format: 'HH:mm'
 });
 this.$('[name="startTime"]').on("dp.change", function (e) {
 $('[name="endTime"]').data("DateTimePicker").minDate(e.date);
 });
 this.$('[name="endTime"]').on("dp.change", function (e) {
 $('[name="startTime"]').data("DateTimePicker").maxDate(e.date);
 });
 });
 posPQUpdateTPL.helpers({
 formatDate: function (date) {
 return moment(date).format('YYYY-MM-DD HH:mm:ss');
 },
 products: function () {
 var list = [{label: "(Select One)", value: ""}];
 Pos.Collection.Products.find().forEach(function (obj) {
 list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
 });
 return list;
 }
 });

 AutoForm.hooks({
 pos_promotionQtyInsert: {
 before: {
 insert: function (doc) {
 doc.branchId = Session.get('currentBranch');
 if ($('[name="startDate"]').val() != '' && $('[name="endDate"]').val() != '') {
 //doc.startDate = $('.startDate').data("DateTimePicker").date().toDate();
 //doc.endDate = $('.endDate').data("DateTimePicker").date().toDate();
 doc.startDate = moment($('[name="startDate"]').val()).toDate();
 doc.endDate = moment($('[name="endDate"]').val() + ' 23:59:59').toDate();
 var selector =
 {
 $or: [
 {startDate: {$lte: doc.startDate}, endDate: {$gte: doc.startDate}},
 {startDate: {$lte: doc.endDate}, endDate: {$gte: doc.endDate}},
 {
 $and: [
 {startDate: {$gte: doc.startDate}},
 {startDate: {$lte: doc.endDate}},
 {endDate: {$gte: doc.startDate}},
 {endDate: {$lte: doc.endDate}}
 ]

 }
 ]
 };
 var promotion = Pos.Collection.PromotionQuantities.find(selector);
 if (promotion.count() > 0) {
 alertify.warning("Please select other promotion date.");
 return false;
 }
 }
 return doc;
 }
 },
 onSuccess: function (formType, result) {
 alertify.success('Success');
 },
 onError: function (formType, error) {
 alertify.error(error.message);
 }
 },
 pos_promotionQtyUpdate: {
 before: {
 update: function (doc) {
 if ($('[name="startDate"]').val() != '' && $('[name="endDate"]').val() != '') {

 //doc.$set.startDate = $('.startDate').data("DateTimePicker").date().toDate();
 //doc.$set.endDate = $('.endDate').data("DateTimePicker").date().toDate();
 doc.$set.startDate = moment($('[name="startDate"]').val()).toDate();
 doc.$set.endDate = moment($('[name="endDate"]').val() + ' 23:59:59').toDate();

 var selector =
 {
 $or: [
 {startDate: {$lte: doc.$set.startDate}, endDate: {$gte: doc.$set.startDate}},
 {startDate: {$lte: doc.$set.endDate}, endDate: {$gte: doc.$set.endDate}},
 {
 $and: [
 {startDate: {$gte: doc.$set.startDate}},
 {startDate: {$lte: doc.$set.endDate}},
 {endDate: {$gte: doc.$set.startDate}},
 {endDate: {$lte: doc.$set.endDate}}
 ]

 }
 ],
 _id: {$ne: this.docId}
 };
 var promotion = Pos.Collection.PromotionQuantities.find(selector);
 if (promotion.count() > 0) {
 alertify.warning("Please select other promotion date.");
 return false;
 }
 }

 return doc;
 }
 },
 onSuccess: function (formType, result) {
 alertify.promotionQty().close();
 alertify.success('Success');
 },
 onError: function (formType, error) {
 alertify.error(error.message);
 }
 }
 });

 */


promotionItemsState = new ReactiveList();
Template.pos_promotionQty.onRendered(function () {
    createNewAlertify("promotionQty");
});
Template.pos_promotionQty.events({
    'click .insert': function (e, t) {
        promotionItemsState.clear();
        alertify.promotionQty(fa('plus', 'Add New PromotionQty'), renderTemplate(Template.pos_promotionQtyInsert)).maximize();
    },
    'click .update': function (e, t) {
        debugger;
        promotionItemsState.clear();
        var data = Pos.Collection.PromotionQuantities.findOne(this._id);
        if (!_.isUndefined(data)) {
            _.each(data.promotionItems, function (item, index) {
                item.indexProductId = 'promotionItems.' + index + '.productId';
                item.indexQuantity = 'promotionItems.' + index + '.quantity';
                promotionItemsState.insert(item.productId, item);
            });
        }
        alertify.promotionQty(fa('pencil', 'Update Existing PromotionQty'), renderTemplate(Template.pos_promotionQtyUpdate, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var relation = relationExist(
                        [
                            {collection: Pos.Collection.Sales, selector: {promotionQtyId: id}}
                        ]
                    );
                    if (relation) {
                        alertify.alert("Data has been used. Can't remove.").set({title: "Data has been used."});
                    } else {
                        Pos.Collection.PromotionQuantities.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete PromotionQty'
            });
    },
    'click .show': function (e, t) {
        this.sDate = moment(this.startDate).format('YYYY-MM-DD');
        this.eDate = moment(this.endDate).format('YYYY-MM-DD');
        alertify.alert(renderTemplate(Template.pos_promotionQtyShow, this))
            .set({
                title: '<i class="fa fa-eye"></i> Promotion Detail'
            });
    }
});
Template.pos_promotionQtyInsert.onRendered(function () {
    Meteor.typeahead.inject();
    /*   this.$('.startDate').datetimepicker({
     format: 'YYYY-MM-DD HH:mm:ss'
     });
     this.$('.endDate').datetimepicker({
     format: 'YYYY-MM-DD HH:mm:ss'
     });
     this.$('.startDate').on("dp.change", function (e) {
     $('.endDate').data("DateTimePicker").minDate(e.date);
     });
     this.$('.endDate').on("dp.change", function (e) {
     $('.startDate').data("DateTimePicker").maxDate(e.date);
     });*/
    DateTimePicker.date($('[name="startDate"]'));
    DateTimePicker.date($('[name="endDate"]'));
    this.$('[name="startDate"]').on("dp.change", function (e) {
        $('[name="endDate"]').data("DateTimePicker").minDate(e.date);
    });
    this.$('[name="endDate"]').on("dp.change", function (e) {
        $('[name="startDate"]').data("DateTimePicker").maxDate(e.date);
    });
    $('[name="startTime"]').datetimepicker({
        format: 'HH:mm'
    });
    $('[name="endTime"]').datetimepicker({
        format: 'HH:mm'
    });
    this.$('[name="startTime"]').on("dp.change", function (e) {
        $('[name="endTime"]').data("DateTimePicker").minDate(e.date);
    });
    this.$('[name="endTime"]').on("dp.change", function (e) {
        $('[name="startTime"]').data("DateTimePicker").maxDate(e.date);
    });
});
Template.pos_promotionQtyInsert.helpers({
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
        // TODO your event handler here
        var id = suggestion._id;
        //event.target.productId.value = id;
        $('[name="productId"]').val(id);
        $('[name="search"]').typeahead('val', suggestion.name);
    },
    products: function () {
        return ReactiveMethod.call('getProductList');
    }
});
Template.pos_promotionQtyUpdate.onRendered(function () {
    Meteor.typeahead.inject();
    Session.set('productNameSession', null);
    /*this.$('.startDate').datetimepicker({
     format: 'YYYY-MM-DD HH:mm:ss'
     });
     this.$('.endDate').datetimepicker({
     format: 'YYYY-MM-DD HH:mm:ss'
     });
     this.$('.startDate').on("dp.change", function (e) {
     $('.endDate').data("DateTimePicker").minDate(e.date);
     });
     this.$('.endDate').on("dp.change", function (e) {
     $('.startDate').data("DateTimePicker").maxDate(e.date);
     });*/
    DateTimePicker.date($('[name="startDate"]'));
    DateTimePicker.date($('[name="endDate"]'));
    this.$('[name="startDate"]').on("dp.change", function (e) {
        $('[name="endDate"]').data("DateTimePicker").minDate(e.date);
    });
    this.$('[name="endDate"]').on("dp.change", function (e) {
        $('[name="startDate"]').data("DateTimePicker").maxDate(e.date);
    });
    $('[name="startTime"]').datetimepicker({
        format: 'HH:mm'
    });
    $('[name="endTime"]').datetimepicker({
        format: 'HH:mm'
    });
    this.$('[name="startTime"]').on("dp.change", function (e) {
        $('[name="endTime"]').data("DateTimePicker").minDate(e.date);
    });
    this.$('[name="endTime"]').on("dp.change", function (e) {
        $('[name="startTime"]').data("DateTimePicker").maxDate(e.date);
    });
});
Template.pos_promotionQtyUpdate.helpers({
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
        // TODO your event handler here
        var id = suggestion._id;
        //event.target.productId.value = id;
        $('[name="productId"]').val(id);
        // Session.set('productNameSession', suggestion.name);
        $('[name="search"]').typeahead('val', suggestion.name);
    },
    /*productName: function () {
     var productNameSession = Session.get('productNameSession');
     if (productNameSession) {
     return productNameSession;
     } else {
     return this._product.name;
     }
     },*/
    formatDate: function (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    products: function () {
        var list = [{label: "(Select One)", value: ""}];
        Pos.Collection.Products.find().forEach(function (obj) {
            list.push({label: obj._id + ' : ' + obj.name, value: obj._id});
        });
        return list;
    }
});

AutoForm.hooks({
    pos_promotionQtyInsert: {
        before: {
            insert: function (doc) {
                doc.branchId = Session.get('currentBranch');
                debugger;
                if ($('[name="startDate"]').val() != '' && $('[name="endDate"]').val() != '') {
                    //doc.startDate = $('.startDate').data("DateTimePicker").date().toDate();
                    //doc.endDate = $('.endDate').data("DateTimePicker").date().toDate();
                    //doc.startDate = moment($('[name="startDate"]').val()).toDate();
                    //doc.endDate = moment($('[name="endDate"]').val() + ' 23:59:59').toDate();
                    var startDate = moment($('[name="startDate"]').val()).toDate();
                    var endDate = moment($('[name="endDate"]').val() + ' 23:59:59').toDate();

                    /* var selector =
                     {
                     $or: [
                     {startDate: {$lte: doc.startDate}, endDate: {$gte: doc.startDate}},
                     {startDate: {$lte: doc.endDate}, endDate: {$gte: doc.endDate}},
                     {
                     $and: [
                     {startDate: {$gte: doc.startDate}},
                     {startDate: {$lte: doc.endDate}},
                     {endDate: {$gte: doc.startDate}},
                     {endDate: {$lte: doc.endDate}}
                     ]

                     }
                     ]
                     };*/
                    var selector =
                    {
                        $or: [
                            {startDate: {$lte: startDate}, endDate: {$gte: startDate}},
                            {startDate: {$lte: endDate}, endDate: {$gte: endDate}},
                            {
                                $and: [
                                    {startDate: {$gte: startDate}},
                                    {startDate: {$lte: endDate}},
                                    {endDate: {$gte: startDate}},
                                    {endDate: {$lte: endDate}}
                                ]

                            }
                        ],
                        productId: doc.productId
                    };
                    var promotion = Pos.Collection.PromotionQuantities.find(selector);
                    if (promotion.count() > 0) {
                        alertify.warning("Please select other promotion date.");
                        return false;
                    }
                }
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
            alertify.promotionQty().close();
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_promotionQtyUpdate: {
        before: {
            update: function (doc) {
                debugger;
                if ($('[name="startDate"]').val() != '' && $('[name="endDate"]').val() != '') {

                    //doc.$set.startDate = $('.startDate').data("DateTimePicker").date().toDate();
                    //doc.$set.endDate = $('.endDate').data("DateTimePicker").date().toDate();
                    doc.$set.startDate = moment($('[name="startDate"]').val()).toDate();
                    doc.$set.endDate = moment($('[name="endDate"]').val() + ' 23:59:59').toDate();

                    var selector =
                    {
                        $or: [
                            {startDate: {$lte: doc.$set.startDate}, endDate: {$gte: doc.$set.startDate}},
                            {startDate: {$lte: doc.$set.endDate}, endDate: {$gte: doc.$set.endDate}},
                            {
                                $and: [
                                    {startDate: {$gte: doc.$set.startDate}},
                                    {startDate: {$lte: doc.$set.endDate}},
                                    {endDate: {$gte: doc.$set.startDate}},
                                    {endDate: {$lte: doc.$set.endDate}}
                                ]

                            }
                        ],
                        _id: {$ne: this.docId},
                        productId: doc.$set.productId
                    };
                    var promotion = Pos.Collection.PromotionQuantities.find(selector);
                    if (promotion.count() > 0) {
                        alertify.warning("Please select other promotion date.");
                        return false;
                    }
                }
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.promotionQty().close();

        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

