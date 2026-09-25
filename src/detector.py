from datetime import timedelta

def detect_auth_failures(events):
    failures = {}
    previous_timestamps = {}
    for event in events:
        if event["event_type"] != "authentication_failure":
            continue
        
        username = event["username"]

        if username not in failures:
            failures[username] = []

        if username not in previous_timestamps:
            failures[username].append(event["time"])
            previous_timestamps[username] = event["time"]
        elif event["time"] - previous_timestamps[username] > timedelta(seconds=1):
            failures[username].append(event["time"])
            previous_timestamps[username] = event["time"]
    
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