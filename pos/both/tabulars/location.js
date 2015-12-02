Pos.TabularTable.Locations = new Tabular.Table({
    name: "posLocationList",
    collection: Pos.Collection.Locations,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_locationAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "abbreviation", title: "Abbreviation"},
        {data: "description", title: "Description"}
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});