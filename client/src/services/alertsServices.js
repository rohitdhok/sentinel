const API = "http://localhost:3000";

async function getAlerts() {
    const response = await fetch(API+"/alerts");
    const alerts = await response.json();
    return alerts;
}

async function getAlertsStats() {
    const response = await fetch(API+"/alerts/stats");
    const stats = await response.json();
    return stats;
}

async function getAlertsBySeverity(severity) {
    const response = await fetch(API + "/alerts/severity/" + severity);
    const data = await response.json();
    return data
}

async function getUsernames() {
    const response = await fetch(API + "/alerts/users");
    const data = await response.json();
    return data
}

async function getAlertsByUsername(username) {
    const response = await fetch(API + "/alerts/user/" + username);
    const data = await response.json();
    return data
}

async function getAlertsByFilter(severity, username) {
    const response = await fetch(API + "/alerts/filter?severity="+severity+"&username="+username);
    const data = await response.json();
    return data
}

export {getAlerts, getAlertsStats, getAlertsBySeverity, getAlertsByUsername, getUsernames, getAlertsByFilter}

