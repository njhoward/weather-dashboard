# moon.py
import ephem
import datetime

def get_moon_phase(lat, long):
    now = ephem.now()
    observer = ephem.Observer()
    observer.lat = lat
    observer.lon = long



    moon = ephem.Moon(now)
    phase = moon.phase
    icon = get_moon_phase_icon(phase=phase)
    desc = get_moon_phase_desc(phase=phase)


    #if phase < 1:
    #    icon = "🌑"; desc = "New Moon"
    #elif phase < 25:
    #    icon = "🌒"; desc = "Waxing Crescent"
    #elif phase < 50:
    #    icon = "🌓"; desc = "First Quarter"
    #elif phase < 75:
    #    icon = "🌔"; desc = "Waxing Gibbous"
    #elif phase < 99:
    #   icon = "🌕"; desc = "Full Moon"
    #elif phase < 100:
    #    icon = "🌖"; desc = "Waning Gibbous"
    #elif phase < 75:
    #    icon = "🌗"; desc = "Last Quarter"
    #else:
    #    icon = "🌘"; desc = "Waning Crescent"



    next_new = ephem.next_new_moon(now)
    next_first = ephem.next_first_quarter_moon(now)
    next_full = ephem.next_full_moon(now)
    next_last = ephem.next_last_quarter_moon(now)

    phases = {
        "New Moon": next_new,
        "First Quarter": next_first,
        "Full Moon": next_full,
        "Last Quarter": next_last
    }

    next_phase_name, next_phase_date = min(phases.items(), key=lambda x: x[1])

    # next phase details
    moon_next = ephem.Moon(next_phase_date)
    next_phase_phase = moon_next.phase
    next_icon = get_moon_phase_icon(next_phase_phase)
    next_desc = get_moon_phase_desc(next_phase_phase)

    return {
                "icon": icon, 
                "description": f"{desc} ({phase:.1f}% illuminated)",
                "phase": phase,
                "next_phase": next_phase_name,
                "next_phase_date": str(next_phase_date.datetime().date()),
                "next_phase_icon": next_icon,
                "next_phase_description": f"{next_desc} ({next_phase_phase:.1f}% illuminated)",
                "next_full_moon": str(next_full.datetime().date())
            }

def get_moon_phase_icon(phase):
    if phase < 1:
        icon = "🌑"; 
    elif phase < 25:
        icon = "🌒"; 
    elif phase < 50:
        icon = "🌓"; 
    elif phase < 75:
        icon = "🌔"; 
    elif phase < 99:
        icon = "🌕"; 
    elif phase < 100:
        icon = "🌖"; 
    elif phase < 75:
        icon = "🌗"; 
    else:
        icon = "🌘"; 
    return icon

def get_moon_phase_desc(phase):
    if phase < 1:
        desc = "New Moon"
    elif phase < 25:
        desc = "Waxing Crescent"
    elif phase < 50:
        desc = "First Quarter"
    elif phase < 75:
        desc = "Waxing Gibbous"
    elif phase < 99:
        desc = "Full Moon"
    elif phase < 100:
        desc = "Waning Gibbous"
    elif phase < 75:
        desc = "Last Quarter"
    else:
        desc = "Waning Crescent"
    return desc