Pos.TabularTable.StockHistories = new Tabular.Table({
    name: "posStockHistoryList",
    collection: Pos.Collection.StockHistories,
    columns: [
        {data: "_id", title: "ID"},
        {
            data: "createdAt", title: "created At",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD HH:mm');
            }
        }

        /*, {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_endOfProcessAction
        }*/
    ],
    order: [['0', 'desc']]
    /*,
     columnDefs: [
     {"width": "12px", "targets": 10}
     ]*/
});
