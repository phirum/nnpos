Pos.TabularTable.SubCategories = new Tabular.Table({
    name: "posSubCategoryList",
    collection: Pos.Collection.SubCategories,
    columns: [
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {
            data: "categoryId", title: "Category",
            render: function (val, type, doc) {
                return Pos.Collection.Categories.findOne(val).name;
            }
        },
        {data: "description", title: "Description"},
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_subCategoryAction
        }
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 4}
    ]
});