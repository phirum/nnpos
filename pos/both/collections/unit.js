Pos.Collection.Units = new Mongo.Collection("pos_units");
Pos.Schema.Units = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
    },
    description:{
        type:String,
        label:"Description",
        optional:true
    },
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
Pos.Collection.Units.attachSchema(Pos.Schema.Units);
