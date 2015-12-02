Pos.Collection.Suppliers.cacheTimestamp();
Pos.Collection.Suppliers.cacheCount('purchaseCount', Pos.Collection.Purchases, 'supplierId');
Pos.Collection.Suppliers.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);