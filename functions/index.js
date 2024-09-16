// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");


if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    error("Firebase admin already initialized");
  }
}

const {setGlobalOptions} = require("firebase-functions/v2");

// locate all functions closest to users
setGlobalOptions({region: "asia-southeast1"});

// const functions = require('firebase-functions');
const {getFredData} = require("./fred");
const {onCall} = require("firebase-functions/v2/https");

// Access the FRED API key from environment variables
const {defineSecret} = require("firebase-functions/params");
const fredApiKey = defineSecret("FRED_KEY");


// All available logging functions
const {
  // log,
  info,
  // debug,
  // warn,
  error,
  // write,
} = require("firebase-functions/logger");


exports.getFredDataById = onCall({
  // Reject requests with missing or invalid App Check tokens.
  enforceAppCheck: true,
  timeoutSeconds: 900,
  memory: "512MiB",
  secrets: [fredApiKey],
},
async (data, context) => {
  // TODO: check auth here

  // info('Request:', data);
  const seriesId = data.data.series_id;
  const startDate = data.data.start_date;
  const endDate = data.data.end_date;


  try {
    info("Inputs:", seriesId, startDate, endDate);

    // get secret key value
    const secretKey = fredApiKey.value();

    if (secretKey.length != 32) {
      return Promise.resolve({
        "status": "error",
        "error": "Invalid FRED API Key",
      });
    }

    // info("Secret key:", secretKey);

    const data = await getFredData(seriesId, startDate, endDate, secretKey);
    // info('Output:', data);
    // res.json(data);
    return Promise.resolve(data);
  } catch (err) {
    error(err);
    return Promise.resolve({"status": "error", "error": err});
  }
});
