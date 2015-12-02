Pos.Collection.Products.cacheTimestamp();
Pos.Collection.Products.cacheCount('saleDetailCount', Pos.Collection.SaleDetails, 'productId');
Pos.Collection.Products.cacheCount('purchaseDetailCount', Pos.Collection.PurchaseDetails, 'productId');
Pos.Collection.Products.cacheCount('adjustmentDetailCount', Pos.Collection.AdjustmentDetails, 'productId');
Pos.Collection.Products.cacheDoc('unit',Pos.Collection.Units,['name']);
Pos.Collection.Products.cacheDoc('category',Pos.Collection.Categories,['name']);