function updateTime() {
    const now = new Date();
    document.getElementById("current-time").textContent = now.toLocaleTimeString();
}


// Initial setup
updateTime();
setInterval(updateTime, 1000);
