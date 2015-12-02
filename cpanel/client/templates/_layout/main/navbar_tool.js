Template.cpanel_navbarTool.helpers({
    helpPath: function () {
        var currentModule = Session.get('currentModule');
        var currentBranch = Session.get('currentBranch');
        if (!Meteor.userId() || !currentModule || !currentBranch) {
            return {show: false};
        }
        var bar = s.decapitalize(currentModule);

        return {show: true, template: {left: bar + '_navbar', right: bar + '_navbarRight'}};
    },
    restore () {
        let currentModule = Session.get('currentModule');
        if (currentModule == 'Cpanel') {
            return true
        }
        return false;
    }
});
