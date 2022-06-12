const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
    clientEmail: functions.config().client.email,
    projectId: functions.config().project.id,
  }),
  databaseURL: `https://${functions.config().project.id}.firebaseio.com`,
});

const db = admin.firestore();

module.exports = { db, admin };
