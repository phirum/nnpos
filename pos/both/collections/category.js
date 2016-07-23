Pos.Collection.Categories = new Mongo.Collection("pos_categories");
Pos.Schema.Categories = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        //unique: true,
        max: 200
    },
    description:{
        type:String,
        label:"Description",
        optional:true
    },
    parentId:{
        type:String,
        label:"ParentId",
        optional:true,
        autoform: {
            type: "select2",
           /* options: function () {
                //return Pos.List.category();
               return Pos.List.category("Select Parent | No Parent");
            }*/
        }
    },
    level:{
        type:Number,
        optional:true
    },
    _parent:{
        type:Object,
        blackbox:true,
        optional:true
    },
    _productCount:{
        type:Number,
        optional:true
    }
});
Pos.Collection.Categories.attachSchema(Pos.Schema.Categories);
