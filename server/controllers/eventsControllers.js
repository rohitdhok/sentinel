const {getAllEvents, getEventsByUsername, getEventsByType, getTotalEventsCount, getEventsByFilter,  getFilteredEventCount} = require("../helpers/eventHelpers");
const limit = 15;

async function handleGetAllEvents(req, res) {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const totalEvents = await getTotalEventsCount();
        const totalPages = Math.ceil(totalEvents / limit)

        const events = await getAllEvents(page);

        return res.json({events, totalPages, currentPage: page, totalEvents});
    } catch(e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

async function handleGetEventsByUsername(req, res) {
    try {
        const username = req.params.username;

        const page = Math.max(1, Number(req.query.page) || 1);
        const totalEvents = await getFilteredEventCount(username, null);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await getEventsByUsername(username, page);

        return res.json({events, totalEvents, totalPages, currentPage: page})
    } catch(e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

async function handleGetEventsByType(req, res) {
    try {
        const event_type = req.params.type;

        const page = Math.max(1, Number(req.query.page) || 1);
        const totalEvents = await getFilteredEventCount(null, event_type);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await getEventsByType(event_type, page);

        return res.json({events, totalEvents, totalPages, currentPage: page})
    } catch(e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

async function handleGetEventsByFilter(req, res) {
    try {
        const username = req.query.username;
        const event_type = req.query.event_type;

        const page = Math.max(1, Number(req.query.page) || 1);
        const totalEvents = await getFilteredEventCount(username, event_type);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await getEventsByFilter(username, event_type, page);

        return res.json({events, totalEvents, totalPages, currentPage: page})
    } catch(e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = {handleGetAllEvents, handleGetEventsByUsername, handleGetEventsByType, handleGetEventsByFilter}