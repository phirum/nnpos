Pos.Collection.FIFOInventory.cacheTimestamp();
Pos.Collection.FIFOInventory.cacheDoc('product',Pos.Collection.Products,['name','_unit','_category']);
Pos.Collection.FIFOInventory.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);
Pos.Collection.FIFOInventory.cacheDoc('location',Pos.Collection.Locations,['name']);