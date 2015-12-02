userToken = function () {
    var token = typeof Accounts !== 'undefined' && Accounts !== null ? Accounts._storedLoginToken() : null;
    return token;
};
