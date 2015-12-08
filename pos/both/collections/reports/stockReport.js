/**
 * Schema
 */
Pos.Schema.StockReport = new SimpleSchema({
    date: {
        type: String,
        label: "Date"
    },
    locationId: {
        type: String,
        label: "Location",
        autoform: {
            type: "select2",
            options:function(){
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
            options: function () {
                return Pos.List.category("All");
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
                return Cpanel.List.branchForUser();
            }
        }
    }
    //quantity:{
    //    type:Number,
    //    label:"Quantity Less Than This"
    //}
});