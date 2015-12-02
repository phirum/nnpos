Pos.TabularTable.PromotionPercentages = new Tabular.Table({
    name: "posPromotionPercentageList",
    collection: Pos.Collection.PromotionPercentages,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_promotionPercentageAction
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
        {data: "percentage", title: "Discount(%)"},
        // {data: "promotionItem", title: "Promotion Item"},

        {data: "description", title: "Description"}
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});