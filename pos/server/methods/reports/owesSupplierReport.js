Meteor.methods({
    posOwesSupplierReport: function (arg) {
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
        var date = moment(arg.date + " 23:59:59").toDate();
        var supplierId = arg.supplierId;
        var locationId = arg.locationId;
        var branchId = arg.branch;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        var supplier = "All", location = "All";
        //if (date != null) params.paymentDate = {$lte: date};
        if (supplierId != null && supplierId != "") {
            params.supplierId = supplierId;
            supplier = Pos.Collection.Suppliers.findOne(supplierId).name;
        }
        if (locationId != null && locationId != "") {
            params.locationId = locationId;
            location = Pos.Collection.Locations.findOne(locationId).name;
        }
        params.branchId = {$in: branchIds};
        params.status = "Owed";
        params.purchaseDate = {$lte: date};
        data.title = Cpanel.Collection.Company.findOne();
        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.location = location;
        header.supplier = supplier;
        data.header = header;

        var content = [];
        var purchases = Pos.Collection.Purchases.find(params);
        var i = 1;
        var totalOwed = 0;
        var total = 0;
        purchases.forEach(function (s) {
            s.purchaseDate = moment(s.purchaseDate).format("DD-MM-YYYY HH:mm:ss");
            s.order = i;
            total += s.total;
            totalOwed = s.owedAmount;
            i++;
            s.paidAmount = numeral(s.total - s.owedAmount).format('0,0.00');
            s.owedAmount = numeral(s.owedAmount).format('0,0.00');
            s.total = numeral(s.total).format('0,0.00');
            content.push(s);
        });
        data.totalPaid = numeral(total - totalOwed).format('0,0.00');
        data.totalOwed = numeral(totalOwed).format('0,0.00');
        data.total = numeral(total).format('0,0.00');
        /****** Header *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});
