import { useEffect, useState } from "react";
import { getEvents } from "../services/eventsServices";
import "./EventsPage.css";

function EventsPage() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function loadEvents() {
            const data = await getEvents();
            setEvents(data.events);
        }

        loadEvents();
    }, []);

    return (
        <div className="events-page">
            <header className="events-header">
                <div>
                    <h2>Events</h2>
                    <p>Security-relevant events collected from the monitored system</p>
                </div>

                <div className="event-count">
                    {events.length} events
                </div>
            </header>

            <section className="events-section">
                <div className="events-table">
                    <div className="events-table-header">
                        <span>Time</span>
                        <span>User</span>
                        <span>Event Type</span>
                        <span>Service</span>
                        <span>Host</span>
                        <span>Message</span>
                    </div>

                    {events.map((event) => (
                        <div className="event-row" key={event.id}>
                            <span>
                                {new Date(event.timestamp).toLocaleString()}
                            </span>

                            <span>
                                {event.username || "—"}
                            </span>

                            <span className="event-type">
                                {event.event_type}
                            </span>

                            <span title={event.service || ""}>
                                {event.service || "—"}
                            </span>

                            <span>
                                {event.host || "—"}
                            </span>

                            <span className="event-message" title={event.message}>
                                {event.message}
                            </span>
                        </div>
                    ))}

                    {events.length === 0 && (
                        <div className="no-events">
                            No events recorded.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default EventsPage;