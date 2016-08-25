/**
 * Schema
 */
Pos.Schema.PurchaseDetailReport = new SimpleSchema({
    locationId: {
        type: String,
        label: "Location",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.ListForReport.locations();
            }
        },
        optional:true
    },
    categoryId: {
        type: String,
        label: "Category",
        autoform: {
            type: "select2",
           /* options: function () {
                return Pos.List.category("All");
            }*/
        },
        optional:true
    },
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
    },
    transactionType: {
        type: String,
        label: "Transaction Type",
        autoform: {
            type: "select2",
            options: function () {
                return [
                    {value: '', label: '(Select One)'},
                    {value: 'Purchase', label: 'Purchase'},
                    {value: 'AdjustmentQtyUp', label: 'AdjustmentQtyUp'}
                ]
            }
        }
    },
    status: {
        type: String,
        label: "Status",
        autoform: {
            type: "select2",
            options: function () {
                return [
                    {value: '', label: 'All'},
                    {value: 'Owed', label: 'Owed'},
                    {value: 'Paid', label: 'Paid'}
                ]
            }
        },
        optional:true
    }
});