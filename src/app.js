// app.js

// Import necessary modules
const express = require("express"); // Express framework for building web applications
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const routes = require("./routes"); // Custom routes for handling user-related requests

// Load environment variables from .env file
require("dotenv").config();
const path = require("path");

// Firebase Admin SDK initialization
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Set the port where the app will run
const PORT = process.env.PORT || 7070;

// Use a hard-coded flag to toggle emulator
const USE_FIRESTORE_EMULATOR = false; // Set to `false` for deployment

try {
  if (!USE_FIRESTORE_EMULATOR) {
    // Initialize Firebase app with service account credentials from cloudrun
    initializeApp();
  } else {
    // Firebase service account credentials
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
    if (!serviceAccountPath) {
      throw new Error("SERVICE_ACCOUNT_PATH environment variable is not set.");
    }
    const serviceAccount = require(serviceAccountPath);
    // Initialize Firebase app with service account credentials
    console.log("Using Provided Credentials...");
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  // Set Firestore instance as a global variable
  global.db = getFirestore();

  if (USE_FIRESTORE_EMULATOR) {
    console.log("Using Firestore emulator...");
    db.settings({
      host: "localhost:8080", // Firestore emulator host
      ssl: false, // Disable SSL for the emulator connection
    });
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  process.exit(1); // Exit the process with an error code
}

const app = express(); // Initialize Express app

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Register user-related routes with '/users' prefix
app.use("/users", routes);

// Start the Express server and listen for incoming requests on specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
