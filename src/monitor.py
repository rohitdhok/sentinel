import time

def monitor(log_file):
    with open(log_file, "r") as file:
        file.seek(0, 2)

        while True:
            line = file.readline()

            if line == "":
                time.sleep(1)
                continue

            yield line