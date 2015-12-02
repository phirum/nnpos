Pos.Collection.ExchangeRates.cacheTimestamp();
Pos.Collection.ExchangeRates.cacheCount('saleCount', Pos.Collection.Sales, 'exchangeRateId');
Pos.Collection.ExchangeRates.cacheCount('purchaseCount', Pos.Collection.Purchases, 'exchangeRateId');
Pos.Collection.ExchangeRates.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);