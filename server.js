// Require the express web application framework (https://expressjs.com)
var express = require('express')
var bodyParser = require('body-parser')

var axios = require('axios').default;

// Create a new web application by calling the express function
var app = express()

// Tell our application to serve all the files under the `public_html` directory
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));

// Create a new web application by calling the express function

app.post('/data', function(request, response, next){
  let getUrl = "https://launchpad-heart-lb.herokuapp.com/api/patients";
 
  axios.get(getUrl)
      .then(function (response) {
        var patientData = response.data;
        //console.log(patientData);
        // loop through the individual data and store random mock up data in the table
        setInterval(() => { 
          patientData.forEach(function(element) {
            postVitalData(element.id)
          }); 
        }, 5000);      
      })
      .catch(function (error) {
          // handle error
          console.log(error);
      })
      .finally(function () {
          // always executed
      });
  
  response.end();

});

function postVitalData(patientId){
  let url = `https://launchpad-heart-lb.herokuapp.com/api/patients/${patientId}/sensorData`;
  axios.post(url, {
    pulseRate: getRandomInt(80,100),
    bloodGlucose: getRandomInt(80,100),
    bloodPressure: "123/123",
    weight: getRandomInt(40,100),
    bloodOxygen: getRandomInt(80,120),
    sleep: getRandomInt(1,15),
    physicalActivity: {}
  })
  .then(function (response) {
    //console.log(response);
    console.log('successfully posted data')
  })
  .catch(function (error) {
    console.log(error);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Tell our application to listen to requests at port 3000 on the localhost
app.listen(3000, function () {
  // When the application starts, print to the console that our app is
  // running at http://localhost:3000. Print another message indicating
  // how to shut the server down.
  console.log("Web server running at: http://localhost:3000")
  console.log("Type Ctrl+C to shut down the web server")
})
