Pos.Collection.Sales.cacheTimestamp();
Pos.Collection.Sales.cacheCount('paymentCount', Pos.Collection.Payments, 'saleId');
Pos.Collection.Sales.cacheCount('saleDetailCount', Pos.Collection.SaleDetails, 'saleId');
Pos.Collection.Sales.cacheDoc('staff',Pos.Collection.Staffs,['name']);
Pos.Collection.Sales.cacheDoc('exchangeRate',Pos.Collection.ExchangeRates,['base','rates']);
Pos.Collection.Sales.cacheDoc('customer',Pos.Collection.Customers,['name']);
Pos.Collection.Sales.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);
