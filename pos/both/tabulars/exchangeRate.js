Pos.TabularTable.ExchangeRates = new Tabular.Table({
    name: "exchangeRateList",
    collection: Pos.Collection.ExchangeRates,
    columns: [
        {data: "_id", title: "ID"},
        {data: "base", title: "Base Currency"},
        {
            data: "rates", title: "Exchange to",
            render: function (val,type,doc) {
                var str="";
                val.forEach(function(obj){
                    str+=obj.toCurrencyId+'='+obj.rate+", ";
                });
                return str;
            }
        }

    ],
    order: [['0', 'desc']]
    /*columnDefs: [
        {"width": "12px", "targets": 3}
    ]*/
});