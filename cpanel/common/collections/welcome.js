/**
 * Schema
 */
Cpanel.Schema.WelcomeConfig = new SimpleSchema({
    module: {
        type: String,
        label: 'Module',
        autoform: {
            type: "select2",
            options: function () {
                return Cpanel.List.roleForUser();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    branch: {
        type: String,
        label: "Branch",
        autoform: {
            type: "select2",
            options: function () {
                return Cpanel.List.branchForUser();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    }
});
