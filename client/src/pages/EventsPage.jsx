import { useEffect, useState } from "react";
import { getEvents, getEventsByFilter, getEventsByType, getEventsByUsername, getUsernames } from "../services/eventsServices";
import "./EventsPage.css";

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [eventType, setEventType] = useState("");
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUsers() {
            const data = await getUsernames();
            setUsers(data.users);
        }

        loadUsers();
    }, []);

    useEffect(() => {
        async function loadEvents() {
            try {
                let data;
            
                if (username && eventType) {
                    data = await getEventsByFilter(username, eventType, page);
                } else if (username) {
                    data = await getEventsByUsername(username, page);
                } else if (eventType) {
                    data = await getEventsByType(eventType, page);
                } else {
                    data = await getEvents(page);
                }
                console.log("Events received:", data.events.length);
                console.log("Latest event:", data.events[0]);
                setEvents(data.events);
                setTotalEvents(data.totalEvents);
                setTotalPages(data.totalPages)
            } catch(err) {
                console.log(`Failed to load events : ${err}`);
                setError("Unable to load events. Please try again")
                setEvents([]);
            }
        }

        loadEvents();
    }, [username, eventType, page]);

    return (
        <div className="events-page">
            <header className="events-header">
                <div>
                    <h2>Events</h2>
                    <p>Security-relevant events collected from the monitored system</p>
                </div>

                <div className="event-count">
                    {totalEvents} events
                </div>
            </header>

            <section className="events-section">
                <div className="events-toolbar">
                    <label htmlFor="type-filter">Event Type</label>

                    <select
                        id="type-filter"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="authentication_failure">Authentication Failure</option>
                        <option value="failed_privilege_switch">Failed Privilege Switch</option>
                        <option value="privilege_switch">Privilege Switch</option>
                        <option value="privileged_session_opened">Privileged Session Opened</option>
                        <option value="sudo_command">Sudo Command</option>
                        <option value="session_opened">Session Opened</option>
                        <option value="session_closed">Session Closed</option>
                    </select>
                </div>

                <div className="events-toolbar">
                    <label htmlFor="user-filter">Username</label>

                    <select
                        id="user-filter"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    >
                        <option value="">All Users</option>

                        {users.map((user) => (
                            <option key={user.username} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <div className="error-message">{error}</div>}
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

                <div className="pagination">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <span>Page {page}</span>

                    <button disabled={totalPages <= page} onClick={() => setPage(p => p + 1)}>
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
}

export default EventsPage;