const axios = require("axios");
const captainModel = require("../models/captain.model");

const getAddressCoordinate = async (address) => {
  const url = `${process.env.COORDINATE_API_URL}q=${encodeURIComponent(
    address
  )}&apiKey=${process.env.API_KEY}`;
  try {
    const response = await axios.get(url);
    if (response) {
      const location = response.data.items[0].position;

      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    throw error;
  }
};

const getDistanceAndTime = async (address1, address2) => {
  const { ltd: ltd1, lng: lng1 } = await getAddressCoordinate(address1);
  const { ltd: ltd2, lng: lng2 } = await getAddressCoordinate(address2);
  const url = `${process.env.DISTANCE_API_URL}origin=${ltd1},${lng1}&destination=${ltd2},${lng2}&return=summary&apiKey=${process.env.API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response) {
      const { length, duration } = response.data.routes[0].sections[0].summary;
      return {
        length: length,
        duration: duration,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    throw error;
  }
};

const getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.API_KEY;
  const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=28.756758,77.494811&limit=6&q=${input}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response) {
      return response.data.items
        .map((prediction) => prediction.title)
        .filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    throw err;
  }
};

const getCaptainInTheRadius = async (ltd, lng, radius) => {
  
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6378],
      },
    },
  });
  return captains;
};

module.exports = {
  getAddressCoordinate,
  getDistanceAndTime,
  getAutoCompleteSuggestions,
  getCaptainInTheRadius
};
