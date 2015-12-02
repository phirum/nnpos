// Customer
Sample.Collection.Customer.permit(['insert'])
    .sample_ifDataInsert()
    .apply();
Sample.Collection.Customer.permit(['update'])
    .sample_ifDataUpdate()
    .apply();
Sample.Collection.Customer.permit(['remove'])
    .sample_ifDataRemove()
    .apply();
