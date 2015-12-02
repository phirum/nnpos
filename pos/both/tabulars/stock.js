Pos.TabularTable.Stocks = new Tabular.Table({
    name: "posStockList",
    collection: Pos.Collection.Products,
    columns: [
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "barcode", title: "Barcode"},
        {data: "retailPrice", title: "Re.Price"},
        {data: "wholesalePrice", title: "Who.Price"},
        {data: "purchasePrice", title: "Pur.Price"},
        {data: "status", title: "Status"},
        {
            data: "_id", title: "Quantity in Stock",
            render: function (val, type, doc) {
                var branchId = Session.get('currentBranch');
                var stock = Pos.Collection.Stocks.findOne({productId: val,branchId:branchId});
                return stock != null ? stock.quantity : 0;
            }
        }
        /*
         ,{
         title: '<i class="fa fa-bars"></i>',
         tmpl: Meteor.isClient && Template.pos_productAction
         }*/
    ],
    order: [['0', 'desc']]
    /*,
     columnDefs: [
     {"width": "12px", "targets": 10}
     ]*/
});
