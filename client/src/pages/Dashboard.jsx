import { useEffect, useState } from "react";
import { getAlerts, getAlertsStats } from "../services/alertsServices";
import "./Dashboard.css";

function Dashboard() {
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        async function loadDashboard() {
            const data = await getAlerts();
            const statsData = await getAlertsStats();

            setAlerts(data.alerts);
            setStats(statsData);
        }

        loadDashboard();
    }, []);

    return (
        <div className="dashboard">

            <aside className="sidebar">
                <div className="brand">
                    <h1>Sentinel</h1>
                    <span>Linux Threat Detection</span>
                </div>

                <nav>
                    <a className="active">Dashboard</a>
                    <a>Events</a>
                    <a>Alerts</a>
                    <a>Analytics</a>
                    <a>Detection Rules</a>
                    <a>Security Knowledge</a>
                </nav>

                <div className="sidebar-bottom">
                    <a>System Status</a>
                </div>
            </aside>

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <h2>Dashboard</h2>
                        <p>Security overview of the monitored system</p>
                    </div>

                    <div className="system-status">
                        <span></span>
                        System Online
                    </div>
                </header>

                <section className="stats-grid">

                    <div className="stat-card">
                        <span className="stat-label">Total Alerts</span>
                        <strong>{stats.total_alerts}</strong>
                        <small>Detected events</small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">High Severity</span>
                        <strong>{stats.high_alerts}</strong>
                        <small>Require attention</small>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Critical</span>
                        <strong>{stats.critical_alerts}</strong>
                        <small>Immediate attention</small>
                    </div>

                </section>

                <section className="alerts-section">

                    <div className="section-header">
                        <div>
                            <h3>Recent Alerts</h3>
                            <p>Latest security events detected by Sentinel</p>
                        </div>
                    </div>

                    <div className="alerts-table">

                        <div className="table-header">
                            <span>Time</span>
                            <span>User</span>
                            <span>Alert</span>
                            <span>Severity</span>
                            <span>Attempts</span>
                        </div>

                        {stats.recent_alerts?.map((alert) => (
                            <div className="alert-row" key={alert.id}>
                                <span>
                                    {new Date(alert.first_event).toLocaleTimeString()}
                                </span>

                                <span>{alert.username}</span>

                                <span>{alert.alert_type}</span>

                                <span className={`severity ${alert.severity.replace(" ", "-")}`}>
                                    {alert.severity}
                                </span>

                                <span>{alert.total_attempts}</span>
                            </div>
                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;