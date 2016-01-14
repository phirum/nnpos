var posCategoryTPL = Template.pos_category;
var posCategoryInsertTPL = Template.pos_categoryInsert;
var posCategoryUpdateTPL = Template.pos_categoryUpdate;
var posCategoryShowTPL = Template.pos_categoryShow;
posCategoryTPL.onRendered(function () {
    createNewAlertify(['category', 'categoryShow']);
});
posCategoryTPL.events({
    'click .insert': function (e, t) {
        Session.set('CategoryIdSession', null);
        alertify.category(fa('plus', 'Add New Category'), renderTemplate(posCategoryInsertTPL)).maximize();
    },
    'click .update': function (e, t) {
        var data = Pos.Collection.Categories.findOne(this._id);
        Session.set('CategoryIdSession', this._id);
        alertify.category(fa('pencil', 'Update Existing Category'), renderTemplate(posCategoryUpdateTPL, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;
       /* var canRemove = (this._categoryCount == null || this._categoryCount == 0)
            && (this._productCount == null || this._productCount == 0);*/
        alertify.confirm("Are you sure to delete [" + id + "]?")
            .set({
                onok: function (closeEvent) {
                    var arr = [
                        {collection: 'Pos.Collection.Products', selector: {categoryId: id}},
                        {collection: 'Pos.Collection.Categories', selector: {parentId: id}}
                    ];
                    Meteor.call('isRelationExist', arr, function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            if (result) {
                                alertify.warning("Data has been used. Can't remove.");
                            } else {
                                Pos.Collection.Categories.remove(id, function (err) {
                                    if (err) {
                                        alertify.error(err.message);
                                    } else {
                                        alertify.success("Success");
                                    }
                                });
                            }
                        }
                    });
                    /* var relation = relationExist(
                     [
                     {collection: Pos.Collection.Products, selector: {categoryId: id}},
                     {collection: Pos.Collection.Categories, selector: {parentId: id}}
                     ]
                     );
                     if (relation) {
                     alertify.alert("Data has been used. Can't remove.").set({title: "Data has been used."});
                     }*/
                    /*if (canRemove) {
                     Pos.Collection.Categories.remove(id, function (error) {
                     if (error) {
                     alertify.error(error.message);
                     } else {
                     alertify.success("Success");
                     }
                     });
                     } else {
                     alertify.warning("Data has been used. Can't remove.");
                     }*/
                },
                title: '<i class="fa fa-remove"></i> Delete Category'
            });
    },
    'click .show': function (e, t) {
        alertify.categoryShow(fa('eye', 'Category Detail'), renderTemplate(posCategoryShowTPL, this));
    }
});
AutoForm.hooks({
    // Customer
    pos_categoryInsert: {
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    pos_categoryUpdate: {
        /*before:{
         update:function(doc){
         debugger;
         if(this.docId==doc.parentId){
         alertify.warning("Parent can't be the same as the own category.");
         return;
         }
         return doc;
         }
         },*/
        onSuccess: function (formType, result) {
            alertify.category().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
