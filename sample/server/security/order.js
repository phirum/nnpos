// Order
Sample.Collection.Order.permit(['insert'])
    .sample_ifDataInsert()
    .apply();
Sample.Collection.Order.permit(['update'])
    .sample_ifDataUpdate()
    .apply();
Sample.Collection.Order.permit(['remove'])
    .sample_ifDataRemove()
    .apply();
