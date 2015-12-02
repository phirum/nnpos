/**
 * Collection
 */
Cpanel.Collection.Setting = new Mongo.Collection("cpanel_setting");

/**
 * Schema
 */
Cpanel.Schema.Setting = new SimpleSchema({
    headOffice: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Cpanel.List.branch();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    baseCurrency: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Cpanel.List.currency();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    }
});

/**
 * Attach schema
 */
Cpanel.Collection.Setting.attachSchema(Cpanel.Schema.Setting);
