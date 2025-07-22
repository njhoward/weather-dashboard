// static/barometer.js

window.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('barometerGauge').getContext('2d');
    const pressure = parseFloat(document.getElementById('barometerGauge').dataset.pressure) || 1013.25;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [''],
            datasets: [{
                data: [pressure - 980, 1050 - pressure],
                backgroundColor: ['#00ff00', '#333'],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: {
            circumference: 180,
            rotation: 270,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                doughnutlabel: {
                    labels: [
                        {
                            text: pressure.toFixed(1),
                            font: { size: '24' }
                        },
                        {
                            text: 'hPa',
                            font: { size: '16' }
                        }
                    ]
                }
            }
        }
    });
});
