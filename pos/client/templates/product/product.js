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
        Meteor.call('findOneRecord', 'Pos.Collection.Products', {_id: this._id}, {}, function (error, product) {
            Session.set('CategoryIdSession', null);
            alertify.product(fa('pencil', 'Update Existing Product'), renderTemplate(posProductUpdateTPL, product)).maximize();
        });
    },
    'click .remove': function (e, t) {
        var id = this._id;
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var arr = [
                        {collection: 'Pos.Collection.FIFOInventory', selector: {productId: id}},
                        {collection: 'Pos.Collection.SaleDetails', selector: {productId: id}},
                        {collection: 'Pos.Collection.PurchaseDetails', selector: {productId: id}},
                        {collection: 'Pos.Collection.LocationTransferDetails', selector: {productId: id}}
                    ];
                    Meteor.call('isRelationExist', arr, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            if (result) {
                                alertify.warning("Data has been used. Can't remove.");
                            } else {
                                Pos.Collection.Products.remove(id, function (err) {
                                    if (err) {
                                        alertify.error(err.message);
                                    } else {
                                        alertify.success("Success");
                                    }
                                });
                            }
                        }
                    });
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

