import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
var randomActivity = {};
var errorCode = "";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  errorCode = ""
  try {
    var chosenActivity =req.body["type"];
    var chosenNumber = req.body["participants"];

    var linkFinal = `https://bored-api.appbrewery.com/filter?type=${chosenActivity}&participants=${chosenNumber}`;
    const responseSent = await axios.get(linkFinal);
    const resultSent = responseSent.data;

    var randomNum = Math.floor(Math.random() * resultSent.length) +1;
    randomActivity = resultSent[randomNum];
    
    res.render("index.ejs", { data: resultSent , randomActivity : randomActivity, errorCode : errorCode});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    errorCode = "No activities that match your criteria.";
    res.render("index.ejs", { errorCode : errorCode});
  }
  
  //https://bored-api.appbrewery.com/filter?type=req.body.type&participants=req.body.participants 
  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.  
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
