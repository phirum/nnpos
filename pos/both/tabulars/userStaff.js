Pos.TabularTable.UserStaffs = new Tabular.Table({
    name: "posUserStaffList",
    collection: Pos.Collection.UserStaffs,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_userStaffAction
        },
        {data: "_id", title: "ID"},
        {data: "_user.username", title: "Username"},
        {
            data: "staffIds", title: "Staffs",
            render: function (val, type, doc) {
                var str="";
                val.forEach(function(id){
                    str+=Pos.Collection.Staffs.findOne(id).name+", ";
                });
                return str.substr(0,str.length-2);
            }
        },
        {data: "_branch.enName", title: "Branch"}
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    pagingType: "full_numbers",
    autoWidth: false
});