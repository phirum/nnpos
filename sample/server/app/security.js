/**
 * Setting
 */
Security.defineMethod("sample_ifSetting", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['setting'], 'Sample');
    }
});

/**
 * Data Entry
 */
Security.defineMethod("sample_ifDataInsert", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['data-insert'], 'Sample');
    }
});

Security.defineMethod("sample_ifDataUpdate", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['data-update'], 'Sample');
    }
});

Security.defineMethod("sample_ifDataRemove", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['data-remove'], 'Sample');
    }
});

/**
 * Report
 */
Security.defineMethod("sample_ifReport", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['report'], 'Sample');
    }
});
