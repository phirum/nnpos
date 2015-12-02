Pos.Collection.Locations = new Mongo.Collection("pos_locations");
Pos.Schema.Locations = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        //unique: true,
        max: 200
    },
    abbreviation: {
        type: String,
        label: 'Abbreviation',
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    branchId:{
        type:String,
        label:"Branch"
    }
});
Pos.Collection.Locations.attachSchema(Pos.Schema.Locations);
