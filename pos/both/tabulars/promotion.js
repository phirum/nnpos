Pos.TabularTable.Promotions = new Tabular.Table({
    name: "posPromotionList",
    collection: Pos.Collection.Promotions,
    columns: [
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "startDate", title: "Start Date"},
        {data: "endDate", title: "End Date"},
        // {data: "purchasePrice", title: "Pur.Price"},
        {data: "productId", title: "Product Id"},
        {data: "quantity", title: "Quantity"},
       // {data: "promotionItem", title: "Promotion Item"},
        {data: "description", title: "Description"},

        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_promotionAction
        }
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 7}
    ]
});