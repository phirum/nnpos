Pos.Schema.LocationTransferDetailReport = new SimpleSchema({
    fromLocationId: {
        type: String,
        label: "From Location",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.ListForReport.locations();
            }
        },
        optional: true
    },
    toLocationId: {
        type: String,
        label: "To Location",
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
    /*status: {
        type: String,
        label: "Status",
        autoform: {
            type: "select2",
            options: function () {
                return [
                    {value: '', label: 'All'},
                    {value: 'Unsaved', label: 'Unsaved'},
                    {value: 'Saved', label: 'Saved'}
                ]
            }
        },
        optional:true
    }*/
});