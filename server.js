// Require the express web application framework (https://expressjs.com)
var express = require("express");
var bodyParser = require("body-parser");
var port = process.env.PORT || 8080;
var axios = require("axios").default;
const Window = require("window");

const window = new Window();

// Create a new web application by calling the express function
var app = express();
var isStarted = false;
// Tell our application to serve all the files under the `public_html` directory
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/start", function(request, response, next) {
  let getUrl = "https://launchpad-heart-lb.herokuapp.com/api/patients";

  console.log(request.body.code);

  if (request.body.code == "0000") {
    axios
      .get(getUrl)
      .then(function(response) {
        var patientData = response.data;
        //console.log(patientData);
        // check if the emulator has already started or not

        if (isStarted == true) return;

        isStarted = true;
        // loop through the individual data and store random mock up data in the table
        window.interval = setInterval(() => {
          patientData.forEach(function(element) {
            postVitalData(element.id);
          });
        }, 60000);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  } else {
    console.log("no match");
  }

  response.end();
});

app.post("/stop", function(request, response, next) {
  isStarted = false;
  console.log("stopped");

  clearInterval(window.interval);
  response.end();
});

function postVitalData(patientId) {
  let url = `https://launchpad-heart-lb.herokuapp.com/api/patients/${patientId}/sensorData`;
  axios
    .post(url, {
      pulseRate: getRandomInt(80, 100),
      bloodGlucose: getRandomInt(80, 100),
      bloodPressure: "123/123",
      weight: getRandomInt(40, 100),
      bloodOxygen: getRandomInt(80, 120),
      sleep: getRandomInt(1, 15),
      physicalActivity: {},
      logTime: Date.now()
    })
    .then(function(response) {
      //console.log(response);
      console.log("successfully posted data");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.listen(port, function() {
  console.log("Web server running at: http://localhost:8080");
  console.log("Type Ctrl+C to shut down the web server");
});
