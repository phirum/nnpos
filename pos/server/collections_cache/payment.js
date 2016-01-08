Pos.Collection.Payments.cacheTimestamp();
Pos.Collection.Payments.cacheDoc('sale',Pos.Collection.Sales,['_customer','total']);
Pos.Collection.Payments.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);