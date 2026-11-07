import { useEffect, useState } from "react";
import "./DetectionRulesPage.css";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/rules`;

const severityOptions = ["high", "very high", "critical"];

function DetectionRulesPage() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState("");

    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        threshold: "",
        window_minutes: "",
        severity: "high"
    });

    // Fetch all rules
    async function fetchRules() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch detection rules");
            }

            const data = await response.json();
            setRules(data.rules);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRules();
    }, []);

    // Show notification
    function showNotification(message) {
        setNotification(message);

        setTimeout(() => {
            setNotification("");
        }, 3000);
    }

    // Toggle rule status
    async function handleToggleRule(id) {
        try {
            const response = await fetch(`${API_URL}/${id}/toggle`, {
                method: "PATCH"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to toggle rule");
            }

            setRules(prev =>
                prev.map(rule =>
                    rule.id === id ? data.rule : rule
                )
            );

            showNotification("Rule status updated successfully");

        } catch (err) {
            showNotification(err.message);
        }
    }

    // Open edit modal
    function openEditModal(rule) {
        setEditingRule(rule);

        setFormData({
            threshold: rule.threshold,
            window_minutes: rule.window_minutes,
            severity: rule.severity
        });
    }

    // Handle form changes
    function handleChange(e) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Update rule
    async function handleUpdateRule(e) {
        e.preventDefault();

        const threshold = Number(formData.threshold);
        const window_minutes = Number(formData.window_minutes);

        if (!Number.isInteger(threshold) || threshold <= 0) {
            showNotification("Threshold must be a positive integer");
            return;
        }

        if (!Number.isInteger(window_minutes) || window_minutes <= 0) {
            showNotification("Time window must be a positive integer");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/update/${editingRule.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    threshold,
                    window_minutes,
                    severity: formData.severity
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update rule");
            }

            setRules(prev =>
                prev.map(rule =>
                    rule.id === editingRule.id ? data.rule : rule
                )
            );

            setEditingRule(null);
            showNotification("Detection rule updated successfully");

        } catch (err) {
            showNotification(err.message);
        }
    }

    const activeRules = rules.filter(rule => rule.enabled).length;
    const disabledRules = rules.length - activeRules;

    if (loading) {
        return (
            <div className="detection-rules-page">
                <p className="rules-loading">Loading detection rules...</p>
            </div>
        );
    }

    return (
        <div className="detection-rules-page">

            {/* Header */}
            <div className="rules-page-header">
                <div>
                    <h1>Detection Rules</h1>
                    <p>Configure and manage your threat detection engine.</p>
                </div>

                <button
                    className="rules-refresh-btn"
                    onClick={fetchRules}
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="rules-stats">

                <div className="rules-stat-card">
                    <span>Total Rules</span>
                    <h2>{rules.length}</h2>
                </div>

                <div className="rules-stat-card">
                    <span>Active Rules</span>
                    <h2 className="active-count">{activeRules}</h2>
                </div>

                <div className="rules-stat-card">
                    <span>Disabled Rules</span>
                    <h2 className="disabled-count">{disabledRules}</h2>
                </div>

            </div>

            {/* Error */}
            {error && (
                <div className="rules-error">
                    {error}
                    <button onClick={fetchRules}>Retry</button>
                </div>
            )}

            {/* Rules Table */}
            <div className="rules-table-container">

                <div className="rules-table-heading">
                    <div>
                        <h2>Configured Rules</h2>
                        <p>Manage detection thresholds and severity levels.</p>
                    </div>
                </div>

                <table className="rules-table">

                    <thead>
                        <tr>
                            <th>Detection Rule</th>
                            <th>Threshold</th>
                            <th>Time Window</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {rules.map(rule => (
                            <tr key={rule.id}>

                                <td>
                                    <div className="rule-name">
                                        {rule.alert_type
                                            .replaceAll("_", " ")
                                            .replace(/\b\w/g, char => char.toUpperCase())
                                        }
                                    </div>

                                    <div className="rule-event-type">
                                        {rule.event_type}
                                    </div>
                                </td>

                                <td>
                                    <span className="rule-value">
                                        {rule.threshold} attempts
                                    </span>
                                </td>

                                <td>
                                    <span className="rule-value">
                                        {rule.window_minutes} minutes
                                    </span>
                                </td>

                                <td>
                                    <span className={`severity-badge severity-${rule.severity.replace(" ", "-")}`}>
                                        {rule.severity}
                                    </span>
                                </td>

                                <td>
                                    <span className={`rule-status ${rule.enabled ? "status-enabled" : "status-disabled"}`}>
                                        <span className="status-dot"></span>
                                        {rule.enabled ? "Enabled" : "Disabled"}
                                    </span>
                                </td>

                                <td>
                                    <div className="rule-actions">

                                        <button
                                            className="rule-edit-btn"
                                            onClick={() => openEditModal(rule)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className={`rule-toggle-btn ${rule.enabled ? "toggle-disable" : "toggle-enable"}`}
                                            onClick={() => handleToggleRule(rule.id)}
                                        >
                                            {rule.enabled ? "Disable" : "Enable"}
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}

                        {rules.length === 0 && !error && (
                            <tr>
                                <td colSpan="6" className="empty-rules">
                                    No detection rules configured.
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>

            {/* Edit Modal */}
            {editingRule && (
                <div
                    className="rules-modal-overlay"
                    onClick={() => setEditingRule(null)}
                >

                    <div
                        className="rules-modal"
                        onClick={e => e.stopPropagation()}
                    >

                        <div className="rules-modal-header">
                            <div>
                                <h2>Edit Detection Rule</h2>
                                <p>{editingRule.event_type}</p>
                            </div>

                            <button
                                className="rules-modal-close"
                                onClick={() => setEditingRule(null)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdateRule}>

                            <div className="rules-form-group">
                                <label>Detection Rule</label>

                                <input
                                    type="text"
                                    value={editingRule.alert_type.replaceAll("_", " ")}
                                    disabled
                                />
                            </div>

                            <div className="rules-form-group">
                                <label>Threshold</label>

                                <input
                                    type="number"
                                    name="threshold"
                                    min="1"
                                    step="1"
                                    value={formData.threshold}
                                    onChange={handleChange}
                                    required
                                />

                                <small>
                                    Number of attempts required to trigger an alert.
                                </small>
                            </div>

                            <div className="rules-form-group">
                                <label>Time Window (minutes)</label>

                                <input
                                    type="number"
                                    name="window_minutes"
                                    min="1"
                                    step="1"
                                    value={formData.window_minutes}
                                    onChange={handleChange}
                                    required
                                />

                                <small>
                                    Time period within which attempts are counted.
                                </small>
                            </div>

                            <div className="rules-form-group">
                                <label>Severity</label>

                                <select
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleChange}
                                >
                                    {severityOptions.map(severity => (
                                        <option key={severity} value={severity}>
                                            {severity}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rules-modal-actions">

                                <button
                                    type="button"
                                    className="rules-cancel-btn"
                                    onClick={() => setEditingRule(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rules-save-btn"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className="rules-notification">
                    {notification}
                </div>
            )}

        </div>
    );
}

export default DetectionRulesPage;