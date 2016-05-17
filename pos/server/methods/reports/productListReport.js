Meteor.methods({
    posProductListReport: function (arg) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };
        var params = {};
        var categoryId = arg.categoryId;
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();

        var header = {};
        var branchNames = "";
        var category = "All";
        if (categoryId != null && categoryId != "") {
            category = Pos.Collection.Categories.findOne(categoryId).name;
            var categoryIds = getCategoryIdAndChildrenIds(categoryId, [categoryId]);
            params.categoryId = {$in: categoryIds};
        }
        header.category = category;
        /****** Header *****/
        data.header = header;
        var content = [];
        var products = Pos.Collection.Products.find(
            params,
            {sort: {'_category.name': 1}}
        );
        var i = 1;
        products.forEach(function (product) {
            product.order = i;
            i++;
            content.push(product);
        });

        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});
function getCategoryIdAndChildrenIds(id, arr) {
    var categories = Pos.Collection.Categories.find({parentId: id});
    if (categories != null) {
        categories.forEach(function (cat) {
            arr.push(cat._id);
            return getCategoryIdAndChildrenIds(cat._id, arr);
        });
    }
    return arr;
}

