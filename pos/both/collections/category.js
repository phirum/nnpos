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
            options: function () {
                //return Pos.List.category();
               return Pos.List.category("Select Parent | No Parent");
            }
        }
    }
    /*createdAt: {
        type: Date,
        label: "Created Date",
        autoValue: function() {
            if (this.isInsert)
                return new Date;
        },
        denyUpdate: true,
        optional: true
    },
    updatedAt: {
        type: Date,
        label: "Updated Date",
        autoValue: function() {
            return new Date();
        },
        optional: true
    },
    createdUserId: {
        type: String,
        label: "Created by",
        autoValue: function() {
            if (this.isInsert)
                return Meteor.user()._id;
        },
        denyUpdate: true,
        optional: true
    },
    updatedUserId: {
        type: String,
        label: "Updated by",
        autoValue: function() {
            return Meteor.user()._id;
        },
        optional: true
    }*/
});
Pos.Collection.Categories.attachSchema(Pos.Schema.Categories);
