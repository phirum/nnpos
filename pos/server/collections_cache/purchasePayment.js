Pos.Collection.PurchasePayments.cacheTimestamp();
Pos.Collection.PurchasePayments.cacheDoc('purchase', Pos.Collection.Purchases, ['_supplier', 'total']);
Pos.Collection.PurchasePayments.cacheDoc('branch', Cpanel.Collection.Branch, ['khName', 'enName']);