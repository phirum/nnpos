/**
 * Schema
 */
Pos.Schema.CustomerListReport = new SimpleSchema({
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