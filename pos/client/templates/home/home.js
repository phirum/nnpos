Template.pos_home.helpers({
    currencies: function () {
        return Cpanel.Collection.Currency.find();
    },
    baseCurrency: function () {
        return Cpanel.Collection.Setting.findOne().baseCurrency;
    },
    exchangeRates:function(){

    }
});