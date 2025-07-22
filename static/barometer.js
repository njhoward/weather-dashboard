// static/barometer.js

window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('barometerGauge');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pressure = parseFloat(canvas.dataset.pressure) || 1013.25;
    const trend = canvas.dataset.trend || 'steady';
    const previous = parseFloat(canvas.dataset.previous) || pressure;

    const minPressure = 960;
    const maxPressure = 1060;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 90;

    const toAngle = (value) => {
        const percent = (value - minPressure) / (maxPressure - minPressure);
        return (percent * 270 + 135) * Math.PI / 180;
    };

    const pressureAngle = toAngle(pressure);
    const previousAngle = toAngle(previous);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Arc background ---
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 135 * Math.PI / 180, 405 * Math.PI / 180);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 20;
    ctx.stroke();

    // --- Tick marks & labels ---
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#999';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ccc';

    for (let p = minPressure; p <= maxPressure; p += 10) {
        const angle = toAngle(p);
        const x1 = centerX + Math.cos(angle) * (radius - 10);
        const y1 = centerY + Math.sin(angle) * (radius - 10);
        const x2 = centerX + Math.cos(angle) * (radius);
        const y2 = centerY + Math.sin(angle) * (radius);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const labelX = centerX + Math.cos(angle) * (radius - 25);
        const labelY = centerY + Math.sin(angle) * (radius - 25);
        ctx.fillText(p.toString(), labelX - 8, labelY + 4);
    }

    // --- Weather icons ---
    const icons = {
        980: '🌧️',
        1000: '☁️',
        1020: '☀️',
        1040: '☀️'
    };

    ctx.font = '18px sans-serif';
    for (const p in icons) {
        const angle = toAngle(Number(p));
        const iconX = centerX + Math.cos(angle) * (radius - 40);
        const iconY = centerY + Math.sin(angle) * (radius - 40);
        ctx.fillText(icons[p], iconX - 10, iconY + 6);
    }

    // --- Blue previous needle ---
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(previousAngle) * (radius - 20), centerY + Math.sin(previousAngle) * (radius - 20));
    ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // --- Red current needle (prominent) ---
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(pressureAngle) * (radius - 20), centerY + Math.sin(pressureAngle) * (radius - 20));
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.stroke();

    // --- Center hub ---
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // --- Pressure text and trend ---
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#0ff';
    ctx.fillText(`${pressure.toFixed(1)} hPa`, centerX - 40, centerY + 60);

    // Trend arrow + label
    ctx.font = '14px sans-serif';
    const trendText = {
        rising: '⬆️ Rising',
        falling: '⬇️ Falling',
        steady: '➡️ Steady'
    };
    ctx.fillStyle = trend === 'rising' ? 'lime' : trend === 'falling' ? 'red' : 'gray';
    ctx.fillText(trendText[trend], centerX - 35, centerY + 80);
});
