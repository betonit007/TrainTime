
$(document).ready(function(){

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
    var numberTrains = 1;
    var whistle = new Audio("assets/sounds/sound.mp3");

    

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
        if (snapshot.val().destination && snapshot.val().trainName) {
            $("#trainsGoHere").append("<t>" +
            "<td scope='col'>" + snapshot.val().trainName + "</td>" +
            "<td scope='col'>" + snapshot.val().destination + "</td>" + 
            "<td scope='col' id='freq" + numberTrains + "'>" + snapshot.val().frequency + "</td>" +
            "<td scope='col' id='nextA" + numberTrains + "'>" + nextTrain + "</td>" +
            "<td scope='col' id='minAway" + numberTrains + "'>" + minTillNextTrain + "</td>" +
            "</td>");
            numberTrains++;
        }
    });



    $("#add-train-btn").on("click", function(event) {
        // Prevent form from submitting
        event.preventDefault();
    
        // Get the input values

        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val();
        trainTime = $("#trainTime-input").val();
        frequency = $("#frequency-input").val();
    
        if (trainName !== "" && destination !== "" && trainTime !== "" && frequency !== "")  {
        ////send to Database////
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
    
        
        });
        ///////////empty input fields///////////////////////////
        $("#train-name-input").val('');
        $("#destination-input").val('');
        $("#trainTime-input").val('');
        $("#frequency-input").val('');

        }

    });

    /////update times every min///////////////////////////
    setInterval(function () {
        for(var i = 1; i < numberTrains; i++) {
            var timer = parseInt($("#minAway" + i).text());
            timer--;
            var freqer = parseInt($("#freq" + i).text());
            
            ////////////update next Arrival Time//////////////
            if (timer === 0) {
                $("#minAway" + i).text(freqer);
                var getArrival = $("#nextA" + i).text();
                var updatedArrival = moment(getArrival, "hh:mm A").add(freqer, "minutes").format("hh:mm A");
                $("#nextA" + i).text(updatedArrival);
                ////////animate Train .gif across screen on departure///////
                trainDeparts();
                
            
                
            /////update mins away////////////////
            }
            else {
                $("#minAway" + i).text(timer);
            }
        }

    }, 60000)

    function trainDeparts() {

        whistle.play();
        $("#jumbo").prepend("<img id='steamEngine' src='assets/images/steamer.gif'>");
        $("#steamEngine").animate({left: "80%"}, 3000, "swing");
        setTimeout(function(){ $("#steamEngine").remove(); }, 3100);


    }


});
