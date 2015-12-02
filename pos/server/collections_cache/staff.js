Pos.Collection.Staffs.cacheTimestamp();
Pos.Collection.Staffs.cacheCount('saleCount', Pos.Collection.Sales, 'staffId');
Pos.Collection.Staffs.cacheCount('purchaseCount', Pos.Collection.Purchases, 'staffId');
Pos.Collection.Staffs.cacheCount('adjustmentCount', Pos.Collection.Adjustments, 'staffId');
Pos.Collection.Staffs.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);