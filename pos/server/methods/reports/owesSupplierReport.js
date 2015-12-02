Meteor.methods({
    posOwesSupplierReport: function (arg) {
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };
        var params = {};
        var date = moment(arg.date + " 23:59:59").toDate();
        var supplierId = arg.supplierId;
        //var staffId = arg.staffId;
        var branchId = arg.branch;
        var branchIds = [];
        if (branchId == "" || branchId == null) {
            //var userId = Meteor.userId();
            var userId = this.userId;
            branchIds = Meteor.users.findOne(userId).rolesBranch;
        } else {
            branchIds.push(branchId);
        }
        //if (date != null) params.paymentDate = {$lte: date};
        if (supplierId != null && supplierId != "") params.supplierId = supplierId;
        // if (staffId != null && staffId != "") params.staffId = staffId;
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
        var supplier = "All";
        if (supplierId != null && supplierId != "")
            supplier = Pos.Collection.Suppliers.findOne(supplierId).name;
        header.supplier = supplier;
        data.header = header;

        var content=[];
        var purchases = Pos.Collection.Purchases.find(params);
        var i=1;
        purchases.forEach(function(s){
            s.purchaseDate=moment(s.purchaseDate).format("DD-MM-YYYY HH:mm:ss");
            s.order=i;
            i++;
            content.push(s);
        });
        /****** Header *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});
