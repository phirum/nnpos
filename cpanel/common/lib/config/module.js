/**
 * Module
 */
Module = typeof Module === 'undefined' ? {} : Module;
Meteor.isClient && Template.registerHelper('Module', Module);

Module.Cpanel = {
    name: 'Cpanel System',
    version: '2.0.0',
    summary: 'Cpanel Management System is ...',
    roles: [
        'super',
        'admin'
    ],
    dump: {
        data: [
            'roles',
            'users',
            'cpanel_setting',
            'cpanel_currency',
            'cpanel_company',
            'cpanel_branch',
            'cpanel_exchange'
        ]
    }
};

