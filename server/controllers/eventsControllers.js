const {getAllEvents, getEventsByUsername, getEventsByType} = require("../helpers/eventHelpers");

async function handleGetAllEvents(req, res) {
    try {
        const events = await getAllEvents();
        return res.json({events});
    } catch(e) {
        return res.json({message: "Internal Server Error"});
    }
}

async function handleGetEventsByUsername(req, res) {
    try {
        const username = req.params.username;
        const events = await getEventsByUsername(username);

        return res.json({events});
    } catch(e) {
        return res.json({message: "Internal Server Error"});
    }
}

async function handleGetEventsByType(req, res) {
    try {
        const type = req.params.type;
        const events = await getEventsByType(type);

        return res.json({events});
    } catch(e) {
        return res.json({message: "Internal Server Error"});
    }
}

module.exports = {handleGetAllEvents, handleGetEventsByUsername, handleGetEventsByType}