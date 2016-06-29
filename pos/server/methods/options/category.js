var getCategoryIdsForExclusion = function (array, categories) {
    if (categories != null) {
        categories.forEach(function (c) {
            array.push(c._id);
            var cats = Pos.Collection.Categories.find({parentId: c._id});
            if (cats != null) {
                return getCategoryIdsForExclusion(array, cats);
            }
        });
    }
    return array;
};
var pushToList = function (array, obj) {
    var str = "";
    for (var i = 0; i < obj.level * 3; i++) {
        str += "&nbsp;";
    }
    array.push({
        label: Spacebars.SafeString(str + obj.name),
        value: obj._id
    });
    return array;
};

var getCategoryList = function (selector, array, categories, alreadyUse) {
    if (categories != null) {
        categories.forEach(function (c) {
            array = pushToList(array, c);
            alreadyUse.push(c._id);
            selector.parentId = c._id;
            var cats = Pos.Collection.Categories.find(selector);
            if (cats != null) {
                return getCategoryList(selector, array, cats, alreadyUse);
            }
        });
    }
    return array;
};

Meteor.methods({
    getCategoryOptions: function (options) {
        this.unblock();
        var list = [], selector = {};
        var searchText = options.searchText;
        var values = options.values;
        var params = options.params || {};

        if (searchText) {
            selector = {
                $or: [
                    {_id: {$regex: searchText, $options: 'i'}},
                    {name: {$regex: searchText, $options: 'i'}}
                ]
            };
        } else if (values.length) {
            selector = {_id: {$in: values}};
        }

        var data = Pos.Collection.Categories.find(selector, {limit: 10});
        data.forEach(function (value) {
            var label = value._id + ' : ' + value.name;
            list.push({label: label, value: value._id});
        });
        return list;
    },
    /*getCategoryList: function () {
     Pos.Collection.Categories.aggregate([
     {$match: {_id: "01010101"}},
     {
     $lookup: {
     from: "loan_location",
     localField: "parentId",
     foreignField: "_id",
     as: "level1"
     }
     },
     {$unwind: {path: "$level1", preserveNullAndEmptyArrays: true}},
     {
     $lookup: {
     from: "loan_location",
     localField: "level1.parentId",
     foreignField: "_id",
     as: "level2"
     }
     },
     {$unwind: {path: "$level2", preserveNullAndEmptyArrays: true}},
     {
     $lookup: {
     from: "loan_location",
     localField: "level2.parentId",
     foreignField: "_id",
     as: "level3"
     }
     },
     {$unwind: {path: "$level3", preserveNullAndEmptyArrays: true}}
     ])
     }*/
});




