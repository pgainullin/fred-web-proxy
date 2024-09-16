const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

async function getCachedData(seriesId, startDate, endDate) {
  const doc = await db.collection("fredCache").doc(seriesId).get();


  if (doc.exists) {
    let observations = doc.data().observations;
    const cachedTitle = doc.data().title || "";
    // Ensure data is an array before using `.filter()`
    if (Array.isArray(observations)) {
      // Optionally, filter data by date range
      if (startDate) {
        observations = observations.filter((obs) => obs.date >= startDate);
      }
      if (endDate) {
        observations = observations.filter((obs) => obs.date <= endDate);
      }
      return {
        title: cachedTitle,
        observations: observations,
      };
    } else {
      // Log an error or handle unexpected data format
      throw new TypeError("Cached data is not an array.");
    }
  }
  return null;
}

async function setCachedData(seriesId, data) {
  // Convert the FredSeries instance to a plain object
  const newObservations = JSON.parse(JSON.stringify(data.observations));

  const docRef = db.collection("fredCache").doc(seriesId);
  const doc = await docRef.get();

  let existingData = [];
  if (doc.exists) {
    existingData = doc.data().observations || [];
  }

  // Merge the existing cached data with new observations ensuring no duplicates
  const observations = mergeObservations(existingData, newObservations);

  // Save the combined data to Firestore
  await db.collection("fredCache").doc(seriesId).set({observations});
  if (data.title) {
    await db.collection("fredCache").doc(seriesId).set({title: data.title});
  }
}

// Helper function to merge observations and remove duplicates
function mergeObservations(existingObservations, newObservations) {
  const observationMap = new Map();

  // First add new observations (prioritize fresh data)
  newObservations.forEach((obs) => {
    observationMap.set(obs.date, obs);
  });

  // Then add existing cached observations
  // (only if the date is not already in the new data)
  existingObservations.forEach((obs) => {
    if (!observationMap.has(obs.date)) {
      observationMap.set(obs.date, obs);
    }
  });

  // Convert map back to array and sort by date
  return Array.from(observationMap.values()).sort((a, b) =>
    new Date(a.date) - new Date(b.date));
}


module.exports = {getCachedData, setCachedData};
