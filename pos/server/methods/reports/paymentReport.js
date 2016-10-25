Meteor.methods({
    posPaymentReport: function (arg) {
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
        var date = arg.date.split(" To ");
        var fromDate = moment(date[0] + " 00:00:00").toDate();
        var toDate = moment(date[1] + " 23:59:59").toDate();
        var customerId = arg.customerId;
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var locationId = arg.locationId;
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
        var staff = "All", customer = "All", location = "All", status = "All";
        if (fromDate != null && toDate != null) params.saleDate = {$gte: fromDate, $lte: toDate};
        if (customerId != null && customerId != "") {
            params.customerId = customerId;
            customer = Pos.Collection.Customers.findOne(customerId).name;
        }
        if (staffId != null && staffId != "") {
            params.staffId = staffId;
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        }
        if (locationId != null && locationId != "") {
            params.locationId = locationId;
            location = Pos.Collection.Locations.findOne(locationId).name;
        }
        params.branchId = {$in: branchIds};
        if (arg.status != null && arg.status != "") {
            params.status = arg.status;
            status = arg.status;
        } else {
            params.status = {$ne: "Unsaved"};
        }
        //params.status = {$ne: "Unsaved"};
        params.transactionType = arg.transactionType;
        //params.transactionType = "Sale";
        //params.status = "Owed";
        var sale = Pos.Collection.Sales.find(params, {sort: {saleDate: 1}});

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.location = location;
        header.staff = staff;
        header.customer = customer;
        header.transactionType = arg.transactionType;
        header.status = status;

        /****** Header *****/
        data.header = header;
        var payment = Pos.Collection.Payments.find({saleId: {$in: saleId}});
        var content = calculateSaleHelper(sale);

        //return reportHelper;
        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});





