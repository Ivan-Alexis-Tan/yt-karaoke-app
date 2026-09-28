def duration_to_seconds(duration: str) -> int:
    duration = duration.removeprefix("PT")
    time = {
        "hour": 0,
        "minutes": 0,
        "seconds": 0,
    }

    if "H" in duration:
        hour, duration = duration.split("H")
        time["hour"] = hour * 60 * 60

    if "M" in duration:
        minutes, duration = duration.split('M')
        time["minutes"] = int(minutes) * 60

    if "S" in duration:
        seconds, duration = duration.split("S")
        time["seconds"] = int(seconds)

    return sum(time.values())
