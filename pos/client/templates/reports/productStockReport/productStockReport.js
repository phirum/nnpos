Session.set('branchIds', null);
Template.pos_productStockReport.onRendered(function () {
    Meteor.typeahead.inject();
});
Template.pos_productStockReport.events({});
Template.pos_productStockReport.helpers({
    search: function (query, sync, callback) {
        Meteor.call('searchProduct', query, {}, function (err, res) {
            if (err) {
                console.log(err);
                return;
            }
            callback(res);
        });
    },
    selected: function (event, suggestion, dataSetName) {
        // event - the jQuery event object
        // suggestion - the suggestion object
        // datasetName - the name of the dataset the suggestion belongs to
        // TODO your event handler here
        var id = suggestion._id;
        $('#search-product-id').val(id);
        $('[name="search"]').typeahead('val', suggestion.name);
        //$('[name="search"]').select();
    }
});

Template.pos_productStockReportGen.helpers({
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
        var branchId = Session.get('currentBranch');
        var call = Meteor.callAsync(callId, 'posProductStockReport', q, branchId);
        if (!call.ready()) {
            return false;
        }
        return call.result();
    }
});



