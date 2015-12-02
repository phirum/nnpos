Pos.Collection.UserStaffs.cacheTimestamp();
Pos.Collection.UserStaffs.cacheDoc('staff', Pos.Collection.Staffs, ['name']);
Pos.Collection.UserStaffs.cacheDoc('user', Meteor.users, ['username']);
Pos.Collection.UserStaffs.cacheDoc('branch',Cpanel.Collection.Branch,['khName','enName']);
