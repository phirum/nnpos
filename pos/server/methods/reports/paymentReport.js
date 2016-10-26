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
        var staff = "All", customer = "All", status = "All";
        if (fromDate != null && toDate != null) params.paymentDate = {$gte: fromDate, $lte: toDate};
        if (customerId != null && customerId != "") {
            params.customerId = customerId;
            customer = Pos.Collection.Customers.findOne(customerId).name;
        }
        if (staffId != null && staffId != "") {
            params.staffId = staffId;
            staff = Pos.Collection.Staffs.findOne(staffId).name;
        }
        params.branchId = {$in: branchIds};

        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        header.staff = staff;
        header.customer = customer;

        /****** Header *****/
        data.header = header;
        var content = [];
        var payments = Pos.Collection.Payments.find(params);
        var i = 1;
        var total = 0;
        payments.forEach(function (payment) {
            payment.paymentDate = moment(payment.paymentDate).format('DD-MM-YYYY');
            payment.order = i;
            total += payment.payAmount;
            i++;
            content.push(payment);
        });
        data.totalPaid = total;
        //return reportHelper;
        /****** Content *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});





