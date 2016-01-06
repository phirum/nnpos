Pos.TabularTable.Products = new Tabular.Table({
    name: "posProductList",
    collection: Pos.Collection.Products,
    columns: [
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.pos_productAction
        },
        /* {
         data: "picture", title: "Photo",
         render: function (val, type, doc) {
         if (val == null) {
         return lightbox('/no_image.jpg', doc._id, doc.name);
         } else {
         var img = Images.findOne(val);
         return lightbox(img.url(), doc._id, doc.name);
         }
         }
         },*/
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "barcode", title: "Barcode"},
        {data: "retailPrice", title: "Re.Price"},
        {data: "wholesalePrice", title: "Who.Price"},
        // {data: "purchasePrice", title: "Pur.Price"},
        {data: "productType", title: "Type"},
        {data: "status", title: "Status"},
        {
            data: "_unit.name", title: "Unit"
            /* render: function (val, type, doc) {
             return Pos.Collection.Units.findOne(val).name;
             }*/
        },
        {
            data: "_category.name", title: "Category"
        }
        /*,
         {
         data: "_saleDetailCount", title: "Used for Sale",
         render: function (val, type, doc) {
         return val == null ? 0 : val;
         }
         },
         {
         data:"_purchaseDetailCount",title:"Used for Purchase",
         render: function (val, type, doc) {
         return val == null ? 0 : val;
         }
         },
         {data:"_adjustmentDetailCount",title:"Used for Adjustment",
         render: function (val, type, doc) {
         return val == null ? 0 : val;
         }}*/
        /*  {
         data: "subCategoryId", title: "Sub Category",
         render: function (val, type, doc) {
         return Pos.Collection.SubCategories.findOne(val).name;
         }
         },*/
    ],
    order: [['1', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    extraFields: ['purchasePrice', '_saleDetailCount', '_purchaseDetailCount', '_adjustmentDetailCount']
});