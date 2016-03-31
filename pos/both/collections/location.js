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
    branchId: {
        type: String,
        label: "Branch"
    },
    _branch: {
        type: Object,
        blackbox: true,
        optional: true
    },
    _saleCount: {
        type: Number,
        optional: true
    }
});
Pos.Collection.Locations.attachSchema(Pos.Schema.Locations);
