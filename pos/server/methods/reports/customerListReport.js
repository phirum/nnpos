Meteor.methods({
    posCustomerListReport: function (arg) {
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
        var branchId = arg.branch;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();
        var customerLocation = "All";
        params.branchId = {$in: branchIds};

        if (arg.customerLocationId != null && arg.customerLocationId != "") {
            params.customerLocationId = arg.customerLocationId;
            customerLocation = Pos.Collection.CustomerLocations.findOne(arg.customerLocationId).name;
        }

        var customerList = Pos.Collection.Customers.find(params);

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.customerLocation = customerLocation;
        header.branch = branchNames.substr(0, branchNames.length - 2);
        /****** Header *****/
        data.header = header;
        var content = customerList.fetch();
        //return reportHelper;
        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});


