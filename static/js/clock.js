function drawClock() {
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function render() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
        drawFace(ctx, radius);
        drawTicks(ctx, radius);
        drawTime(ctx, radius);
    }

    setInterval(render, 1000);
    render(); // draw immediately
}

function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
}

function drawTicks(ctx, radius) {
    for (let i = 0; i < 60; i++) {
        let angle = i * Math.PI / 30;
        let length = (i % 5 === 0) ? radius * 0.15 : radius * 0.07;
        ctx.beginPath();
        ctx.lineWidth = (i % 5 === 0) ? 4 : 2;
        ctx.strokeStyle = '#000';
        ctx.rotate(angle);
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -radius + length);
        ctx.stroke();
        ctx.rotate(-angle);
    }
}

function drawTime(ctx, radius) {
    const now = new Date();
    let hour = now.getHours() % 12;
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // Hour hand
    let hourAngle = (hour * Math.PI / 6) +
                    (minute * Math.PI / (6 * 60)) +
                    (second * Math.PI / (360 * 60));
    drawHand(ctx, hourAngle, radius * 0.5, 6, '#000');

    // Minute hand
    let minAngle = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minAngle, radius * 0.75, 4, '#000');

    // Seconds hand (Mondaine style: thin red with round circle at the end)
    let secAngle = second * Math.PI / 30;
    ctx.save();
    ctx.rotate(secAngle);
    ctx.beginPath();
    ctx.strokeStyle = '#e4002b';
    ctx.lineWidth = 2;
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -radius * 0.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -radius * 0.9, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#e4002b';
    ctx.fill();
    ctx.restore();
}

function drawHand(ctx, pos, length, width, color) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.strokeStyle = color;
    ctx.rotate(pos);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.restore();
}
