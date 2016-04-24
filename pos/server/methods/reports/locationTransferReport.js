Meteor.methods({
    posLocationTransferReport: function (arg) {
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
        var staffId = arg.staffId;
        var branchId = arg.branch;
        var fromLocationId = arg.fromLocationId;
        var toLocationId = arg.toLocationId;
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
        var staff = "All", customer = "All", fromLocation = "All", toLocation = "All", status = "All";
        if (fromDate != null && toDate != null) params.locationTransferDate = {$gte: fromDate, $lte: toDate};
        if (staffId != null && staffId != "") {
            params.staffId = staffId;
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        }
        if (fromLocationId != null && fromLocationId != "") {
            params.fromLocationId = fromLocationId;
            fromLocation = Pos.Collection.Locations.findOne(fromLocationId).name;
        }
        if (toLocationId != null && toLocationId != "") {
            params.toLocationId = toLocationId;
            toLocation = Pos.Collection.Locations.findOne(toLocationId).name;
        }
        params.branchId = {$in: branchIds};
        params.status = "Saved";
        var locationTransfers = Pos.Collection.LocationTransfers.find(params);

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.fromLocation = fromLocation;
        header.toLocation = toLocation;
        header.staff = staff;

        /****** Header *****/
        data.header = header;
        var content = [];
        var i = 1;
        locationTransfers.forEach(function (locationTransfer) {
            locationTransfer.locationTransferDate = moment(locationTransfer.locationTransferDate).format('DD-MM-YYYY HH:mm:ss');
            locationTransfer.staff = locationTransfer._staff.name;
            locationTransfer.order = i;
            i++;
            content.push(locationTransfer);
        });

        //return reportHelper;
        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});


