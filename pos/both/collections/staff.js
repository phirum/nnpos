Pos.Collection.Staffs = new Mongo.Collection("pos_staffs");
Pos.Schema.Staffs = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
    },
    startDate: {
        type: Date,
        label: "Start Date"
    },
    gender: {
        type: String,
        label: "Gender",
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.gender();
            }
        }
    },
    position: {
        type: String,
        label: "Position"
    },
    salary: {
        type: Number,
        label: "Salary",
        decimal: true,
        optional:true
        //regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    status: {
        type: String,
        label: "Status",
        //optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Pos.List.status();
            }
        }
    },
    phone: {
        type: String,
        label: "Phone",
        optional:true
    },
    address: {
        type: String,
        label: "Address",
        autoform: {
            afFieldInput: {
                type: "textarea"
            }
        },
        optional:true
    },
    branchId: {
        type: String,
        label: "Branch"
    }
});
Pos.Collection.Staffs.attachSchema(Pos.Schema.Staffs);
