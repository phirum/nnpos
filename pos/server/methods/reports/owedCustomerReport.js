Meteor.methods({
    posOwedCustomerReport: function (arg) {
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        var params = {};
        var date = moment(arg.date + " 23:59:59").toDate();
        var customerId = arg.customerId;
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
        if (customerId != null && customerId != "") params.customerId = customerId;
        // if (staffId != null && staffId != "") params.staffId = staffId;
        params.branchId = {$in: branchIds};
        params.status = "Owed";
        params.saleDate = {$lte: date};
        data.title = Cpanel.Collection.Company.findOne();
        var header = {};
        var branchNames = "";
        branchIds.forEach(function (id) {
            branchNames += Cpanel.Collection.Branch.findOne(id).enName + ", ";
        });
        header.branch = branchNames.substr(0, branchNames.length - 2);
        header.date = arg.date;
        var customer = "All";
        if (customerId != null && customerId != "")
            customer = Pos.Collection.Customers.findOne(customerId).name;
        header.customer = customer;
        data.header = header;

        var content=[];
        var sales = Pos.Collection.Sales.find(params);
        var i=1;
        sales.forEach(function(s){
            s.saleDate=moment(s.saleDate).format("DD-MM-YYYY HH:mm:ss");
            s.order=i;
            i++;
            content.push(s);
        });
        /*var payments = [];
         var sale = Pos.Collection.Sales.find(params);
         if (sale != null) {
         var i = 1;
         sale.forEach(function (obj) {
         debugger;
         var payment = Pos.Collection.Payments.findOne({
         saleId: obj._id,
         paymentDate: {$lte: date}
         },
         {
         sort: {_id: -1}
         }
         );
         if (payment != null && payment.balanceAmount > 0) {
         var customerName = Pos.Collection.Customers.findOne(obj.customerId).name;
         payments.push({
         order: i,
         paymentDate: moment(payment.paymentDate).format("DD-MM-YYYY"),
         balanceAmount: payment.balanceAmount,
         customerName: customerName,
         saleId: obj._id
         });
         i++;
         }

         });
         }*/
        /****** Header *****/
        if (content.length > 0) {
            data.content = content;
        }
        return data;
    }
});
