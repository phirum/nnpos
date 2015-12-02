Pos.TabularTable.Staffs = new Tabular.Table({
    name: "posStaffList",
    collection: Pos.Collection.Staffs,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_staffAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {
            data: "startDate", title: "Started Date",
            render: function (val, type, doc) {
            return moment(val).format('MMMM DD, YYYY');
            }
        },
        {data: "gender", title: "Gender"},
        {data: "position", title: "Position"},
        {data: "salary", title: "Salary"},
        {data: "phone", title: "Phone"},
        {data: "address", title: "Address"},
        {data: "status", title: "Status"},
        {
            data: "_saleCount", title: "Has Sold",
            render: function (val, type, doc) {
                return val == null ? 0 : val;
            }
        },
        {
            data: "_purchaseCount", title: "Has Bought",
            render: function (val, type, doc) {
                return val == null ? 0 : val;
            }
        }

    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});
