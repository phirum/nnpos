Picker.route('/sample/locationRemote/:locationId', function (params, req, res, next) {
    var selector = [
        {_id: {$regex: params.locationId, $options: 'i'}},
        {name: {$regex: params.locationId, $options: 'i'}}
    ];
    var items = Sample.Collection.Location.find({$or: selector})
        .map(function (obj) {
            return {id: obj._id, text: obj._id + ' : ' + obj.name};
        });

    res.end(JSON.stringify(items));
});