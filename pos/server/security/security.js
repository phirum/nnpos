/*
 Pos.Collection.Customers.permit(['insert', 'update', 'remove'])
 .posIsGeneral()
 .apply();
 */

Security.permit(['insert', 'update', 'remove']).collections([
    Pos.Collection.Categories,
    Pos.Collection.SubCategories,
    Pos.Collection.Units,
    Pos.Collection.Staffs,
    Pos.Collection.Customers,
    Pos.Collection.Suppliers,
    Pos.Collection.Products,
    Pos.Collection.Sales,
    Pos.Collection.SaleDetails,
    Pos.Collection.Payments,
    Pos.Collection.Purchases,
    Pos.Collection.PurchaseDetails,
    Pos.Collection.Stocks,
    Pos.Collection.ExchangeRates,
    Pos.Collection.StockHistories,
    Pos.Collection.UserStaffs,
    Pos.Collection.Adjustments,
    Pos.Collection.AdjustmentDetails,
    Pos.Collection.PromotionPercentages,
    Pos.Collection.PromotionQuantities,
    Pos.Collection.PromotionTotalAmounts,
    Pos.Collection.FIFOInventory,
    Pos.Collection.LIFOInventory,
    Pos.Collection.AverageInventory,
    Pos.Collection.Locations,
    Pos.Collection.LocationSettings,
    Pos.Collection.LocationTransfers,
    Pos.Collection.LocationTransferDetails
]).posIsAdmin().apply();

Security.permit(['insert', 'update', 'remove']).collections([
    Pos.Collection.Customers,
    Pos.Collection.Sales,
    Pos.Collection.SaleDetails,
    Pos.Collection.Payments,
    Pos.Collection.Stocks,
    Pos.Collection.FIFOInventory,
    Pos.Collection.LIFOInventory,
    Pos.Collection.AverageInventory
]).posIsSeller().apply();


/*
 Pos.Collection.Purchases.allow({
 insert: function (userId, doc) {
 // the user must be logged in, and the document must be owned by the user
 //  return (userId && doc.owner === userId);
 return userId && Roles.userIsInRole(userId, ['general'], 'Pos');
 },
 update: function (userId, doc, fields, modifier) {
 // can only change your own documents
 //  return doc.owner === userId;
 return userId && Roles.userIsInRole(userId, ['general'], 'Pos');
 },
 remove: function (userId, doc) {
 // can only remove your own documents
 //  return doc.owner === userId;
 return userId && Roles.userIsInRole(userId, ['general'], 'Pos');
 }
 });
 Pos.Collection.PurchaseDetails.allow({
 insert: function (userId, doc) {
 return userId && Roles.userIsInRole(userId, ['general'], 'Pos');
 },
 update: function (userId, doc, fields, modifier) {
 return userId && Roles.userIsInRole(userId, ['general'], 'Pos');
 },
 remove: function (userId, doc) {
 return userId && Roles.userIsInRole(userId, ['general'], 'Pos');
 }
 });*/
/*Pos.Collection.Purchases.deny({
 insert: function (userId, doc) {
 return true;
 //  return userId && !Roles.userIsInRole(userId, ['seller'], 'Pos');
 },
 update: function (userId, doc, fields, modifier) {
 return true;
 // return userId && !Roles.userIsInRole(userId, ['seller'], 'Pos');
 },
 remove: function (userId, doc) {
 return true;
 // return userId && !Roles.userIsInRole(userId, ['seller'], 'Pos');
 }
 });

 Pos.Collection.PurchaseDetails.deny({
 insert: function (userId, doc) {
 return false;
 // console.log(userId);
 //  return userId && !Roles.userIsInRole(userId, ['seller'], 'Pos');
 },
 update: function (userId, doc, fields, modifier) {
 return true;
 //return userId && !Roles.userIsInRole(userId, ['seller'], 'Pos');
 },
 remove: function (userId, doc) {
 return true;
 //return userId && !Roles.userIsInRole(userId, ['seller'], 'Pos');
 }
 });
 */