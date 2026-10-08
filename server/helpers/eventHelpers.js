const pool = require("./db")

async function getAllEvents() {
    return (await pool.query("SELECT * FROM events")).rows
}

async function getEventsByUsername(username) {
    return (await pool.query("SELECT * FROM events WHERE username = $1", [username])).rows
}

async function getEventsByType(event_type) {
    return (await pool.query("SELECT * FROM events WHERE event_type = $1", [event_type])).rows
}

module.exports = {getAllEvents, getEventsByUsername, getEventsByType}