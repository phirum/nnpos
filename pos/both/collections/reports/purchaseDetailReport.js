/**
 * Schema
 */
Pos.Schema.PurchaseDetailReport = new SimpleSchema({
    supplierId: {
        type: String,
        label: "Supplier",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.supplier();
            }
        },
        optional: true
    },
    date: {
        type: String,
        label: "Date"
    },

    staffId: {
        type: String,
        label: "Staff",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.staff();
            }
        },
        optional: true
    },
    branch: {
        type: String,
        label: "Branch",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.branchForUser();
            }
        },
        optional: true
    }
});