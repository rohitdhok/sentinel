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
    const data = response.json();
    return data
}

export {getAlerts, getAlertsStats, getAlertsBySeverity}

