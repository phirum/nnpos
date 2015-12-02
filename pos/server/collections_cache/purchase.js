Pos.Collection.Purchases.cacheTimestamp();
Pos.Collection.Purchases.cacheCount('paymentCount', Pos.Collection.Payments, 'purchaseId');
Pos.Collection.Purchases.cacheCount('purchaseDetailCount', Pos.Collection.PurchaseDetails, 'purchaseId');
Pos.Collection.Purchases.cacheDoc('staff',Pos.Collection.Staffs,['name']);
Pos.Collection.Purchases.cacheDoc('exchangeRate',Pos.Collection.ExchangeRates,['base','rates']);
Pos.Collection.Purchases.cacheDoc('supplier',Pos.Collection.Suppliers,['name']);
Pos.Collection.Purchases.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);
