// Collection
Sample.Collection.Location = new Mongo.Collection("sample_location");

// Schema
Sample.Schema.Location = new SimpleSchema({
    name: {
        type: String,
        label: "Location"
    }
});

// Attach schema
Sample.Collection.Location.attachSchema(Sample.Schema.Location);

// Attach soft remove
Sample.Collection.Location.attachBehaviour('softRemovable');