Pos.Collection.Customers.cacheTimestamp();
Pos.Collection.Customers.cacheCount('saleCount', Pos.Collection.Sales, 'customerId');
Pos.Collection.Customers.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);