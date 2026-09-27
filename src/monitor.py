import time

def monitor(log_file):
    with open(log_file, "r") as file:
        while True:
            line = file.readline()

            if line == "":
                time.sleep(1)
                continue

            yield line