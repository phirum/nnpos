Pos.TabularTable.ExchangeRates = new Tabular.Table({
    name: "exchangeRateList",
    collection: Pos.Collection.ExchangeRates,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_exchangeRateAction
        },
        {data: "_id", title: "ID"},
        {data: "base", title: "Base Currency"},
        {
            data: "rates", title: "Exchange to",
            render: function (val, type, doc) {
                var str = "";
                val.forEach(function (obj) {
                    str += obj.toCurrencyId + '=' + obj.rate + obj.symbol + ", ";
                });
                return str;
            }
        }
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ]
});