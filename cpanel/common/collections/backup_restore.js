/**
 * Schema
 */
Cpanel.Schema.Backup = new SimpleSchema({
    token: {
        type: String,
        optional: true,
        defaultValue: function () {
            return userToken();
        }
    },
    module: {
        type: String,
        label: 'Module',
        autoform: {
            type: 'select2',
            options: function () {
                return Cpanel.List.moduleForBackupRestore();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    type: {
        type: String,
        label: 'Type',
        autoform: {
            type: 'select2',
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    branch: {
        type: String,
        label: 'Branch',
        autoform: {
            type: 'select2',
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    }
});

Cpanel.Schema.Restore = new SimpleSchema({
    token: {
        type: String,
        optional: true,
        defaultValue: function () {
            return userToken();
        }
    },
    module: {
        type: String,
        label: 'Module',
        autoform: {
            type: 'select2',
            options: function () {
                return Cpanel.List.moduleForBackupRestore();
            },
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    type: {
        type: String,
        label: 'Type',
        autoform: {
            type: 'select2',
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    branch: {
        type: String,
        label: 'Branch',
        autoform: {
            type: 'select2',
            afFieldInput: {
                select2Options: {
                    theme: "bootstrap"
                }
            }
        }
    },
    restoreFile: {
        type: String,
        label: 'Restore file',
        autoform: {
            type: 'file'
        }
    },
    dropCollections: {
        type: String,
        optional: true
    },
    dropQuery: {
        type: String,
        optional: true
    }
});
