// == DEPENDENCIES == //
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const routes = require("./routes");// === NEEDED??

// == DEFAULT PORT SET UP + CONFIGURE MONGOOSE + CONFIG MIDDLEWARE/BODYPARSER == //
const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// NEEDED FOR HEROKU - Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}else {
    app.use(express.static(__dirname + "/client/public"));
  }

// enable CORS, use:
// https://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next();
  });

// === ROUTES === //
var articlesController = require("./server/controllers/articleController");
var router = new express.Router();
// Get saved articles
router.get("/api/saved", articlesController.find);
// Save articles
router.post("/api/saved", articlesController.insert);
// delete saved articles
router.delete("/api/saved/:id", articlesController.delete);
// Send every other request to the React app
router.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

// ROUTER USE - Add routes, both API and view
app.use(router);

// === MONGO DB + MONGOOSE CONNECTION === //
// Connect to the Mongo DB
const db = process.env.MONGODB_URI || "mongodb://localhost/nyt-react";
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.error(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});


// === SERVER LISTENER === //
// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
