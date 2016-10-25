/**
 * Schema
 */
Pos.Schema.PaymentReport = new SimpleSchema({
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
                    {value: 'Payment', label: 'Payment'},
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
        optional:true
    }
});