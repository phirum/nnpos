/**
 * Schema
 */
Pos.Schema.SaleDetailReport = new SimpleSchema({
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

    staffId:{
        type:String,
        label:"Staff",
        autoform: {
            type: "select2",
            options:function(){
                return Pos.List.staff();
            }
        },
        optional:true
    },
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