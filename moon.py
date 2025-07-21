# moon.py
import ephem

def get_moon_phase():
    moon = ephem.Moon(datetime.utcnow())
    phase = moon.phase  # 0 = new moon, 50 = half, 100 = full

    if phase < 1:
        icon = "🌑"; desc = "New Moon"
    elif phase < 25:
        icon = "🌒"; desc = "Waxing Crescent"
    elif phase < 50:
        icon = "🌓"; desc = "First Quarter"
    elif phase < 75:
        icon = "🌔"; desc = "Waxing Gibbous"
    elif phase < 99:
        icon = "🌕"; desc = "Full Moon"
    elif phase < 100:
        icon = "🌖"; desc = "Waning Gibbous"
    elif phase < 75:
        icon = "🌗"; desc = "Last Quarter"
    else:
        icon = "🌘"; desc = "Waning Crescent"

    return {"icon": icon, "description": f"{desc} ({phase:.1f}% illuminated)"}
