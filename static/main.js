document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".pages");
    const totalPages = container.children.length;
    let currentPage = 0;
    let startX = 0;
    let startY = 0;
    let tracking = false;

    container.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 2) return;
        startX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        startY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        tracking = true;
    });

    container.addEventListener("touchend", (e) => {
        if (!tracking) return;
        tracking = false;

        const endX = (e.changedTouches[0].clientX + e.changedTouches[1].clientX) / 2;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0 && currentPage < totalPages - 1) {
                currentPage++;
            } else if (deltaX > 0 && currentPage > 0) {
                currentPage--;
            }

            container.scrollTo({
                left: currentPage * window.innerWidth,
                behavior: "smooth"
            });
        }
    });
});
