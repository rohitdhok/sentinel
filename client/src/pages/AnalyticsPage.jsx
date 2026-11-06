import { useEffect, useState } from "react";
import { getEventActivity, getEventsDistribution } from "../services/eventsServices";
import "./AnalyticsPage.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Pie,
    PieChart,
    Legend,
    Sector
} from "recharts";
import { getAlertsSeverityDistribution } from "../services/alertsServices";


function formatActivityTime(value) {
    return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }).format(new Date(value));
}

function AnalyticsPage() {
    const [eventsDistribution, setEventsDistribution] = useState([]);
    const [eventsActivity, setEventsActivity] = useState([]);
    const [severityDistribution, setSeverityDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [data, activity_data, severity_data] = await Promise.all([
                    getEventsDistribution(),
                    getEventActivity(),
                    getAlertsSeverityDistribution()
                ]);
                setEventsDistribution(data.eventsDistribution);
                setEventsActivity(activity_data.eventsActivity);
                setSeverityDistribution(severity_data.severityDistribution);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const totalEvents = eventsDistribution.reduce(
        (total, event) => total + event.total,
        0
    );

    const totalEventTypes = eventsDistribution.length;

    return (
        <main className="analytics-page">

            <header className="analytics-header">
                <div>
                    <h1>Security Analytics</h1>
                    <p>Insights and statistics from your system activity.</p>
                </div>
            </header>

            {/* Summary Cards */}
            <section className="analytics-summary">

                <div className="analytics-card">
                    <span className="analytics-card-label">Total Events</span>
                    <h2>{loading ? "--" : totalEvents.toLocaleString()}</h2>
                    <span className="analytics-card-description">
                        Recorded system events
                    </span>
                </div>

                <div className="analytics-card">
                    <span className="analytics-card-label">Event Types</span>
                    <h2>{loading ? "--" : totalEventTypes}</h2>
                    <span className="analytics-card-description">
                        Distinct event categories
                    </span>
                </div>

                <div className="analytics-card">
                    <span className="analytics-card-label">Total Alerts</span>
                    <h2>--</h2>
                    <span className="analytics-card-description">
                        Alert statistics coming soon
                    </span>
                </div>

            </section>

            {/* Event Distribution */}
            <section className="analytics-section">

                <div className="analytics-section-header">
                    <div>
                        <h2>Event Distribution</h2>
                        <p>Breakdown of recorded events by category.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="analytics-state">
                        Loading event distribution...
                    </div>
                ) : error ? (
                    <div className="analytics-state analytics-error">
                        {error}
                    </div>
                ) : eventsDistribution.length === 0 ? (
                    <div className="analytics-state">
                        No event data available.
                    </div>
                ) : (
                    <div className="analytics-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={eventsDistribution}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 25,
                                    bottom: 10
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="#292e32"
                                />

                                <XAxis
                                    type="number"
                                    stroke="#777f86"
                                    tick={{ fill: "#858c92", fontSize: 11 }}
                                    axisLine={{ stroke: "#34393e" }}
                                    tickLine={false}
                                    allowDecimals={false}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="event_type"
                                    width={190}
                                    stroke="#777f86"
                                    tick={{ fill: "#b8bec3", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    cursor={{ fill: "rgba(148,163,184,0.08)" }}
                                    contentStyle={{
                                        backgroundColor: "#151e2e",
                                        border: "1px solid #334155",
                                        borderRadius: "8px",
                                        color: "#f1f5f9"
                                    }}
                                    formatter={(value) => [
                                        value,
                                        "Total Events"
                                    ]}
                                />

                                <Bar
                                    dataKey="total"
                                    name="Events"
                                    fill="#858c92"
                                    radius={[0, 3, 3, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

            </section>

            <br />
            
            <div className="analytics-charts-grid">
                {/* Events Activity ( 24 hours ) */}
                <section className="analytics-section">
                    <div className="section-header">
                        <div>
                            <h2>Event Activity</h2>
                            <p>Hourly event activity over the last 24 hours</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="analytics-message">Loading activity...</p>
                    ) : error ? (
                        <p className="analytics-error">{error}</p>
                    ) : eventsActivity.length === 0 ? (
                        <p className="analytics-message">No activity recorded.</p>
                    ) : (
                        <div className="activity-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={eventsActivity}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#292e32"
                                    />

                                    <XAxis
                                        dataKey="period"
                                        tickFormatter={formatActivityTime}
                                        stroke="#858c92"
                                        tick={{ fontSize: 11 }}
                                        minTickGap={30}
                                    />

                                    <YAxis
                                        stroke="#858c92"
                                        tick={{ fontSize: 11 }}
                                        allowDecimals={false}
                                    />

                                    <Tooltip
                                        labelFormatter={formatActivityTime}
                                        contentStyle={{
                                            backgroundColor: "#181b1e",
                                            border: "1px solid #34393e",
                                            borderRadius: "5px",
                                            color: "#e7e9ea"
                                        }}
                                        labelStyle={{ color: "#e7e9ea" }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        name="Events"
                                        stroke="#858c92"
                                        strokeWidth={2}
                                        dot={{
                                            r: 4,
                                            fill: "#858c92",
                                            strokeWidth: 0
                                        }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </section>

                {/* Alerts Severity Distribution */}
                <section className="analytics-section">
                    <div className="section-header">
                        <div>
                            <h2>Alert Severity Distribution</h2>
                            <p>Breakdown of alerts by severity level</p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="analytics-message">Loading severity data...</p>
                    ) : error ? (
                        <p className="analytics-error">{error}</p>
                    ) : severityDistribution.length === 0 ? (
                        <p className="analytics-message">No alerts recorded.</p>
                    ) : (
                        <div className="severity-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={severityDistribution}
                                        dataKey="total"
                                        nameKey="severity"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={100}
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

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#181b1e",
                                            border: "1px solid #34393e",
                                            borderRadius: "5px",
                                            color: "#e7e9ea"
                                        }}
                                    />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </section>
            </div>


        </main>
    );
}

export default AnalyticsPage;