/**
 * Admin
 */
Security.defineMethod("posIsAdmin", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['admin'], 'Pos');
    }
});

/**
 * General
 */
Security.defineMethod("posIsGeneral", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['general'], 'Pos');
    }
});

/**
 * Reporter
 */
Security.defineMethod("posIsReporter", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['reporter'], 'Pos');
    }
});

/**
 * Seller
 */
Security.defineMethod("posIsSeller", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['seller'], 'Pos');
    }
});
