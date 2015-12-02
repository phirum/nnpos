Pos.TabularTable.PromotionQuantities = new Tabular.Table({
    name: "posPromotionQuantityList",
    collection: Pos.Collection.PromotionQuantities,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_promotionQtyAction
        },
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {
            data: "startDate", title: "Start Date",
            render: function (val, type, doc) {
                return moment(val).format('MMMM DD, YYYY');
            }
        },
        {
            data: "endDate", title: "End Date",
            render: function (val, type, doc) {
                return moment(val).format('MMMM DD, YYYY');
            }
        },
        {data: "startTime", title: "Start Time"},
        {data: "endTime", title: "End Time"},
        // {data: "purchasePrice", title: "Pur.Price"},
        {data: "_product.name", title: "Product"},
        {data: "quantity", title: "Quantity"},
        // {data: "promotionItem", title: "Promotion Item"},

        {data: "description", title: "Description"}
    ],
    order: [['1', 'desc']],
    extraFields:['promotionItems'],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});