/**
 * Schema
 */
Pos.Schema.OwesSupplierReport = new SimpleSchema({
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
    supplierId:{
        type:String,
        label:"Supplier",
        autoform: {
            type: "select2",
            options:function(){
                return Pos.List.supplier();
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