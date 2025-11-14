//Use "terser magazine.js -o magazine.min.js --compress --mangle" to compress
document.addEventListener("DOMContentLoaded", function () {
    $("#magazine div").each(function () {
        const bg = $(this).data("bg");
        $(this).css("background-image", "url(" + bg + ")");
    });
    let images = $("#magazine div").length;
    let loaded = 0;
    fetch("https://ipv4.icanhazip.com")
        .then(response => response.text())
        .then(data => {
            let ipv4 = data.trim();
            $("#ipv4-label").text(`IPv4: ${ipv4}`);
        })
        .catch(() => {
            $("#ipv4-label").text(`IPv4: Not available`);
        })
    fetch("https://ipv6.icanhazip.com")
        .then(response => response.text())
        .then(data => {
            let ipv6 = data.trim();
            $("#ipv6-label").text(`IPv6: ${ipv6}`);
        })
        .catch(() => {
            $("#ipv6-label").text(`IPv6: Not available`);
        })
    $("#magazine div").each(function () {
        const bg = $(this).data("bg");
        const img = new Image();
        img.src = bg;
        img.onload = function () {
            loaded++;
            let percentage = (loaded / images) * 100;
            $("#progress-bar").prop("value", percentage);
            $("#progress-label").text(Math.round(percentage) + "%");
            $("#loading-log").text("Loaded " + loaded + " of " + images);
            if (loaded == images) {
                $("#loading-screen").fadeOut();
            }
        };
    });
    function updateDisplayMode() {
        let isPortrait = window.matchMedia("(orientation: portrait)").matches;
        let displayMode = isPortrait ? "single" : "double";
        $("#magazine").turn("display", displayMode);
    }
    function resizeMagazine() {
        const container = document.getElementById("mag-container");
        const w = container.clientWidth;
        const h = container.clientHeight;
        $("#magazine").turn("size", w, h);
        updateDisplayMode();
    }
    $("#magazine").turn({
        display: $(window).width() < 768 ? "single" : "double",
        acceleration: true,
        gradients: !$.isTouch,
        elevation: 50
    });
    $("#prevBtn").click(function () {
        $("#magazine").turn("previous");
    });
    $("#nextBtn").click(function () {
        $("#magazine").turn("next");
    });
    $(window).on("keydown", function (e) {
        if (e.keyCode == 37) {
            $("#magazine").turn("previous");
        }
        else if (e.keyCode == 39) {
            $("#magazine").turn("next");
        }
    });
    resizeMagazine();
    window.addEventListener("resize", resizeMagazine);
    window.addEventListener("orientationchange", () => {
        setTimeout(resizeMagazine, 300);
    });
    window.matchMedia("(orientation: portrait)").addEventListener("change", resizeMagazine);
    let startX, endX;
    $("#magazine").on("touchstart", function (e) {
        startX = e.originalEvent.touches[0].clientX;
    });
    $("#magazine").on("touchmove", function (e) {
        endX = e.originalEvent.touches[0].clientX;
    });
    $("#magazine").on("touchend", function () {
        let threshold = 50;
        if (startX - endX > threshold) {
            $("#magazine").turn("next");
        }
        else if (endX - startX > threshold) {
            $("#magazine").turn("previous");
        }
    });
});