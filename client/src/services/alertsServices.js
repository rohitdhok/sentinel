const API = "http://localhost:3000";

async function getAlerts(page) {
    const response = await fetch(API+"/alerts?page="+page);
    const alerts = await response.json();
    return alerts;
}

async function getAlertsStats() {
    const response = await fetch(API+"/alerts/stats");
    const stats = await response.json();
    return stats;
}

async function getAlertsBySeverity(severity, page) {
    const response = await fetch(API + `/alerts/severity/${encodeURIComponent(severity)}?page=${page}`);
    const data = await response.json();
    return data
}

async function getUsernames() {
    const response = await fetch(API + "/alerts/users");
    const data = await response.json();
    return data
}

async function getAlertsByUsername(username, page) {
    const response = await fetch(API + `/alerts/user/${username}?page=${page}`);
    const data = await response.json();
    return data
}

async function getAlertsByFilter(severity, username, page) {
    const response = await fetch(
        API + `/alerts/filter?page=${page}&severity=${encodeURIComponent(severity)}&username=${encodeURIComponent(username)}`
    );
    const data = await response.json();
    return data;
}

export {getAlerts, getAlertsStats, getAlertsBySeverity, getAlertsByUsername, getUsernames, getAlertsByFilter}

