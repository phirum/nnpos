Meteor.methods({
    updateProduct: function (id, set) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Pos.Collection.Products.update(id, {$set: set});
    },
    directUpdateProduct:function(id,set,unset){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var updateObject={};
        if(set!=null) updateObject.$set=set;
        if(unset!=null) updateObject.$unset=unset;
        Pos.Collection.Products.direct.update(id,updateObject);
    }
});