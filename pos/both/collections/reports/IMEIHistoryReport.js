/**
 * Schema
 */
Pos.Schema.IMEIHistoryReport = new SimpleSchema({
    imei: {
        type: String,
        label: "IMEI"
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