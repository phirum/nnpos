Pos.TabularTable.Units = new Tabular.Table({
    name: "posUnitList",
    collection: Pos.Collection.Units,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_unitAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "description", title: "Description"},
        {
            data: "_productCount", title: "Products",
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