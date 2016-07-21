Pos.Schema.ProductListReport = new SimpleSchema({
    categoryId: {
        type: String,
        label: "Category",
        autoform: {
            type: "select2",
           /* options: function () {
                return Pos.List.category("All");
            }*/
        },
        optional: true
    }
});