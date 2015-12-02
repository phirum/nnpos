/*
Template.pos_myCustomerReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

//function displayFileAsText(event)
// {
// var textAreaFileSelectedAsText = document.getElementById("textAreaFileSelectedAsText");
// textAreaFileSelectedAsText.innerHTML = event.target.file.asText();
// }
Template.pos_myCustomerReport.events({
    'change #file-restore': function () {
        var zipFileToLoad = $("#file-restore").prop('files')[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            try {
                var zipFileLoaded = new JSZip(fileLoadedEvent.target.result);
                for (var key in zipFileLoaded.files) {
                    var file = zipFileLoaded.files[key];
                    Meteor.call('restoreOneCollection', file.asText(), function (error, result) {
                        if (error) {
                            alertify.error(error.message);
                        }
                    });
                }
                alertify.success("Database is Restored Successfully.");
            } catch (error) {
                alertify.error(error);
            }
        };
        fileReader.readAsArrayBuffer(zipFileToLoad);


    },
    //'change #file-restore': function () {
    // var inputFile = document.getElementById("file-restore");
    // var zipFileToLoad = inputFile.files[0];
    // var fileReader = new FileReader();
    // fileReader.onload = function(fileLoadedEvent)
    // {
    // var zipFileLoaded = new JSZip(fileLoadedEvent.target.result);
    // var ulFilesContained = document.getElementById("ulFilesContained");
    // for (var nameOfFileContainedInZipFile in zipFileLoaded.files)
    // {
    // var fileContainedInZipFile = zipFileLoaded.files[nameOfFileContainedInZipFile];
    // Meteor.call('restoreOneCollection',fileContainedInZipFile.asText());
    // var linkFileContained = document.createElement("a");
    // linkFileContained.innerHTML = nameOfFileContainedInZipFile;
    // linkFileContained.href = "#";
    // linkFileContained.file = fileContainedInZipFile;
    // linkFileContained.onclick = displayFileAsText;
    // var liFileContained = document.createElement("li");
    // liFileContained.appendChild(linkFileContained);
    // ulFilesContained.appendChild(liFileContained);
    // }
    // };
    // fileReader.readAsArrayBuffer(zipFileToLoad);
    // },
    'click #btn-backup': function () {
        var collections = ['Pos.Collection.Categories', 'Pos.Collection.SubCategories'];
        Meteor.call('exportDataByBranchId', collections, function (error, response) {
            if (error) {
                console.log(error.message);
            } else {
                var base64ToBlob, blob;
                base64ToBlob = function (base64String) {
                    var byteArray, byteCharacters, byteNumbers, i;
                    byteCharacters = atob(base64String);
                    byteNumbers = new Array(byteCharacters.length);
                    i = 0;
                    while (i < byteCharacters.length) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                        i++;
                    }
                    byteArray = new Uint8Array(byteNumbers);
                    return new Blob([byteArray], {
                        type: "zip"
                    });
                };

                blob = base64ToBlob(response);
                saveAs(blob, 'export.zip');
            }
        })

    }
});
Template.pos_myCustomerReport.helpers({});
//client only code

Template.leaderboard.helpers({
    players: function () {
        return Players.find({}, {sort: {score: -1, name: 1}});
    },
    selectedName: function () {
        var player = Players.findOne(Session.get("selectedPlayer"));
        return player && player.name;
    }
});

Template.leaderboard.events({
    'click .details .inc': function () {
        Players.update(Session.get("selectedPlayer"), {$inc: {score: 5}});
    }
});

Template.leaderboard.events({
    'click .buttons .inc': function () {
        Meteor.call('downloadExcelFile', function (err, fileUrl) {
            console.log(fileUrl);
            var link = document.createElement("a");
            link.download = 'category report.xlsx';
            link.href = fileUrl;
            link.click();
        });
    }
});

Template.player.helpers({
    selected: function () {
        return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }

});

Template.player.events({
    'click': function () {
        Session.set("selectedPlayer", this._id);
    }
});

*/