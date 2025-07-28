function drawClock() {
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    setInterval(() => {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    }, 1000);
}

function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.strokeStyle = '#76e7ff';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function drawNumbers(ctx, radius) {
    ctx.font = radius * 0.15 + "px Arial";
    ctx.fillStyle = '#76e7ff';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num <= 12; num++) {
        const ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius) {
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Hour
    let hourPos = (hour * Math.PI / 6) +
                  (minute * Math.PI / (6 * 60)) +
                  (second * Math.PI / (360 * 60));
    drawHand(ctx, hourPos, radius * 0.5, 6);

    // Minute
    let minutePos = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minutePos, radius * 0.75, 4);

    // Second
    let secondPos = second * Math.PI / 30;
    drawHand(ctx, secondPos, radius * 0.85, 2, '#f55');
}

function drawHand(ctx, pos, length, width, color = '#76e7ff') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}
