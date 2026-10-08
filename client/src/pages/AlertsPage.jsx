import { useEffect, useState } from "react";
import { getAlerts, getAlertsBySeverity, getAlertsByUsername, getUsernames, getAlertsByFilter } from "../services/alertsServices";
import "./AlertsPage.css";

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [severity, setSeverity] = useState("");
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("");

    useEffect(() => {
        async function loadUsers() {
            const data = await getUsernames();
            setUsers(data.users);
        }

        loadUsers();
    }, []);

    useEffect(() => {
        async function loadAlerts() {
            let data;

            if (severity && username) {
                data = await getAlertsByFilter(severity, username);
            } else if (severity) {
                data = await getAlertsBySeverity(severity);
            } else if (username) {
                data = await getAlertsByUsername(username);
            } else {
                data = await getAlerts();
            }

            setAlerts(data.alerts);
        }
        loadAlerts();
    }, [severity, username]);

    return (
        <div className="alerts-page">
            <header className="alerts-header">
                <div>
                    <h2>Alerts</h2>
                    <p>Suspicious activity detected by Sentinel</p>
                </div>

                <div className="alert-count">
                    {alerts.length} alerts
                </div>
            </header>

            <section className="alerts-section">
                <div className="alerts-toolbar">
                    <label htmlFor="severity-filter">Severity</label>

                    <select
                        id="severity-filter"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                    >
                        <option value="">All severities</option>
                        <option value="high">High</option>
                        <option value="very high">Very High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <div className="alerts-toolbar">
                    <label htmlFor="user-filter">Username</label>

                    <select
                        id="user-filter"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    >
                        <option value="">All</option>
                        {users.map((user) => (
                            <option key={user.username} value={user.username}>{user.username}</option>
                        ))}
                    </select>
                </div>

                <div className="alerts-table">
                    <div className="alerts-table-header">
                        <span>Time</span>
                        <span>User</span>
                        <span>Alert Type</span>
                        <span>Severity</span>
                        <span>Attempts</span>
                        <span>Window</span>
                    </div>

                    {alerts.map((alert) => (
                        <div className="alert-row" key={alert.id}>
                            <span>
                                {new Date(alert.first_event).toLocaleString()}
                            </span>

                            <span title={alert.username || ""}>
                                {alert.username || "—"}
                            </span>

                            <span title={alert.alert_type}>
                                {alert.alert_type}
                            </span>

                            <span>
                                <span className={`severity ${alert.severity.replace(" ", "-")}`}>
                                    {alert.severity}
                                </span>
                            </span>

                            <span>{alert.total_attempts}</span>

                            <span title={alert.time_window}>
                                {alert.time_window}
                            </span>
                        </div>
                    ))}

                    {alerts.length === 0 && (
                        <div className="no-alerts">
                            No alerts recorded.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AlertsPage;