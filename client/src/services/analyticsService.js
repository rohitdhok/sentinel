const API = "http://localhost:3000";

export async function getUserOverview(username) {
    const response = await fetch(API + `/analytics/user/${username}/overview`);
    if (!response.ok) { throw new Error("failed to fetch user overview analytics API.") }

    const data = await response.json()
    return data;
}

export async function getUserEventDistribution(username) {
    const response = await fetch(API + `/analytics/user/${username}/event-distribution`);
    if (!response.ok) { throw new Error("failed to fetch user event distribution analytics API.") };

    const data = await response.json();
    return data;
}

export async function getUserAlertDistribution(username) {
    const response = await fetch(API + `/analytics/user/${username}/alert-distribution`);
    if (!response.ok) {throw new Error("failed to fetch user alert distribution analytics API.")};

    const data = await response.json();
    return data;
}

export async function getUserSeverityDistribution(username) {
    const response = await fetch(API + `/analytics/user/${username}/alert-severity`)
    if (!response.ok) {throw new Error("failed to fetch user alert severity distribution API.")};

    const data = await response.json();
    return data;
}

export async function getUserLoginHistory(username) {
    const response = await fetch(API + `/analytics/user/${username}/login-history`)
    if (!response.ok) {throw new Error("failed to fetch user login history.")}

    const data = await response.json();
    return data;
}