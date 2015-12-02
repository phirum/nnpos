Meteor.startup(function () {
    if (Meteor.users.find().count() == 0) {
        // Insert super
        var superId = Accounts.createUser(
            {
                username: 'super',
                email: 'super@gmail.com',
                password: 'rabbitsuper',
                profile: {
                    name: 'Rabbit'
                }
            }
        );
        Roles.addUsersToRoles(superId, ['super'], 'Cpanel');
        Meteor.users.update({_id: superId}, {$set: {rolesBranch: ['001']}});

        // Insert admin
        var adminId = Accounts.createUser(
            {
                username: 'admin',
                email: 'admin@gmail.com',
                password: '123456',
                profile: {
                    name: 'Admin'
                }
            }
        );
    }
});