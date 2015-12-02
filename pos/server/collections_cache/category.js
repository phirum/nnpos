Pos.Collection.Categories.cacheTimestamp();
Pos.Collection.Categories.cacheCount('productCount', Pos.Collection.Products, 'categoryId');
Pos.Collection.Categories.cacheCount('categoryCount',Pos.Collection.Categories,'parentId');
Pos.Collection.Categories.cacheDoc('parent', Pos.Collection.Categories, ['name','_parent']);
