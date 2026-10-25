const API = "http://localhost:3000"

async function getEvents(page) {
    const response = await fetch(API+`/events?page=${page}`);
    const events = await response.json()
    return events;
}

async function getEventsByFilter(username, event_type, page) {
    const response = await fetch(API + `/events/filter?username=${username}&event_type=${event_type}&page=${page}`);
    const events = await response.json()
    return events;
}

async function getUsernames() {
    const response = await fetch(API + `/alerts/users`);
    const data = await response.json();
    return data
}

async function getEventsByUsername(username, page) {
    const response = await fetch(API + `/events/user/${username}?page=${page}`);
    const events = await response.json();
    return events;
}

async function getEventsByType(event_type, page) {
    const response = await fetch(API + `/events/type/${event_type}?page=${page}`);
    const events = await response.json();
    return events;
}

export {getEvents, getEventsByFilter, getEventsByUsername, getEventsByType, getUsernames}