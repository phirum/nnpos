Pos.Collection.SaleDetails.cacheTimestamp();
Pos.Collection.SaleDetails.cacheDoc('product', Pos.Collection.Products, ['name','barcode', '_unit', '_category']);
Pos.Collection.SaleDetails.cacheDoc('location', Pos.Collection.Locations, ['name']);
Pos.Collection.SaleDetails.cacheDoc('branch', Cpanel.Collection.Branch, ['khName', 'enName']);