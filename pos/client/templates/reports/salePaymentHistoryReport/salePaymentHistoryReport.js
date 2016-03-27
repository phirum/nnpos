Session.set('branchIds', null);
Template.pos_salePaymentHistoryReport.onRendered(function () {
});
Template.pos_salePaymentHistoryReport.events({
});

Template.pos_salePaymentHistoryReportGen.helpers({
    options: function () {
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
        var call = Meteor.callAsync(callId, 'posSalePaymentHistoryReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});



