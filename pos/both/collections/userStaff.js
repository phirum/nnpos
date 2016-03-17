Pos.Collection.UserStaffs = new Mongo.Collection("pos_userStaffs");
Pos.Schema.UserStaffs = new SimpleSchema({
    userId: {
        type: String,
        label: "User",
        autoform:{
            type:"select2",
            options:function(){
                return Pos.List.getUserByBranchId(true);
            }
        }
    },
    staffIds: {
        type: [String],
        label: "Staffs",
        autoform: {
            type: "select-multiple",
            options: function () {
                return Pos.List.getStaffListByBranchId(false);
            }
        }
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});
Pos.Collection.UserStaffs.attachSchema(Pos.Schema.UserStaffs);
