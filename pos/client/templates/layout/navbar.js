Template.pos_navbar.helpers({
    'noSeller': function () {
        var t = true;
        var user = Meteor.users.findOne(Meteor.user()._id);
        var roles = user.roles["Pos"];
        roles.forEach(function (obj) {
            if (obj == "seller") {
                t = false;
                return false;
            }
        });
        return t;
    },
    isZero:function(val){
        debugger;
        return val==0;
    }
});

createNewAlertify("saleNotification");

Template.pos_saleNotification.helpers({
    sevenDaysOwedSale:function(){
        var lastWeek = new Date();
        var a=lastWeek.setDate(lastWeek.getDate() - 7);
        var selector={
            status: 'Owed',
            saleDate: {$lte: lastWeek}
        };
        Meteor.subscribe('posSale',selector);
        return Pos.Collection.Sales.find(selector);

    }
});