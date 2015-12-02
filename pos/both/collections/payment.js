Pos.Collection.Payments = new Mongo.Collection("pos_payments");
Pos.Schema.Payments = new SimpleSchema({
    customerId: {
        type: String,
        label: "Customer",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.customerList();
            }
        }
    },
    supplierId: {
        type: String,
        label: "Supplier",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.supplierList();
            }
        }
    },
    saleId: {
        type: String,
        label: "SaleId",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.saleList()
            }
        }
    },
    purchaseId: {
        type: String,
        label: "PurchaseId",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.purchaseList()
            }
        }
    },
    paymentDate: {
        type: String,
        label: "Payment Date"
    },
    /*createdAt: {
     type: Date,
     label: "Created Date",
     autoValue: function () {
     if (this.isInsert)
     return new Date;
     },
     denyUpdate: true,
     optional: true
     },
     updatedAt: {
     type: Date,
     label: "Updated Date",
     autoValue: function () {
     return new Date();
     },
     optional: true
     },
     createdUserId: {
     type: String,
     label: "Created by",
     autoValue: function () {
     if (this.isInsert)
     return Meteor.user()._id;
     },
     denyUpdate: true,
     optional: true
     },
     updatedUserId: {
     type: String,
     label: "Updated by",
     autoValue: function () {
     return Meteor.user()._id;
     },
     optional: true
     }*/
});
//Pos.Collection.Payments.attachSchema(Pos.Schema.Payments);
