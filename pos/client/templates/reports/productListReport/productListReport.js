Template.pos_productListReport.helpers({
    categoryList: function () {
        var categories;
        var list = [];
        categories = ReactiveMethod.call('categoryList', 'All', null);
        categories.forEach(function (category) {
            list.push({
                label: Spacebars.SafeString(category.label),
                value: category.value
            });
        });
        return list;
    }
});
Template.pos_productListReport.events({});
Template.pos_productListReportGen.helpers({
    options: function () {
        return {
            //fontSize: 'bg',
            paper: 'a4',
            orientation: 'portrait'
        };
    },
    data: function () {
        var q = FlowRouter.current().queryParams;
        var callId = JSON.stringify(q);
        var call = Meteor.callAsync(callId, 'posProductListReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});

