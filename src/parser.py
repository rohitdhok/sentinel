from datetime import datetime

def extract_username(message):
    if " user=" in message:
        return message.split(" user=")[1].split()[0]
    elif "password check failed for user" in message:
        return message.split(" ")[-1].strip("()")
    elif "FAILED SU" in message:
        words = message.split()
        return words[words.index("on") - 1]
    elif " by " in message and "(uid=" in message:
        return message.split(" by ")[1].split("(uid=")[0]
    elif " : TTY=" in message:
        return message.split(" : TTY=")[0]
    else:
        return None

def parse_log(log):
    log = log.strip();

    parts = log.split(maxsplit=3)

    time = datetime.fromisoformat(parts[0])
    host = parts[1]
    service = parts[2]
    message = ' '.join(parts[3:])
    username = extract_username(message)
    event_type = ""

    if "password check failed for user" in message:
        event_type = "password_check_failed"
    elif "authentication failure" in message:
        event_type = "authentication_failure"
    elif "FAILED SU" in message:
        event_type = "failed_privilege_switch"
    elif "session opened for user" in message and service.strip().startswith("su["):
        event_type = "privilege_switch"
    elif "session opened for user" in message and service.strip() == "sudo:":
        event_type = "privileged_session_opened"
    elif "COMMAND=" in message and service.strip() == "sudo:":
        event_type = "sudo_command"
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