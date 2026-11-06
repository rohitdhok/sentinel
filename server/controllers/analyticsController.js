const { getUserOverview, getUserEventDistribution, getUserAlertDistribution, getUserSeverityDistribution, getUserLoginHistory } = require("../helpers/analyticsHelpers");

async function handleGetUserOverview(req, res, next) {
    try {
        const username = req.params.username;
        const userOverview = await getUserOverview(username);

        return res.json({userOverview})
    } catch(e) {
        return next(e);
    }
}

async function handleGetUserEventDistribution(req, res, next) {
    try {
        const username = req.params.username;
        const userEventDistribution = await getUserEventDistribution(username);

        return res.json({userEventDistribution})
    } catch(e) {
        return next(e);
    }
}

async function handleGetUserAlertDistribution(req, res, next) {
    try {
        const username = req.params.username;
        const userAlertDistribution = await getUserAlertDistribution(username)

        return res.json({userAlertDistribution})
    } catch(e) {
        return next(e)
    }
}

async function handleGetUserSeverityDistribution(req, res, next) {
    try {
        const username = req.params.username;
        const userSeverityDistribution = await getUserSeverityDistribution(username);

        return res.json({userSeverityDistribution})
    } catch(e) {
        return next(e);
    }
}

async function handleGetUserLoginHistory(req, res, next) {
    try {
        const username = req.params.username;
        const userLoginHistory = await getUserLoginHistory(username);

        return res.json({userLoginHistory})
    } catch(e) {
        return next(e);
    }
}

module.exports = {handleGetUserOverview, handleGetUserEventDistribution, handleGetUserAlertDistribution, handleGetUserSeverityDistribution, handleGetUserLoginHistory}