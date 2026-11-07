const pool = require("./db")

async function getAllRules() {
    return ( await pool.query("SELECT * FROM detection_rules ORDER BY id") ).rows
}

async function toggleRule(id) {
    return ( await pool.query("UPDATE detection_rules SET enabled = NOT enabled WHERE id=$1 RETURNING *", [id]) ).rows[0]
}

async function updateRule(id, values) {
    const {threshold, window_minutes, severity} = values
    return ( await pool.query("UPDATE detection_rules SET threshold=$1, window_minutes=$2, severity=$3 WHERE id=$4 RETURNING *", [threshold, window_minutes, severity, id]) ).rows[0]
}

module.exports = { getAllRules, toggleRule, updateRule }