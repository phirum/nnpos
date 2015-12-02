// Location
Sample.TabularTable.Location = new Tabular.Table({
    name: "sample_locationList",
    collection: Sample.Collection.Location,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.sample_locationAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "_customerCount", title: "Customer Count"}
    ]
});