// Initialize Firebase
var config = {
    apiKey: "AIzaSyCWcSqZsA-Yll6-w6MEfu5tqMUDHUPirGI",
    authDomain: "trainscheduler-7052d.firebaseapp.com",
    databaseURL: "https://trainscheduler-7052d.firebaseio.com",
    projectId: "trainscheduler-7052d",
    storageBucket: "trainscheduler-7052d.appspot.com",
    messagingSenderId: "271310925907"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
  var database = firebase.database();


   // Capture Submit Click
   $("#submit").on("click", function(event) {
    // prevent form from trying to submit/refresh the page
    event.preventDefault();

    // Capture User Inputs 
    var trainName = $("#name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = $("#time-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    // Console log each of the user inputs
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(trainName.name);
  console.log(trainDestination.destination);
  console.log(trainTime.time);
  console.log(trainFrequency.frequency);
  

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");

    });   


//Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFrequency = childSnapshot.val().frequency;
  
    // Console Log new Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainTime);
    console.log(trainFrequency);

    //Current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
    // Calculating next train (pushing the first train back one year to ensure it comes before the current time)
  	var convertedFirstTime = moment(trainTime, 'HH:mm').subtract(1, 'years');
  	console.log("First: " + trainTime);
  	console.log(convertedFirstTime);

  	// Calculating the difference between current time & first train
  	var diffTime = moment().diff(moment(convertedFirstTime), "minutes");
  	console.log("Difference in Time: " + diffTime);

  	// Calculating time apart (remainder)
  	var tRemainder = diffTime % trainFrequency;
  	console.log(tRemainder);

  	// Calculates minutes away
  	var minutesAway = trainFrequency - tRemainder;
  	console.log("Minutes to train: " + minutesAway);

  	// Calculates the next train time
  	var nextArrival = moment().add(minutesAway, "minutes");
  	console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));

  // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesAway)
     
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

   // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
    

      
 