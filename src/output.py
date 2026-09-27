import json

def save_alerts(alerts):
    with open("data/alerts.json", "r") as read_alerts:
        existing_alerts = json.load(read_alerts)

    for alert in alerts:
        if alert not in existing_alerts:
            existing_alerts.append(alert)

    with open("data/alerts.json", "w") as alerts_file:
        json.dump(existing_alerts, alerts_file, indent=4)
    print("Data saved successfully!")
