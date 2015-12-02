var posPPTPL = Template.pos_promotionPercentage;
var posPPInsertTPL = Template.pos_promotionPercentageInsert;
var posPPUpdateTPL = Template.pos_promotionPercentageUpdate;
var posPPShowTPL = Template.pos_promotionPercentageShow;

posPPTPL.onRendered(function () {
    createNewAlertify(['promotionPercentage', 'promotionPercentageShow']);
});
posPPTPL.events({
    'click .insert': function (e, t) {
        alertify.promotionPercentage(fa('plus', 'Add New PromotionPercentage'), renderTemplate(posPPInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.PromotionPercentages.findOne(this._id);
        alertify.promotionPercentage(fa('pencil', 'Update Existing PromotionPercentage'), renderTemplate(posPPUpdateTPL, data)).maximize();
        alert(moment(data.startDate).format('YYYY-MM-DD HH:mm:ss a'));
        alert(moment(data.endDate).format('YYYY-MM-DD HH:mm:ss a'));
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var relation = relationExist(
                        [
                            {collection: Pos.Collection.Sales, selector: {promotionPercentageId: id}}
                        ]
                    );
                    if (relation) {
                        alertify.alert("Data has been used. Can't remove.").set({title: "Data has been used."});
                    } else {
                        Pos.Collection.PromotionPercentages.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete PromotionPercentage'
            });

    },
    'click .show': function (e, t) {
        this.sDate = moment(this.startDate).format('YYYY-MM-DD');
        this.eDate = moment(this.endDate).format('YYYY-MM-DD');
        alertify.promotionPercentageShow(fa('eye', 'Promotion Detail'), renderTemplate(posPPShowTPL, this));
    }
});
posPPInsertTPL.onRendered(function () {
    /*
     this.$('.startDate').datetimepicker({
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
     });
     */
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
posPPUpdateTPL.onRendered(function () {
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
posPPUpdateTPL.helpers({
    formatDate: function (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
});
AutoForm.hooks({
    pos_promotionPercentageInsert: {
        before: {
            insert: function (doc) {
                debugger;
                doc.branchId = Session.get('currentBranch');
                var startDate = $('[name="startDate"]').val();
                var endDate = $('[name="endDate"]').val();
                if (startDate != '' && endDate != '') {
                    //doc.startDate = $('.startDate').data("DateTimePicker").date().toDate();
                    //doc.endDate = $('.endDate').data("DateTimePicker").date().toDate();

                    doc.startDate = moment(startDate + ' 00:00:00').toDate();
                    doc.endDate = moment(endDate + ' 23:59:59').toDate();
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
                    var promotion = Pos.Collection.PromotionPercentages.find(selector);
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
    pos_promotionPercentageUpdate: {
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
                    var promotion = Pos.Collection.PromotionPercentages.find(selector);
                    if (promotion.count() > 0) {
                        alertify.warning("Please select other promotion date.");
                        return false;
                    }
                }
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.promotionPercentage().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});