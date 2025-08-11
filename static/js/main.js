(function () {
  function setHeights() {
    var header = document.querySelector('.top-bar');
    var pages  = document.querySelector('.pages');
    if (!pages) return;

    var headerH = header ? header.offsetHeight : 0;
    var h = Math.max(0, window.innerHeight - headerH -6); // e.g. 704 - 101 = 603

    // Apply explicit pixel heights (works on iOS 10)
    pages.style.height = h + 'px';
    var pageEls = document.querySelectorAll('.page');
    for (var i = 0; i < pageEls.length; i++) {
      pageEls[i].style.height = h + 'px';
    }
  }

  ['load','resize','orientationchange','pageshow'].forEach(function (ev) {
    window.addEventListener(ev, setHeights, { passive: true });
  });
  function sizeVisuals() {
  var page = document.querySelector('.page');
  if (!page) return;

  var cs = window.getComputedStyle(page);
  var gap = parseFloat(cs.rowGap || cs.gap) || 0;
  var pt  = parseFloat(cs.paddingTop)  || 0;
  var pb  = parseFloat(cs.paddingBottom) || 0;

  // height available for each of the 2 rows
  var rowH = (page.clientHeight - pt - pb - gap) / 2;

  // leave room for heading/text inside each card
  var visualMax = Math.max(120, Math.floor(rowH - 80));

  // Wind compass
  var w = document.getElementsByClassName('wind-compass-container');
  for (var i = 0; i < w.length; i++) {
    w[i].style.width  = visualMax + 'px';
    w[i].style.height = visualMax + 'px';
  }

  // Analog clock
  var clock = document.getElementById('analogClock');
  if (clock) {
    clock.style.width  = visualMax + 'px';
    clock.style.height = visualMax + 'px';
  }

  // Pressure gauge (canvas or img inside .pressure-card)
  var pcs = document.querySelectorAll('.pressure-card canvas, .pressure-card img');
  for (var j = 0; j < pcs.length; j++) {
    pcs[j].style.width  = visualMax + 'px';
    pcs[j].style.height = visualMax + 'px';
  }
}

['load','resize','orientationchange','pageshow'].forEach(function (ev) {
  window.addEventListener(ev, function(){ setHeights(); sizeVisuals(); }, { passive: true });
});
setHeights(); sizeVisuals();
})();



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

(function () {
  function report() {
    var page   = document.querySelector('.page');
    var pages  = document.querySelector('.pages');
    var header = document.querySelector('.top-bar');
    var csPage = page ? getComputedStyle(page) : { height: 'n/a' };
    var csPages= pages ? getComputedStyle(pages): { height: 'n/a' };

    var lines = [
      'window.innerHeight: ' + window.innerHeight,
      'outerHeight: ' + window.outerHeight,
      'docEl.clientHeight: ' + document.documentElement.clientHeight,
      'body.clientHeight: ' + document.body.clientHeight,
      '.top-bar offsetHeight: ' + (header ? header.offsetHeight : 0),
      '.pages offsetHeight: ' + (pages ? pages.offsetHeight : 0),
      '.pages computed height: ' + csPages.height,
      '.page offsetHeight: ' + (page ? page.offsetHeight : 0),
      '.page computed height: ' + csPage.height,
      'pages clientHeight: ' + pages.clientHeight,
      'pages scrollHeight: ' + pages.scrollHeight,
      'page  clientHeight: ' + (page ? page.clientHeight : 0),
      'page  scrollHeight: ' + (page ? page.scrollHeight : 0)
    ];

    var el = document.getElementById('vh-debug');
    if (!el) {
      el = document.createElement('pre');
      el.id = 'vh-debug';
      Object.assign(el.style, {
        position: 'fixed', right: '6px', bottom: '6px', zIndex: 9999,
        background: 'rgba(0,0,0,.7)', color: '#0ff',
        font: '12px/1.3 monospace', padding: '6px 8px',
        border: '1px solid #0ff', borderRadius: '6px'
      });
      document.body.appendChild(el);
    }
    el.textContent = lines.join('\n');
  }
  ['load','resize','orientationchange','pageshow'].forEach(ev =>
    window.addEventListener(ev, report, { passive: true })
  );
  setTimeout(report, 50);
})();
