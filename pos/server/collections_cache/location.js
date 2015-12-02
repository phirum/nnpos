Pos.Collection.Locations.cacheTimestamp();
Pos.Collection.Locations.cacheCount('saleCount', Pos.Collection.Sales, 'locationId');
Pos.Collection.Locations.cacheCount('purchaseCount', Pos.Collection.Purchases, 'locationId');
Pos.Collection.Locations.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);