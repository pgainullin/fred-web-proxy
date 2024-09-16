const axios = require("axios");
const {FredSeries} = require("./entities");
const {getCachedData, setCachedData} = require("./cache");
const {yyyyMmDd} = require("./date_formats");

const FRED_API_URL = "https://api.stlouisfed.org/fred/series/observations";


async function getFredData(seriesId, startDate, endDate, apiKey) {
  // Check cache
  const cachedData = (await getCachedData(seriesId, startDate, endDate)) ??
    {"observations": []};
  const cachedObservations = cachedData.observations;

  // Determine if there is a cache miss (i.e., missing data
  // for some portion of the requested range)
  const cachedStartDate = cachedObservations.length > 0 ?
    cachedObservations[0].date : null;
  const cachedEndDate = cachedObservations.length > 0 ?
    cachedObservations[cachedObservations.length - 1].date : null;

  let fetchFromAPI = false;
  let apiStartDate = startDate;
  let apiEndDate = endDate;

  // Handle partial cache coverage
  if (cachedObservations.length > 0) {
    // If cache has data but not for the full range, adjust the API query to
    // only get the missing parts
    if (!apiStartDate || apiStartDate < cachedStartDate) {
      // Fetch data from startDate to the first cached date
      apiEndDate = cachedStartDate;
      fetchFromAPI = true;
    }

    if (!apiEndDate || apiEndDate > cachedEndDate) {
      // Fetch data from last cached date to endDate
      apiStartDate = cachedEndDate;
      fetchFromAPI = true;
    }
  } else {
    // If no cached data exists, we need to fetch everything from the API
    fetchFromAPI = true;
  }

  let freshData = [];
  let title;
  if (fetchFromAPI) {
    const params = {
      series_id: seriesId,
      api_key: apiKey,
      file_type: "json",
      observation_start: startDate ? yyyyMmDd(startDate) : undefined,
      observation_end: endDate ? yyyyMmDd(endDate) : undefined,
    };

    const response = await axios.get(FRED_API_URL, {params});
    freshData = response.data.observations.map((obs) => ({
      date: obs.date,
      value: isNaN(parseFloat(obs.value)) ? null : parseFloat(obs.value),
      // value: parseFloat(obs.value),
    }));

    title = response.data.title;
    const fredSeries = new FredSeries(seriesId, response.data.title, freshData);

    // Cache the new data
    await setCachedData(seriesId, fredSeries);
  }

  // Step 5: Merge the cached and fresh data, avoiding duplicates
  const combinedObservations = mergeObservations(cachedObservations, freshData);

  const fredSeries = new FredSeries(seriesId, title ?? cachedData.title ??
    "", combinedObservations);

  return fredSeries;
}

// Helper function to merge observations and remove duplicates
function mergeObservations(cachedObservations, freshObservations) {
  const observationMap = new Map();

  // First add fresh observations (prioritize API data)
  freshObservations.forEach((obs) => {
    observationMap.set(obs.date, obs);
  });

  // Then add cached observations (only if the date is
  // not already in the fresh data)
  cachedObservations.forEach((obs) => {
    if (!observationMap.has(obs.date)) {
      observationMap.set(obs.date, obs);
    }
  });

  // Convert map back to array and sort by date
  return Array.from(observationMap.values()).sort((a, b) =>
    new Date(a.date) - new Date(b.date));
}


module.exports = {getFredData};
