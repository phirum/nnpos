// Schema
Cpanel.Schema.GeneratorCRUD = new SimpleSchema({
    moduleName: {
        type: String,
        label: 'Module name',
        autoform: {
            type: "select2",
            options: function () {
                return generatorList.module();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    fieldName: {
        type: String,
    },
    fieldPro: {
        type: Array,
        label: "Fields",
        minCount: 1
    },
    'fieldPro.$': {
        type: Object
    },
    'fieldPro.$.name': {
        type: String
    },
    'fieldPro.$.type': {
        type: String
    },
    'fieldPro.$.optional': {
        type: Boolean,
        optional: true
    },
});

// List
if (Meteor.isClient) {
    generatorList = {
        module: function () {
            var list = [];
            list.push({label: '(Select One)', value: ''});

            _.forEach(Module, function (val, key) {
                if (key != 'Cpanel') {
                    list.push({label: key, value: key});
                }
            });

            return list;
        }
    }
}