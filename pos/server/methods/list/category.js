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
        //label: Spacebars.SafeString(str + obj.name),
        label: str + obj.name,
        value: obj._id
    })
    ;
    return array;
};

var getCategoryList = function (selector, array, categories, alreadyUse) {
    if (categories != null) {
        categories.forEach(function (c) {
            array = pushToList(array, c);
            /* var str = "";
             for (var i = 0; i < c.level * 3; i++) {
             str += "&nbsp;";
             }
             array.push({
             label: Spacebars.SafeString(str + (c.level + 1) + '. ' + c.name),
             value: c._id
             });*/
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
    categoryList: function (param, categoryId) {
        var list = [];
        if (param != false) {
            var label = param != null ? param : "(Select One)";
            list.push({label: label, value: ""});
        }
        var selector = {};
        if (categoryId != null) {
            var arr = [categoryId];
            var categories = Pos.Collection.Categories.find({parentId: categoryId});
            arr = getCategoryIdsForExclusion(arr, categories);
            selector._id = {$not: {$in: arr}};
        }

        var alreadyUse = [];
        Pos.Collection.Categories.find(selector, {sort: {level: 1}}).forEach(function (obj) {
            if (alreadyUse.indexOf(obj._id) == -1) {
                debugger;
                pushToList(list, obj);
                selector.parentId = obj._id;
                var categories = Pos.Collection.Categories.find(selector);
                list = getCategoryList(selector, list, categories, alreadyUse);
            }
            /*var str = "";
             for (var i = 0; i < obj.level * 3; i++) {
             str += "&nbsp;";
             }
             list.push({
             label: Spacebars.SafeString(str + (obj.level + 1) + '. ' + obj.name),
             value: obj._id
             });*/
        });
        return list;
    }
});