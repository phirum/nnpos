var posProductTPL = Template.pos_product;
var posProductInsertTPL = Template.pos_productInsert;
var posProductUpdateTPL = Template.pos_productUpdate;
var posProductShowTPL = Template.pos_productShow;

posProductTPL.onRendered(function () {
    createNewAlertify(['product', 'productShow']);
    createNewAlertify(['category', 'unit']);
});
posProductTPL.events({
    'click .insert': function (e, t) {
        Session.set('CategoryIdSession', null);
        alertify.product(fa("plus", "Add New Product"), renderTemplate(posProductInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        Session.set('CategoryIdSession', null);
        var data = Pos.Collection.Products.findOne(this._id);
        alertify.product(fa('pencil', 'Update Existing Product'), renderTemplate(posProductUpdateTPL, data)).maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
        var canRemove = (this._purchaseDetailCount == null || this._purchaseDetailCount == 0)
            && (this._saleDetailCount == null || this._saleDetailCount == 0)
            && (this._adjustmentDetailCount == null || this._adjustmentDetailCount == 0);
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    /*var relation = relationExist(
                     [
                     {collection: Pos.Collection.SaleDetails, selector: {productId: id}},
                     {collection: Pos.Collection.PurchaseDetails, selector: {productId: id}},
                     {collection: Pos.Collection.Stocks, selector: {productId: id}},
                     {collection: Pos.Collection.AdjustmentDetails, selector: {productId: id}}
                     ]
                     );*/
                    if (canRemove) {
                        Pos.Collection.Products.remove(id, function (error) {
                            if (error) {
                                alertify.error(error.message);
                            } else {
                                alertify.success("Success");
                            }
                        });
                    } else {
                        alertify.warning("Data has been used. Can't remove.");
                    }
                },
                title: '<i class="fa fa-remove"></i> Delete Product'
            });

    },
    'click .show': function (e, t) {
        alertify.productShow(fa('eye', 'Product Detail'), renderTemplate(posProductShowTPL, this));

    }
});
posProductInsertTPL.events({
    /*  'change #category-id': function () {
     Session.set('CategoryIdSession', $('#category-id').val());
     },*/
    'click .categoryInsertAddon': function (e, t) {
        alertify.category(fa('plus', 'Add New Category'), renderTemplate(Template.pos_categoryInsert));
    },
    /*'click .subCategoryInsertAddon': function (e, t) {
     alertify.subCategory(renderTemplate(Template.pos_subCategoryInsert))
     .set({title: "<i class='fa fa-plus'></i> Add New Sub Category"});
     //.maximize();
     },*/
    'click .unitInsertAddon': function (e, t) {
        alertify.unit(fa('plus', 'Add New Unit'), renderTemplate(Template.pos_unitInsert));
    }
});
posProductUpdateTPL.events({
    'click .categoryInsertAddon': function (e, t) {
        alertify.category(fa('plus', 'Add New Category'), renderTemplate(Template.pos_categoryInsert));
    },
    /*'change #category-id': function () {
     Session.set('CategoryIdSession', $('#category-id').val());
     },
     'click .subCategoryInsertAddon': function (e, t) {

     alertify.subCategory(renderTemplate(Template.pos_subCategoryInsert))
     .set({
     title: "<i class='fa fa-plus'></i> Add New Sub Category"
     });
     // .maximize();

     },*/
    'click .unitInsertAddon': function (e, t) {
        alertify.unit(fa('plus', 'Add New Unit'), renderTemplate(Template.pos_unitInsert));
    }
});
AutoForm.hooks({
    // Customer
    pos_productInsert: {
        before: {
            insert: function (doc) {
                doc.purchasePrice = doc.wholesalePrice;
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        after: {
            insert: function () {
                $('select[name="categoryId"]').select2('val', '');
                $('select[name="subCategoryId"]').select2('val', '');
                $('select[name="unitId"]').select2('val', '');
                $('select[name="status"]').select2('val', '');
                $('select[name="productType"]').select2('val', '');
            }
        }
    },
    pos_productUpdate: {
        onSuccess: function (formType, result) {
            alertify.product().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        after: {
            insert: function () {
                $('select[name="categoryId"]').select2('val', '');
                $('select[name="subCategoryId"]').select2('val', '');
                $('select[name="unitId"]').select2('val', '');
                $('select[name="status"]').select2('val', '');
                $('select[name="productType"]').select2('val', '');
            }
        }
    }
});

