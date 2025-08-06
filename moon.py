import ephem
import datetime

def get_moon_phase(lat, long):
    now = ephem.now()
    observer = ephem.Observer()
    observer.lat = lat
    observer.lon = long
    observer.date = now

    moon = ephem.Moon(now)
    phase = moon.phase

    # Determine waxing or waning
    next_full = ephem.next_full_moon(now)
    previous_full = ephem.previous_full_moon(now)
    waxing = now < next_full

    icon = get_moon_phase_icon(phase, waxing)
    desc = get_moon_phase_desc(phase, waxing)

    # Determine next phase
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

    moon_next = ephem.Moon(next_phase_date)
    next_phase_phase = moon_next.phase
    waxing_next = next_phase_date < ephem.next_full_moon(next_phase_date)

    next_icon = get_moon_phase_icon(next_phase_phase, waxing_next)
    next_desc = get_moon_phase_desc(next_phase_phase, waxing_next)

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

def get_moon_phase_icon(phase, waxing):
    if phase < 1:
        return "🌑"
    elif phase < 49:
        return "🌒" if waxing else "🌘"
    elif phase < 51:
        return "🌓" if waxing else "🌗"
    elif phase < 99:
        return "🌔" if waxing else "🌖"
    else:
        return "🌕"

def get_moon_phase_desc(phase, waxing):
    if phase < 1:
        return "New Moon"
    elif phase < 49:
        return "Waxing Crescent" if waxing else "Waning Crescent"
    elif phase < 51:
        return "First Quarter" if waxing else "Last Quarter"
    elif phase < 99:
        return "Waxing Gibbous" if waxing else "Waning Gibbous"
    else:
        return "Full Moon"
