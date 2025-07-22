// static/barometer.js

window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('barometerGauge');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pressure = parseFloat(canvas.dataset.pressure) || 1013.25;

    const minPressure = 960;
    const maxPressure = 1060;

    const percent = (pressure - minPressure) / (maxPressure - minPressure);
    const angleDeg = percent * 270 + 135; // 135° to 405° (dial arc)
    const angleRad = angleDeg * Math.PI / 180;

    const radius = 90;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear and draw base circle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 135 * Math.PI / 180, 405 * Math.PI / 180);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw tick marks (every 10 hPa)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#999';
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ccc';
    for (let p = minPressure; p <= maxPressure; p += 10) {
        const pct = (p - minPressure) / (maxPressure - minPressure);
        const tickAngle = (pct * 270 + 135) * Math.PI / 180;
        const x1 = centerX + Math.cos(tickAngle) * (radius - 10);
        const y1 = centerY + Math.sin(tickAngle) * (radius - 10);
        const x2 = centerX + Math.cos(tickAngle) * (radius);
        const y2 = centerY + Math.sin(tickAngle) * (radius);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const labelX = centerX + Math.cos(tickAngle) * (radius - 25);
        const labelY = centerY + Math.sin(tickAngle) * (radius - 25);
        ctx.fillText(p.toString(), labelX - 8, labelY + 4);
    }

    // Draw needle
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angleRad) * (radius - 20), centerY + Math.sin(angleRad) * (radius - 20));
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Pressure text
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#0ff';
    ctx.fillText(`${pressure.toFixed(1)} hPa`, centerX - 35, centerY + 60);
});
