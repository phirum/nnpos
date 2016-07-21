Pos.TabularTable.CustomerLocations = new Tabular.Table({
    name: "posCustomerLocationList",
    collection: Pos.Collection.CustomerLocations,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_customerLocationAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "description", title: "Description"}
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});