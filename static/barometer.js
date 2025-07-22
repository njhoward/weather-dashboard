// static/barometer.js

window.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('barometerGauge').getContext('2d');
    const pressure = parseFloat(document.getElementById('barometerGauge').dataset.pressure) || 1013.25;

    const minPressure = 960;
    const maxPressure = 1060;
    const percent = (pressure - minPressure) / (maxPressure - minPressure);
    const angle = percent * 360;

    const needle = {
        id: 'needle',
        afterDatasetsDraw(chart) {
            const { ctx, chartArea: { width, height } } = chart;
            const x = chart.getDatasetMeta(0).data[0].x;
            const y = chart.getDatasetMeta(0).data[0].y;
            const radius = chart.outerRadius;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((angle - 90) * Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius - 10, 0);
            ctx.strokeStyle = '#f00';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [1],
                backgroundColor: ['#eee'],
                borderWidth: 0,
                cutout: '90%'
            }]
        },
        options: {
            responsive: true,
            circumference: 360,
            rotation: -90,
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false }
            }
        },
        plugins: [needle]
    });
});
