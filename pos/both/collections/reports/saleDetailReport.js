/**
 * Schema
 */
Pos.Schema.SaleDetailReport = new SimpleSchema({
    customerLocationId: {
        type: String,
        optional: true,
        label: "Customer Location",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.customerLocations();
            }
        }
    },
    locationId: {
        type: String,
        label: "Location",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.ListForReport.locations();
            }
        },
        optional: true
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
        optional: true
    },
    customerId: {
        type: String,
        label: "Customer",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.customer();
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
                    {value: 'Sale', label: 'Sale'},
                    {value: 'AdjustmentQtyDown', label: 'AdjustmentQtyDown'}
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
        optional: true
    },
    itemType: {
        type: String,
        label: "Item Type",
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return [
                    {value: '', label: 'All'},
                    {value: 'true', label: 'Promotion'},
                    {value: 'false', label: 'No-Promotion'}
                ]
            }
        }
    }
});