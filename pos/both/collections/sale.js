Pos.Collection.Sales = new Mongo.Collection("pos_sales");

Pos.Schema.Sales = new SimpleSchema({
    voucher: {
        type: String,
        label: "Voucher",
        optional:true
    },
    saleDate: {
        type: Date,
        label: "Sale Date"
    },
    staffId: {
        type: String,
        label: "Staff"
        //regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    customerId: {
        type: String,
        label: "Customer"
    },
    status: {
        type: String,
        label: "Status"
    },
    description:{
        type:String,
        label:"Description",
        optional:true
    },
    exchangeRateId:{
        type:String,
        label:"Exchange Rate"
    },
    discount: {
        type: Number,
        label: "Discount",
        decimal: true
    },
    subTotal: {
        type: Number,
        label: "SubTotal",
        decimal: true
    },
    total: {
        type: Number,
        label: "Total",
        decimal: true
    },
    discountAmount:{
        type:Number,
        label:"Discount Amount",
        decimal:true
    },
    transactionType:{
        type:String,
        label:"Transaction Type"
    },
    branchId:{
        type:String,
        label:"Branch"
    },
    locationId:{
        type:String,
        label:"Location"
    },
    owedAmount: {
        type: Number,
        label: "Owed Amount",
        decimal: true,
        optional: true
    },
    totalCost: {
        type: Number,
        label: "total Cost",
        decimal: true,
        optional: true
    },
    isRetail:{
        type:Boolean,
        label:"Sale Type"
    }
});
Pos.Collection.Sales.attachSchema(Pos.Schema.Sales);

