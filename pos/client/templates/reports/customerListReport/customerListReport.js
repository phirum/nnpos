Session.set('branchIds', null);
Template.pos_customerListReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});
Template.pos_customerListReport.events({
    'change [name="customerLocationId"]': function (e) {
        Session.set('customerLocationId', $(e.currentTarget).val());
    },
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

Template.pos_customerListReportGen.helpers({
    getGrandTotalConvert:function(obj,key){
      return obj[key];
    },
    multiply: function (val1, val2, id) {
        var value = (val1 * val2);
        if (id != null && id == "KHR") {
            value = roundRielCurrency(value);
            return numeral(value).format('0,0.00');
        }
        return numeral(value).format('0,0.00');
    },
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
        var call = Meteor.callAsync(callId, 'posCustomerListReport', q);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});



