
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
var nextArrival = "to be determined";
var minAway = "TBD";

database.ref().on("child_added", function(snapshot) {
  
  console.log(snapshot.val().trainName);
  console.log(snapshot);

  var time = moment();
  //var result = moment(time).diff(moment(snapshot.val().startDate));
  //var easier = moment.duration(result).as('months');
  //var numberOfMonths = Math.floor(easier);
  
  $("#tableInsert").append("<t>" +
  "<td scope='col'>" + snapshot.val().trainName + "</td>" +
  "<td scope='col'>" + snapshot.val().destination + "</td>" + 
  "<td scope='col'>" + snapshot.val().frequency + "</td>" +
  "<td scope='col'>" + nextArrival + "</td>" +
  "<td scope='col'>" + minAway + "</td>" +
"</td>");

});


$("#add-train-btn").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
 
    // Get the input values

    trainName = $("#train-name-input").val().trim();
     console.log(trainName);
    destination = $("#destination-input").val();
     console.log(trainName);

    trainTime = $("#trainTime-input").val();
    console.log(trainTime);

    frequency = $("#frequency-input").val();

    console.log(frequency);
    

    database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

