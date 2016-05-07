Meteor.methods({
    posProductStockReport: function (arg) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        var params = {saleId: arg.saleId};
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();
        var product = Pos.Collection.Products.findOne(productId);
        var inventory=Pos.Collection.FIFOInventory.findOne();
        if(product==null){
            
        }else{
            data.product=product;
            data.inventory=inventory;
        }
        var header = {};
        header.product = product.name;
        data.header = header;

        return data
    }
});




