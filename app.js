// app.js

// Import necessary modules
const express = require("express"); // Express framework for building web applications
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const routes = require("./routes"); // Custom routes for handling user-related requests

// Firebase Admin SDK initialization
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Set the port where the app will run
const PORT = process.env.PORT || 8080;

// Initialize Firebase app with service account credentials
initializeApp();

// Set Firestore instance as a global variable
global.db = getFirestore();

const app = express(); // Initialize Express app

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Register user-related routes with '/users' prefix
app.use("/users", routes);

// Start the Express server and listen for incoming requests on specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
