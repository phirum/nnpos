Pos.TabularTable.Categories = new Tabular.Table({
    name: "posCategoryList",
    collection: Pos.Collection.Categories,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_categoryAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "_parent.name", title: "Parent"},
        {data: "description", title: "Description"},
        {
            data: "_categoryCount", title: "Children",
            render: function (val, type, doc) {
                return val == null ? 0 : val;
            }
        },
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