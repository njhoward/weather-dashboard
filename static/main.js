document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".pages");
    const pages = Array.from(container.children);
    const totalPages = pages.length;
    const dotsContainer = document.getElementById("dots");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    let currentPage = 0;
    let startX = 0, tracking = false;

    // Add dots
    pages.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll("span");

    function goToPage(index) {
        if (index < 0 || index >= totalPages) return;
        currentPage = index;
        container.scrollTo({
            left: window.innerWidth * currentPage,
            behavior: "smooth"
        });
        dots.forEach((d, i) => d.classList.toggle("active", i === currentPage));
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    // Arrow clicks
    prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
    nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

    // Two-finger swipe
    container.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 2) return;
        startX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        tracking = true;
    });

    container.addEventListener("touchend", (e) => {
        if (!tracking) return;
        tracking = false;
        const endX = (e.changedTouches[0].clientX + e.changedTouches[1].clientX) / 2;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0) goToPage(currentPage + 1);
            else goToPage(currentPage - 1);
        }
    });

    // Resize snap correction
    window.addEventListener("resize", () => {
        goToPage(currentPage);
    });
});


function flipCard(element) {
    const card = element.closest(".pressure-card");
    card.classList.toggle("flipped");
}

function convertCompassToDegrees(dir) {
    const directions = [
        "N", "NNE", "NE", "ENE",
        "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"
    ];
    const index = directions.indexOf(dir.toUpperCase());
    return index >= 0 ? index * 22.5 : 0;
}

function rotateNeedle(degrees) {
    const needle = document.getElementById('wind-needle');
    if (needle) {
        needle.style.transform = `rotate(${degrees}deg)`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const needle = document.getElementById("wind-needle");
    if (needle) {
        const dirText = needle.dataset.winddir;
        const degrees = convertCompassToDegrees(dirText);
        rotateNeedle(degrees);
    }
});
