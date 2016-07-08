// Config Account UI
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL",

    //Custom
    requestPermissions: {},
    extraSignupFields: [
        {
            fieldName: 'name',
            fieldLabel: 'Full name',
            inputType: 'text',
            visible: true,
            validate: function (value, errorFunction) {
                var name = s.trim(value);

                if (!name) {
                    errorFunction("Please write your full name");
                    return false;
                } else {
                    return true;
                }
            },
            saveToProfile: true
        }
    ]
});

// Events user login/out
Accounts.onLogin(function () {
    // Set current user id
    Session.setPersistent('currentUserId', Meteor.userId());

   
});

accountsUIBootstrap3.logoutCallback = function (error) {
    if (!error) {
        FlowRouter.go('cpanel.welcome');
        

        // Clear persistent session of user id
        Session.clearPersistent();
    }
};
