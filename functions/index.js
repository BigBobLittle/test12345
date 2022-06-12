require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");

const serviceAccount = require("./config");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ENV_DB_URL.firebaseio.com",
  });
} catch (err) {
  admin.app();
}
const { createNewUser, web3, loginUser } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api endpoints
app.get("/", (req, res) =>
  res.status(200).json({ message: "Hey there! DEPLOYED COMPLETE" })
);
app.post("/createUser", createNewUser);
app.post("/web3", web3);
app.post("/login", loginUser);
exports.app = functions.https.onRequest(app);
