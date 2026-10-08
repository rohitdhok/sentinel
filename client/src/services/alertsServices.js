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

export {getAlerts, getAlertsStats}

