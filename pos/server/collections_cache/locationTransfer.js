Pos.Collection.LocationTransfers.cacheTimestamp();
Pos.Collection.LocationTransfers.cacheCount('locationTransferDetailCount', Pos.Collection.LocationTransferDetails, 'locationTransferId');
Pos.Collection.LocationTransfers.cacheDoc('staff', Pos.Collection.Staffs, ['name']);
Pos.Collection.LocationTransfers.cacheDoc('fromLocation', Pos.Collection.Locations, ['name'], 'fromLocationId');
Pos.Collection.LocationTransfers.cacheDoc('toLocation', Pos.Collection.Locations, ['name'], 'toLocationId');
Pos.Collection.LocationTransfers.cacheDoc('branch', Cpanel.Collection.Branch, ['khName', 'enName']);
