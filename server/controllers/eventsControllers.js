const {getAllEvents, getEventsByUsername, getEventsByType, getTotalEventsCount, getEventsByFilter,  getFilteredEventCount, getEventsDistribution, getEventActivity} = require("../helpers/eventHelpers");
const { getPage } = require("../helpers/generalUtility");

const limit = 15;
const event_types = ["authentication_failure", "failed_privilege_switch", "privilege_switch", "privileged_session_opened", "sudo_command", "session_opened", "session_closed"]

async function handleGetAllEvents(req, res, next) {
    try {
        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalEvents = await getTotalEventsCount();
        const totalPages = Math.ceil(totalEvents / limit)

        const events = await getAllEvents(page);

        return res.json({events, totalPages, currentPage: page, totalEvents});
    } catch(e) {
        return next(e);
    }
}

async function handleGetEventsByUsername(req, res, next) {
    try {
        const username = req.params.username;

        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalEvents = await getFilteredEventCount(username, null);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await getEventsByUsername(username, page);

        return res.json({events, totalEvents, totalPages, currentPage: page})
    } catch(e) {
        return next(e);
    }
}

async function handleGetEventsByType(req, res, next) {
    try {
        const event_type = req.params.type;

        if (!event_types.includes(event_type)) { return res.status(400).json({ message: "invalid event type" }) }

        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalEvents = await getFilteredEventCount(null, event_type);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await getEventsByType(event_type, page);

        return res.json({events, totalEvents, totalPages, currentPage: page})
    } catch(e) {
        return next(e);
    }
}

async function handleGetEventsByFilter(req, res, next) {
    try {
        const username = req.query.username;
        const event_type = req.query.event_type;

        if (!event_types.includes(event_type)) { return res.status(400).json({ message: "invalid event type" }) }

        const page = getPage(req.query.page)
        if (page == null) { return res.status(400).json({message : "Invalid page number."}) }

        const totalEvents = await getFilteredEventCount(username, event_type);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await getEventsByFilter(username, event_type, page);

        return res.json({events, totalEvents, totalPages, currentPage: page})
    } catch(e) {
        return next(e);
    }
}

async function handleGetEventsDistribution(req, res, next) {
    try {
        const eventsDistribution = await getEventsDistribution();
        return res.json({eventsDistribution})
    } catch(e) {
        return next(e);
    }
}

async function handleGetEventActivity(req, res, next) {
    try {
        const eventsActivity = await getEventActivity();

        return res.json({eventsActivity})
    } catch(e) {
        return next(e)
    }
}

module.exports = {handleGetAllEvents, handleGetEventsByUsername,
    handleGetEventsByType, handleGetEventsByFilter,
    handleGetEventsDistribution, handleGetEventActivity}