Session.set('branchIds', null);
Template.pos_owesSupplierReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
});

Template.pos_owesSupplierReport.events({
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

Template.pos_owesSupplierReportGen.helpers({
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
        var call = Meteor.callAsync(callId, 'posOwesSupplierReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});




