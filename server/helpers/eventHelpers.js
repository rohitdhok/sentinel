const pool = require("./db")
const limit = 15

async function getAllEvents(page) {
    const offset = ( page - 1 ) * limit
    return (await pool.query("SELECT * FROM events ORDER BY timestamp DESC LIMIT $1 OFFSET $2", [limit, offset])).rows
}

async function getEventsByUsername(username, page) {
    const offset = ( page - 1 ) * limit
    return (await pool.query("SELECT * FROM events WHERE username = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3", [username, limit, offset])).rows
}

async function getEventsByType(event_type, page) {
    const offset = ( page - 1 ) * limit
    return (await pool.query("SELECT * FROM events WHERE event_type = $1 ORDER BY timestamp DESC LIMIT $$2 OFFSET $3", [event_type, page, offset])).rows
}

async function getEventsByFilter(username, event_type, page) {
    const offset = ( page - 1 ) * limit
    return (await pool.query("SELECT * FROM events WHERE username=$1 AND event_type=$2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4", [username, event_type, limit, offset])).rows
}

async function getTotalEventsCount() {
    return Number((await pool.query("SELECT COUNT(*) FROM events")).rows[0].count)
}

async function getFilteredEventCount(username, event_type) {
    return Number((await pool.query("SELECT COUNT(*) FROM events WHERE ($1::text IS NULL OR username = $1) AND ($2::text IS NULL OR event_type = $2)", [username, event_type])).rows[0].count)
}

module.exports = {getAllEvents, getEventsByUsername, getEventsByType, getTotalEventsCount, getFilteredEventCount, getEventsByFilter}