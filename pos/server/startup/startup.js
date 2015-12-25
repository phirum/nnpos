Meteor.startup(function () {
    Pos.Collection.Categories._ensureIndex({parentId:1});
    Pos.Collection.Staffs._ensureIndex({branchId:1,status:1});
    Pos.Collection.UserStaffs._ensureIndex({branchId:1,userId:1});
    Pos.Collection.Suppliers._ensureIndex({branchId:1});
    Pos.Collection.Products._ensureIndex({barcode:1,status:1,name:1,categoryId:1,productType:1});
    Pos.Collection.ExchangeRates._ensureIndex({branchId:1,base:1});
    Pos.Collection.Sales._ensureIndex({status: 1, branchId: 1,locationId:1,voucher:1,productId:1});
    Pos.Collection.SaleDetails._ensureIndex({isPromotion:1,productId:1,branchId: 1,totalCost:1,locationId:1,saleId:1});
    Pos.Collection.Purchases._ensureIndex({productId:1,branchId:1,locationId:1,status:1,totalCost:1});
    Pos.Collection.PurchaseDetails._ensureIndex({branchId:1,locationId:1,purchaseId:1,productId:1});
    Pos.Collection.Payments._ensureIndex({branchId:1,saleId:1,purchaseId:1});
    Pos.Collection.FIFOInventory._ensureIndex({branchId:1,locationId:1,productId:1,isSale:1});
    Pos.Collection.Locations._ensureIndex({branchId:1});
    Pos.Collection.LocationSettings._ensureIndex({branchId:1});
    Pos.Collection.LocationTransfers._ensureIndex({branchId:1,locationId:1,productId:1,status:1,fromLocationId:1,toLocationId:1});
    Pos.Collection.LocationTransferDetails._ensureIndex({branchId:1,productId:1,fromLocationId:1,toLocationId:1,locationTransferId:1});

    /*var categories = Pos.Collection.Categories.find();
     categories.forEach(function (c) {
     var count = Pos.Collection.Categories.find({parentId: c._id}).count();
     var productCount = Pos.Collection.Products.find({categoryId: c._id}).count();
     Pos.Collection.Categories.direct.update(c._id,
     {$set: {_categoryCount: count, _productCount: productCount}});

     });*/

    /* var funcInputObj={};
     var mongoFuncName='hi';
     MongoInternals.defaultRemoteCollectionDriver().mongo.db.eval('db.loadServerScripts();return ' + mongoFuncName+ '(' + JSON.stringify(funcInputObj|| {}) + ');',function (err, mongoFuncReturnData) {
     console.log(mongoFuncReturnData);
     });*/

    /* if (Players.find().count() === 0) {
     var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
     "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
     _.each(names, function (name) {
     Players.insert({
     name: name,
     score: Math.floor(Random.fraction() * 10) * 5
     });
     });
     }

     temporaryFiles.allow({
     insert: function (userId, file) {
     return true;
     },
     remove: function (userId, file) {
     return true;
     },
     read: function (userId, file) {
     return true;
     },
     write: function (userId, file, fields) {
     return true;
     }
     });*/
});
/*
 var jsZip = Meteor.npmRequire('jszip');
 var xmlBuilder = Meteor.npmRequire('xmlbuilder');
 var fastCsv = Meteor.npmRequire('fast-csv');
 //var JsonFile = Meteor.npmRequire('jsonfile');
 Meteor.methods({
 exportDataByBranchId: function (collections, fieldName, branch) {
 var zip = new jsZip();
 var selector = {};
 collections.forEach(function (c) {
 var cName = eval(c);
 var obj = {name: c};
 if (branch != 'All') {
 selector[fieldName] = branch;
 obj.branchIdValue = branch;
 obj.branchFieldName = fieldName;
 }
 debugger;
 var data = cName.find(selector);
 // if (data.count() > 0) {
 obj.data = data.fetch();
 obj = JSON.stringify(obj);
 var fileName = c.split('.')[c.split('.').length - 1] + '.json';
 zip.file(fileName, obj);
 //}
 });

 //var exportToJSON = function () {
 //    var pos = {
 //        branchId: "0001"
 //    };
 //    pos = JSON.stringify(pos);
 //    return zip.file('category.json', pos);
 //};
 //var testFolder = zip.folder('test');
 //var exportToCsv = function () {
 //    return fastCsv.writeToString(categories.fetch(), {headers: true}, function (error, data) {
 //            if (error) {
 //                console.log(error);
 //            } else {
 //                zip.file('categories.csv', data);
 //            }
 //        }
 //    )
 //};
 //var exportToXml = function () {
 //    var category = xmlBuilder.create('category');
 //
 //};
 //categories.forEach(function (c) {
 //    pos.categories.push(c);
 //});
 //subCategories.forEach(function (s) {
 //    pos.subCategories.push(s);
 //});
 //exportToCsv();

 //exportToJSON();
 return zip.generate({type: "base64"});


 },
 restoreOneCollection: function (str) {
 var obj = JSON.parse(str);
 var collectionName = eval(obj.name);
 var selector = {};
 if (obj.branchIdValue != null && obj.branchFieldName != null) {
 selector[obj.branchFieldName] = obj.branchIdValue;
 }
 collectionName.remove(selector);
 obj.data.forEach(function (val) {
 collectionName.insert(val);
 });
 },

 downloadExcelFile: function () {
 var Future = Npm.require('fibers/future');
 var futureResponse = new Future();

 var excel = new Excel('xlsx'); // Create an excel object  for the file you want (xlsx or xls)
 var workbook = excel.createWorkbook(); // Create a workbook (equivalent of an excel file)
 var worksheet = excel.createWorksheet(); // Create a worksheet to be added to the workbook
 worksheet.writeToCell(0, 0, 'Category Report'); // Example : writing to a cell
 worksheet.writeToCell(1, 0, 'Testing how to create excel report with meteor'); // Example : writing to a cell
 worksheet.mergeCells(0, 0, 0, 1); // Example : merging files
 worksheet.mergeCells(1, 0, 1, 1, 1, 2); // Example : merging files
 worksheet.writeToCell(2, 0, 'Name');
 worksheet.writeToCell(2, 1, 'Description');

 worksheet.setColumnProperties([ // Example : setting the width of columns in the file
 {wch: 20},
 {wch: 30}
 ]);

 // Example : writing multple rows to file
 var row = 3;
 Pos.Collection.Categories.find({}).forEach(function (cat) {
 worksheet.writeToCell(row, 0, cat.name);
 worksheet.writeToCell(row, 1, cat.description);

 row++;
 });

 workbook.addSheet('MySheet', worksheet); // Add the worksheet to the workbook

 mkdirp('tmp', Meteor.bindEnvironment(function (err) {
 if (err) {
 console.log('Error creating tmp dir', err);
 futureResponse.throw(err);
 }
 else {
 var uuid = UUID.v4();
 var filePath = './tmp/' + uuid;
 workbook.writeToFile(filePath);

 temporaryFiles.importFile(filePath, {
 filename: uuid,
 contentType: 'application/octet-stream'
 }, function (err, file) {
 if (err) {
 futureResponse.throw(err);
 }
 else {
 futureResponse.return('/gridfs/temporaryFiles/' + file._id);
 }
 });
 }
 }));

 return futureResponse.wait();
 }

 });
 */


