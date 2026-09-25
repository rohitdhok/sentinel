def print_report(alert):
    print(f"""
==============================================
SECURITY ALERT
==============================================
User          : {alert["username"]}
Event         : {alert["event"]}
Severity      : {alert["severity"]}
Attempts      : {alert["total_attempts"]}
Time Window   : {alert["time_window"]}
Records       : {alert["records"]}
==============================================
    """)