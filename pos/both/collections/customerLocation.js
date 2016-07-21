Pos.Collection.CustomerLocations = new Mongo.Collection("pos_customerLocations");
Pos.Schema.CustomerLocations = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        //unique: true,
        max: 200
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    _branch: {
        type: Object,
        blackbox: true,
        optional: true
    }
});
Pos.Collection.CustomerLocations.attachSchema(Pos.Schema.CustomerLocations);
