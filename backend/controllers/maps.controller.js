const { getAddressCoordinate, getDistanceAndTime, getAutoCompleteSuggestions } = require("../services/Maps.service");

const getCoordinates = async(req, res, next) =>{
    const {address} = req.query;     
    try {
        const coordinates = await getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

}

const getDistanceTime = async(req, res, next) =>{
    const { origin, destination } = req.query;
    if(!origin  || !destination)
        return res.status(400).json({ message: "Invalid request. Please provide origin and destination addresses." });

    try {
        const response = await getDistanceAndTime(origin, destination);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const getAutoSuggestions = async (req, res, next) => {

    try {
        const { input } = req.query;

        const suggestions = await getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getCoordinates, getDistanceTime, getAutoSuggestions };