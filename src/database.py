import os
import psycopg
from psycopg.types.json import Jsonb
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg.connect(
        host="localhost",
        dbname="sentinel",
        user="sentinel_app",
        password=os.getenv("SENTINEL_DB_PASSWORD")
    )


def save_alert(alert):
    conn = get_connection()

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO alerts (
                first_event,
                username,
                alert_type,
                severity,
                time_window,
                total_attempts,
                records
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                alert["first_event"],
                alert["username"],
                alert["alert_type"],
                alert["severity"],
                alert["time_window"],
                alert["total_attempts"],
                Jsonb(alert["records"])
            )
        )
        

    conn.commit()
    conn.close()

def save_event(event):
    conn = get_connection()

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO events (
                timestamp,
                username,
                event_type,
                service,
                host,
                message
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                event["time"],
                event["username"],
                event["event_type"],
                event["service"],
                event["host"],
                event["message"]
            )
        )

    conn.commit()
    conn.close()