
var config = {
  apiKey: "AIzaSyBg3yki63k3AKwYbu2Q9MhwbGe47Os6nfs",
  authDomain: "traintime-e2ca4.firebaseapp.com",
  databaseURL: "https://traintime-e2ca4.firebaseio.com",
  projectId: "traintime-e2ca4",
  storageBucket: "traintime-e2ca4.appspot.com",
  messagingSenderId: "378429059973"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
// var database = ...
var database = firebase.database();

var trainName;
var destination;
var trainTime;
var frequency;
var firebasePath;

database.ref().on("child_added", function(snapshot) {
    /////variables required for time calculations//////
    var calcFreq = snapshot.val().frequency;
    var calcTrainTime = snapshot.val().trainTime;
    ////Push back first Time to make sure it comes before current time//////////
    var firstTimeConverted = moment(calcTrainTime, "HH:mm").subtract(1, "years");
  
    ////next arrival and minutes away calculations//////
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    /////Time apart Remainder/////////////////////////////
    var timeRemainder = diffTime % calcFreq;
    /////Minutes till next train///////////////////////////
    var minTillNextTrain = calcFreq - timeRemainder;
    ///////Next Train/////////////////////////////////////
    var nextTrain = moment().add(minTillNextTrain, "minutes");
    nextTrain = (moment(nextTrain).format("hh:mm A"));


    /////////insert new train and times in Train Schedule//////
  
    $("#trainsGoHere").append("<t>" +
    "<td scope='col'>" + snapshot.val().trainName + "</td>" +
    "<td scope='col'>" + snapshot.val().destination + "</td>" + 
    "<td scope='col'>" + snapshot.val().frequency + "</td>" +
    "<td scope='col'>" + nextTrain + "</td>" +
    "<td scope='col'>" + minTillNextTrain + "</td>" +
    "</td>");
});



$("#add-train-btn").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
 
    // Get the input values

    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val();
    trainTime = $("#trainTime-input").val();
    frequency = $("#frequency-input").val();

    ////send to Database////
    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

/////////////update times every min///////////////////////////
setInterval(function () {
  location.reload();
}, 60000)


