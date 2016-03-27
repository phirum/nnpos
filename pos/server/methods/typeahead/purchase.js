Meteor.methods({
    searchPurchase: function (query, options) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        options = options || {};
        // guard against client-side DOS: hard limit to 50
        if (options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }
        // TODO fix regexp to support multiple tokens
        var regex = new RegExp(query, 'i');
        return Pos.Collection.Purchases.find({
            $or: [{_id: {$regex: regex}}, {'_supplier.name': {$regex: regex}}],status: {$ne:"Unsaved"}
        }, options).fetch();

    }
});