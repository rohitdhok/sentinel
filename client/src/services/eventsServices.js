const API = "http://localhost:3000"

async function getEvents() {
    const response = await fetch(API+"/events");
    const events = await response.json()
    return events;
}

export {getEvents}