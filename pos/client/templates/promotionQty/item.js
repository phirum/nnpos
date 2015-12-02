// Declare template
var promotionQtyItemTpl = Template.pos_promotionQtyItem;

stateItem = new ReactiveObj({
    productId: '',
    quantity: 0
});


promotionQtyItemTpl.onCreated(function () {
    //promotionItemsState.clear();
});

promotionQtyItemTpl.onRendered(function () {
    setTimeout(function () {
        $('#tmpProductId').select2();
    }, 500);

});

promotionQtyItemTpl.helpers({
    products: function () {
        return Pos.Collection.Products.find();
    },
    promotionQtyItems: function () {
        return promotionItemsState.fetch();
    }
});

function checkDisableStatus() {
    if ($('#tmpProductId').val() == "" && $('#tmpQuantity').val() == "") {
        $('.addItem').attr('disabled', true);
    } else {
        $('.addItem').attr('disabled', false);
    }
}
promotionQtyItemTpl.events({
    'change #tmpProductId': function (e, t) {
        t.$('#tmpQuantity').val(1);
        debugger;
        checkDisableStatus();
    },
    'change #tmpQuantity, mouseout #tmpQuantity': function (e) {
        if ($(e.currentTarget).val() == "") {
            $(e.currentTarget).val(1);
        }
    },

    'click .addItem': function (e, t) {
        if ($('#tmpProductId').val() == "" || $('#tmpQuantity').val() == "") {
            return;
        }
        debugger;
        var promotionItem = {};
        var index = 0;
        promotionItem.productId = t.$('[name="tmpProductId"]').val();
        promotionItem.quantity = parseInt(t.$('[name="tmpQuantity"]').val());

        if (promotionItemsState.length() > 0) {
            // Check exist
            var findExist = promotionItemsState.get(promotionItem.productId);
            // Update exist
            if (!_.isUndefined(findExist)) {
                promotionItem.quantity = promotionItem.quantity + findExist.quantity;
                promotionItemsState.update(promotionItem.productId, promotionItem);
            } else { // Cal index to add new
                index = promotionItemsState.last().index + 1;
                promotionItem.index = index;
                promotionItem.indexProductId = 'promotionItems.' + index + '.productId';
                promotionItem.indexQuantity = 'promotionItems.' + index + '.quantity';
                promotionItemsState.insert(promotionItem.productId, promotionItem);
            }
        } else {
            promotionItem.index = index;
            promotionItem.indexProductId = 'promotionItems.' + index + '.productId';
            promotionItem.indexQuantity = 'promotionItems.' + index + '.quantity';
            promotionItemsState.insert(promotionItem.productId, promotionItem);
        }
        $('#tmpProductId').select2('val', '');
        $('[name="tmpQuantity"]').val('');
        //stateItem.set('productId','' );
        $('.addItem').attr('disabled', true);
        stateItem.set('quantity', 1);
    },
    'click .removeItem': function (e, t) {
        var self = this;
        promotionItemsState.remove(self.productId);
    }
});

