Meteor.methods({
    updateProduct: function (id, set) {
        Pos.Collection.Products.update(id, {$set: set});
    },
    directUpdateProduct:function(id,set,unset){
        var updateObject={};
        if(set!=null) updateObject.$set=set;
        if(unset!=null) updateObject.$unset=unset;
        Pos.Collection.Products.direct.update(id,updateObject);
    }
});