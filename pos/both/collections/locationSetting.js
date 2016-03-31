Pos.Collection.LocationSettings = new Mongo.Collection("pos_locationSettings");
Pos.Schema.LocationSettings = new SimpleSchema({
    saleLocationId: {
        type: String,
        label: "Location for Sale",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.locations();
            }
        }
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    _location:{
        type:Object,
        blackbox:true,
        optional:true
    },
    _branch:{
        type:Object,
        blackbox:true,
        optional:true
    }
});
Pos.Collection.LocationSettings.attachSchema(Pos.Schema.LocationSettings);
