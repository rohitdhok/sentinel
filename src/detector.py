from datetime import timedelta, datetime

def detect_auth_failures(events):
    failures = {}

    for event in events:
        if event["event_type"] != "authentication_failure":
            continue
        
        username = event["username"]

        if username == None:
            continue

        if username not in failures:
            failures[username] = []

        failures[username].append(event["time"])

    for username in failures:
        failures[username].sort()
    
    return failures


def detect_suspicious_window(user_timestamps, user):
    if len(user_timestamps) < 3:
        return None

    left = 0
    right = 2
    latest_frame = None

    while right < len(user_timestamps):
        if user_timestamps[right] - user_timestamps[left] <= timedelta(minutes=5):
            latest_frame = user_timestamps[left:right+1]
        
        left +=1 
        right +=1
    
    if latest_frame is None:
        return None
    
    return {
        "username": user,
        "event" : "authentication_failure",
        "records": [
            timestamp.strftime("%Y-%m-%d %H:%M:%S")
            for timestamp in latest_frame
        ],
        "severity" : "high",
        "time_window" : "5 minutes",
        "total_attempts" : len(latest_frame),
    }

def detect_valid_window(user_timestamps, user):
    left = 0
    right = 0
    count = 0

    while right < len(user_timestamps):
        if user_timestamps[right] - user_timestamps[left] <= timedelta(minutes=5):
            count += 1

            if count >= 3:
                return {
                    "username": user,
                    "first_event": user_timestamps[left].strftime("%Y-%m-%d %H:%M:%S"),
                    "alert_type": "repeated_authentication_failure",
                    "records": [
                        timestamp.strftime("%Y-%m-%d %H:%M:%S")
                        for timestamp in user_timestamps[left:right+1]
                    ],
                    "severity" : "high",
                    "time_window" : "5 minutes",
                    "total_attempts" : count
                }

            right += 1
        else:
            count -= 1
            left += 1

timestamps = [
    datetime.fromisoformat("2026-09-27T10:00:00+05:30"),
    datetime.fromisoformat("2026-09-27T10:06:00+05:30"),
    datetime.fromisoformat("2026-09-27T10:07:00+05:30"),
    datetime.fromisoformat("2026-09-27T10:08:00+05:30"),
]

usern = "Rohit"
print(detect_valid_window(timestamps, usern))
