/**
 * Declare template
 */
var itemTpl = Template.sample_orderItem;

/**
 * Define state
 */
itemsStateList = new ReactiveList();
var state = new ReactiveObj({
    qty: 0,
    price: 0,
    cssClassForAddMore: 'disabled'
});

/**
 * Items
 */
itemTpl.onCreated(function () {
    itemsStateList.clear();

    // Check items data
    if (this.data) {
        _.each(this.data, function (obj, key) {
            obj.indexNmae = 'items.' + key + '.name';
            obj.indexQty = 'items.' + key + '.qty';
            obj.indexPrice = 'items.' + key + '.price';
            obj.indexAmount = 'items.' + key + '.amount';

            itemsStateList.insert(obj.name, obj);
        });
    }
});

itemTpl.onRendered(function () {
    itemsInputmask();
});

itemTpl.helpers({
    tmpAmount: function () {
        var tmpAmountVal = math.round(state.get('qty') * state.get('price'), 2);
        return tmpAmountVal;
    },
    cssClassForAddMore: function () {
        var tmpAmountVal = math.round(state.get('qty') * state.get('price'), 2);
        if (tmpAmountVal > 0) {
            state.set('cssClassForAddMore', '');
        } else {
            state.set('cssClassForAddMore', 'disabled');
        }

        return state.get('cssClassForAddMore');
    },
    items: function () {
        return itemsStateList.fetch();
    },
    total: function () {
        var totalVal = 0;
        _.each(itemsStateList.fetch(), function (o) {
            totalVal += o.amount;
        });

        return totalVal;
    }
});

itemTpl.events({
    'keyup [name="tmpQty"]': function (e, t) {
        var qty = t.$('[name="tmpQty"]').val();
        qty = _.isEmpty(qty) ? 0 : parseInt(qty);

        state.set('qty', qty);
    },
    'keyup [name="tmpPrice"]': function (e, t) {
        var price = t.$('[name="tmpPrice"]').val();
        price = _.isEmpty(price) ? 0 : parseFloat(price);

        state.set('price', price);
    },
    'click .js-add-item': function (e, t) {
        var index = 0;
        var item = {};
        item.name = t.$('[name="tmpName"]').val();
        item.qty = parseInt(t.$('[name="tmpQty"]').val());
        item.price = math.round(parseFloat(t.$('[name="tmpPrice"]').val()), 2);
        item.amount = math.round(item.qty * item.price, 2);

        // Check items exist
        if (itemsStateList.length() > 0) {
            // Check duplicate
            var duplicate = itemsStateList.get(item.name);
            if (!_.isUndefined(duplicate)) {
                item.qty = duplicate.qty + item.qty;
                item.amount = math.round(item.qty * item.price, 2);

                itemsStateList.update(item.name, {
                    qty: item.qty,
                    price: item.price,
                    amount: item.amount
                });

                return false;
            } else {
                index = itemsStateList.last().index + 1;
            }
        }

        item.indexNmae = 'items.' + index + '.name';
        item.indexQty = 'items.' + index + '.qty';
        item.indexPrice = 'items.' + index + '.price';
        item.indexAmount = 'items.' + index + '.amount';

        itemsStateList.insert(item.name, item);
    },
    'blur .js-add-item': function (e, t) {
        itemsInputmask();
    },
    'click .js-remove-item': function (e, t) {
        var self = this;
        itemsStateList.remove(self.name);
    },
    'keyup .js-qty': function (e, t) {
        var current = $(e.currentTarget);
        var name = current.parents('div.row.list').find('.js-name').val();
        var getItem = itemsStateList.get(name);

        var qty = parseInt(current.val());
        var amount = math.round(qty * getItem.price, 2);
        itemsStateList.update(name, {
            qty: qty,
            amount: amount
        });
    },
    'keyup .js-price': function (e, t) {
        var current = $(e.currentTarget);
        var name = current.parents('div.row.list').find('.js-name').val();
        var getItem = itemsStateList.get(name);

        var price = parseFloat(current.val());
        var amount = math.round(getItem.qty * price, 2);
        itemsStateList.update(name, {
            price: price,
            amount: amount
        });
    }
});

/**
 * Input mask
 */
var itemsInputmask = function () {
    var tmpQty = $('[name="tmpQty"]');
    var tmpPrice = $('[name="tmpPrice"]');
    var tmpAmount = $('[name="tmpAmount"]');

    var qty = $('.js-qty');
    var price = $('.js-price');
    var amount = $('.js-amount');
    var total = $('[name="total"]');

    Inputmask.currency([tmpPrice, tmpAmount, price, amount, total]);
    Inputmask.integer([tmpQty, qty]);
};
