from datetime import datetime

def extract_username(message):
    if " user=" in message:
        return message.split(" user=")[1].split(" ")[0]
    elif "password check failed for user" in message:
        return message.split(" ")[-1].strip("()")
    else:
        return None

def parse_log(log):
    broken_log = log.split(" ")

    time = datetime.fromisoformat(broken_log[0])
    host = broken_log[1]
    service = broken_log[2]
    message = ' '.join(broken_log[3:])
    username = extract_username(message)
    event_type = ""

    if "authentication failure" in message or "password check failed for user" in message:
        event_type = "authentication_failure"
    elif "FAILED SU" in message:
        event_type = "failed_privilege_switch"
    elif "session opened" in message:
        event_type = "session_opened"
    elif "session closed" in message:
        event_type = "session_closed"
    else:
        event_type = "unknown"

    return {
        "time": time, 
        "host": host, 
        "service": service, 
        "message": message,
        "username": username,
        "event_type": event_type
    }