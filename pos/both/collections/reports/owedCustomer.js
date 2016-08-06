/**
 * Schema
 */
Pos.Schema.OwedCustomerReport = new SimpleSchema({
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
        optional:true
    },
    customerId:{
        type:String,
        label:"Customer",
        autoform: {
            type: "select2",
            options:function(){
                return Pos.List.customer();
            }
        },
        optional:true

    },
    date: {
        type: String,
        label: "Date"
    },
    /*staffId:{
        type:String,
        label:"Staff",
        autoform: {
            type: "select2",
            options:function(){
                return Pos.List.staff();
            }
        },
        optional:true
    },*/
    branch:{
        type:String,
        label:"Branch",
        autoform: {
            type: "select2",
            options:function(){
                return Pos.List.branchForUser();
            }
        },
        optional:true
    }
});