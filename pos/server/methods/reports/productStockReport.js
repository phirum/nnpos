Meteor.methods({
    posProductStockReport: function (arg, branchId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();
        var product = Pos.Collection.Products.findOne(arg.productId);
        if (product != null) {
            data.product = product;
        }
        var header = {};
        header.product = product.name;
        data.header = header;

        var locations = Pos.Collection.Locations.find({branchId: branchId});
        var content = [];
        if (locations.count() > 0) {
            locations.forEach(function (location) {
                var inventory = Pos.Collection.FIFOInventory.findOne({
                    branchId: branchId,
                    locationId: location._id,
                    productId: arg.productId
                }, {sort: {_id: -1}});
                content.push({
                    locationId: location._id,
                    location: location.name,
                    inventory: inventory
                })
            });
        }
        data.content = content;

        return data
    }
});




