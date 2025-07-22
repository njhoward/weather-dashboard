import numpy as np

def get_pressure_trend(readings, num_points=5, threshold=0.02):
    """
    Determines pressure trend from last `num_points` readings using linear regression.
    """
    # Get the last num_points readings (reverse chronological)
    recent = [r for r in readings if r.get("press") is not None][:num_points]

    if len(recent) < num_points:
        return 'steady'  # Not enough data

    pressures = [r["press"] for r in reversed(recent)]  # oldest to newest
    times = list(range(len(pressures)))  # 0, 1, 2, ...

    # Linear regression
    slope, _ = np.polyfit(times, pressures, 1)

    if slope > threshold:
        return 'rising'
    elif slope < -threshold:
        return 'falling'
    else:
        return 'steady'
