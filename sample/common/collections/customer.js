// Collection
Sample.Collection.Customer = new Mongo.Collection("sample_customer");

// Schema
Sample.Schema.Customer = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    gender: {
        type: String,
        label: "Gender",
        autoform: {
            type: "select2",
            options: function () {
                return Sample.List.gender();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    dob: {
        type: Date,
        label: "Date of Birth",
        defaultValue: function () {
            return moment().format('YYYY-MM-DD');
        }
    },
    telephone: {
        type: String,
        label: "Telephone",
        optional: true
    },
    email: {
        type: String,
        label: "Email",
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    locationId: {
        type: String,
        label: "Location"
    },
    photo: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
                accept: 'image/*'
            }
        }
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});

// Attach schema
Sample.Collection.Customer.attachSchema(Sample.Schema.Customer);

// Attach soft remove
//Sample.Collection.Customer.attachBehaviour('softRemovable');