import json

def save_alerts(alerts):
    with open("data/alerts.json", "w") as alerts_file:
        json.dump(alerts, alerts_file, indent=4)
    print("Data saved successfully!")
