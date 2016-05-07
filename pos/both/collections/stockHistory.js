Pos.Collection.StockHistories = new Mongo.Collection("pos_stockHistories");
Pos.Schema.StockHistories = new SimpleSchema({
    stockList:{
        type:[Object],
        label:'Stock List',
        blackbox:true
    },
    branchId: {
        type: String,
        label: "Branch"
    },
    createdAt: {
        type: Date,
        label: 'Created At'
    },
    updatedAt: {
        type: Date,
        label: 'Updated At'
    },
    createdBy: {
        type: String,
        label: 'Created By'
    },
    updatedBy: {
        type: String,
        label: 'Updated By'
    }


});
Pos.Collection.StockHistories.attachSchema(Pos.Schema.StockHistories);
