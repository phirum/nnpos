Session.set('branchIds', null);
Template.pos_locationTransferDetailReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});
Template.pos_locationTransferDetailReport.helpers({
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
Template.pos_locationTransferDetailReport.events({
    'change select[name="branch"]': function (e) {
        var branchId = $(e.currentTarget).val();
        if (branchId == "") {
            var userId = Meteor.userId();
            var branchIds = Meteor.users.findOne(userId).rolesBranch;
            Session.set('branchIds', branchIds);
        } else {
            var branchIds = [];
            branchIds.push(branchId);
            Session.set('branchIds', branchIds);
        }
    }
});

Template.pos_locationTransferDetailReportGen.helpers({
    getParents:function(parent){
        var st='';
        return getParents(st,parent);
    },
    options: function () {
        // font size = null (default), bg
        // paper = a4, a5, mini
        // orientation = portrait, landscape
        return {
            //fontSize: 'bg',
            paper: 'a4',
            orientation: 'portrait'
        };
    },
    data: function () {
        // Get query params
        //FlowRouter.watchPathChange();
        var q = FlowRouter.current().queryParams;

        var callId = JSON.stringify(q);
        var call = Meteor.callAsync(callId, 'posLocationTransferDetailReport', q);

        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});

