from datetime import timedelta, datetime

RULES = [
    {
        "event_type": "authentication_failure",
        "threshold": 3,
        "window_minutes": 5,
        "severity": "high",
        "alert_type": "repeated_authentication_failure"
    },
    {
        "event_type": "failed_privilege_switch",
        "threshold": 3,
        "window_minutes": 5,
        "severity": "very high",
        "alert_type": "repeated_privilege_switch_failure" 
    }
]


def get_matching_events(events, event_type):
    matching = []

    for event in events:
        if event["event_type"] == event_type:
            matching.append(event)

    return matching

def group_events_by_username(events):
    grouped = {}

    for event in events:
        username = event["username"]

        if username is None:
            continue

        if username not in grouped:
            grouped[username] = []

        grouped[username].append(event["time"])

    for username in grouped:
        grouped[username].sort()

    return grouped

def apply_rule(events, rule):
    matching_events = get_matching_events(events, rule["event_type"])

    grouped_events = group_events_by_username(matching_events)

    alerts = []

    for username, timestamps in grouped_events.items():
        result = detect_window(
            timestamps,
            rule["threshold"],
            rule["window_minutes"]
        )

        if result is not None:
            result["username"] = username
            result["alert_type"] = rule["alert_type"]
            result["severity"] = rule["severity"]
            result["time_window"] = f'{rule["window_minutes"]} minutes'

            alerts.append(result)

    return alerts

# generic window detector
def detect_window(timestamps, threshold, window_minutes):
    left = right = count = 0

    while right < len(timestamps):
        if timestamps[right] - timestamps[left] <= timedelta(minutes=window_minutes):
            count += 1
            right += 1

            if count >= threshold:
                return {
                    "first_event": timestamps[left].strftime("%Y-%m-%d %H:%M:%S"),
                    "records": [
                        timestamp.strftime("%Y-%m-%d %H:%M:%S")
                        for timestamp in timestamps[left:right]
                    ],
                    "total_attempts" : count
                }
        else:
            count -= 1
            left += 1 


