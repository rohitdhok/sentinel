import { useEffect, useState } from "react";
import "./UserAnalyticsPage.css";
import { getEventsUsername } from "../services/eventsServices";
import { getUserAlertDistribution, getUserEventDistribution, getUserLoginHistory, getUserOverview, getUserSeverityDistribution } from "../services/analyticsService";
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Sector
} from "recharts";

const API = "http://localhost:3000";

function UserAnalyticsPage() {
    const [usernames, setUsernames] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [eventDistribution, setEventDistribution] = useState([]);
    const [alertDistribution, setAlertDistribution] = useState([]);
    const [severityDistribution, setSeverityDistribution] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);

    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch usernames
    useEffect(() => {
        async function fetchUsernames() {
            try {
                const data = await getEventsUsername()
                setUsernames(data.usernames);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUsernames();
    }, []);

    useEffect(() => {
        if (!selectedUser) {
            setOverview(null);
            return;
        }

        async function fetchOverview() {
            try {
                setLoading(true);
                setError("");

                const [data, eventDistributionData, alertDistributionData, severityDistributionData, loginHistoryData] = await Promise.all([
                    getUserOverview(selectedUser),
                    getUserEventDistribution(selectedUser),
                    getUserAlertDistribution(selectedUser),
                    getUserSeverityDistribution(selectedUser),
                    getUserLoginHistory(selectedUser)
                ])

                setOverview(data.userOverview);
                setEventDistribution(eventDistributionData.userEventDistribution)
                setAlertDistribution(alertDistributionData.userAlertDistribution)
                setSeverityDistribution(severityDistributionData.userSeverityDistribution)
                setLoginHistory(loginHistoryData.userLoginHistory)
            } catch (error) {
                setOverview(null);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOverview();
    }, [selectedUser]);

    const cards = [
        {
            title: "Total Events",
            value: overview?.total_events ?? "—",
        },
        {
            title: "Total Alerts",
            value: overview?.total_alerts ?? "—",
        },
        {
            title: "Last Activity",
            value: overview?.last_activity
                ? new Date(overview.last_activity).toLocaleString()
                : "—",
        },
        {
            title: "Login Count",
            value: overview?.login_count ?? "—",
        },
    ];

    console.log(alertDistribution)

    return (
        <main className="user-analytics-page">
            <header className="user-analytics-header">
                <h1>User Analytics</h1>
                <p>Analyze security activity for individual users.</p>
            </header>

            <section className="user-selector">
                <label htmlFor="username">Select User</label>

                <select
                    id="username"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">Choose a user</option>

                    {usernames.map((user) => (
                        <option key={user.username} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </section>

            {loading && <p>Loading user analytics...</p>}

            {error && <p className="analytics-error">{error}</p>}
            
            {/* User Overview */}
            {selectedUser && !loading && !error && (
                <section className="user-overview">
                    {cards.map((card) => (
                        <article className="overview-card" key={card.title}>
                            <h3>{card.title}</h3>
                            <p>{card.value}</p>
                        </article>
                    ))}
                </section>
            )}

            <hr className="section-divider" />
            
            {/* Event Distribution*/}
            {selectedUser && !loading && !error && (
                <section className="user-analytics-section">
                    <h2>Event Distribution</h2>

                    {eventDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={eventDistribution}
                                layout="vertical"
                                margin={{ left: 20, right: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis
                                    type="category"
                                    dataKey="event_type"
                                    width={190}
                                />
                                <Tooltip />
                                <Bar dataKey="total" name="Events" fill="#8884d8" barSize={18}/>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No event distribution data available.</p>
                    )}
                </section>
            )}

            {/* Alert Distribution*/}
            {selectedUser && !loading && !error && (
                <section className="user-analytics-section">
                    <h2>Alert Distribution</h2>

                    {alertDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={alertDistribution}
                                layout="vertical"
                                margin={{ left: 20, right: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis
                                    type="category"
                                    dataKey="alert_type"
                                    width={220}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="total"
                                    name="Alerts"
                                    fill="#e07a5f"
                                    barSize={18}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No alerts recorded for this user.</p>
                    )}
                </section>
            )}

            {selectedUser && !loading && !error && (
                <div className="user-analytics-bottom-grid">

                    {/* Alert Severity Distribution */}
                    <section className="user-analytics-section">
                        <h2>Alert Severity Distribution</h2>

                        {severityDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie
                                        data={severityDistribution}
                                        dataKey="total"
                                        nameKey="severity"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={115}
                                        paddingAngle={3}
                                        shape={(props) => {
                                            const colors = {
                                                high: "#e5a84b",
                                                "very high": "#e57373",
                                                critical: "#b05ce6"
                                            };

                                            return (
                                                <Sector
                                                    {...props}
                                                    fill={
                                                        colors[props.payload.severity] ||
                                                        "#858c92"
                                                    }
                                                />
                                            );
                                        }}
                                    />

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No alert severity data available.</p>
                        )}
                    </section>

                    {/* Recent Login History */}
                    <section className="user-analytics-section">
                        <h2>Recent Login History</h2>

                        {loginHistory.length > 0 ? (
                            <div className="login-history-table-wrapper">
                                <table className="login-history-table">
                                    <thead>
                                        <tr>
                                            <th>Login Time</th>
                                            <th>Login Source</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loginHistory.map((login, index) => (
                                            <tr key={`${login.timestamp}-${index}`}>
                                                <td>
                                                    {new Date(login.timestamp).toLocaleString()}
                                                </td>
                                                <td>{login.service}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No login history available.</p>
                        )}
                    </section>

                </div>
            )}
        </main>
    );
}

export default UserAnalyticsPage;