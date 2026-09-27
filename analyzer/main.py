import sys
from src.parser import parse_log
from src.output import save_alerts
from src.detector import apply_rule, RULES

event_count = {
    "authentication_failure": 0,
    "failed_privilege_switch": 0,
    "session_opened": 0,
    "session_closed": 0
}

events = []
alerts = []

log_file = "test_logs/auth.log" if "--test" in sys.argv else "/var/log/auth.log"

with open(log_file) as auth_logs_file:
        logs = auth_logs_file.readlines()

for log in logs:
    res = parse_log(log)
    
    events.append(res)

    match res["event_type"]:
        case "authentication_failure":
            event_count["authentication_failure"] += 1
        case "failed_privilege_switch":
            event_count["failed_privilege_switch"] += 1
        case "session_opened":
            event_count["session_opened"] += 1
        case "session_closed":
            event_count["session_closed"] += 1

for rule in RULES:
     alerts.extend(apply_rule(events, rule))

save_alerts(alerts)
