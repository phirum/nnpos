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
    }
});
Pos.Collection.Units.attachSchema(Pos.Schema.Units);
