function scheduleRefresh() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    let delay;

    if (minutes < 1) {
        delay = ((1 - minutes) * 60 - seconds) * 1000;
    } else if (minutes < 31) {
        delay = ((31 - minutes) * 60 - seconds) * 1000;
    } else {
        delay = ((60 - minutes + 1) * 60 - seconds) * 1000;
    }

    setTimeout(() => {
        const url = window.location.href;

        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.status >= 200 && response.status < 400) {
                    location.reload(true);
                } else {
                    console.warn("Skipping refresh: bad status", response.status);
                }
            })
            .catch(err => console.error("HEAD request failed", err));

        scheduleRefresh();  // reschedule next refresh
    }, delay);
}

window.addEventListener("load", scheduleRefresh);


function manualRefresh() {
    location.reload();
}