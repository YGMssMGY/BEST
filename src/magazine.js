document.addEventListener("DOMContentLoaded", function () {
    const PAGE_RATIO = 2482 / 3544;
    const magazine = $("#magazine");
    const container = document.getElementById("mag-container");
    const pages = $("#magazine div");
    let loaded = 0;
    pages.each(function () {
        const bg = $(this).data("bg");
        const img = new Image();
        img.src = bg;
        img.onload = () => {
            loaded++;
            $(this).css("background-image", `url(${bg})`);
            const percentage = (loaded / pages.length) * 100;
            $("#progress-bar").prop("value", percentage);
            $("#progress-label").text(Math.round(percentage) + "%");
            $("#loading-log").text(`Loaded ${loaded} of ${pages.length}`);
            if (loaded === pages.length) $("#loading-screen").fadeOut();
        };
    });

    magazine.turn({
        display: "single",
        acceleration: true,
        gradients: !$.isTouch,
        elevation: 50
    });

    function resizeMagazine() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        const displayMode = isPortrait ? "single" : "double";

        magazine.turn("display", displayMode);

        let pageCount = displayMode === "double" ? 2 : 1;
        let width = w;
        let height = width / (PAGE_RATIO * pageCount);

        if (height > h) {
            height = h;
            width = height * PAGE_RATIO * pageCount;
        }

        magazine.turn("size", Math.floor(width), Math.floor(height));
    }

    $("#prevBtn").click(() => magazine.turn("previous"));
    $("#nextBtn").click(() => magazine.turn("next"));

    $(window).on("keydown", e => {
        if (e.key === "ArrowLeft") magazine.turn("previous");
        if (e.key === "ArrowRight") magazine.turn("next");
    });

    let startX = 0, endX = 0;
    magazine.on("touchstart", e => startX = e.originalEvent.touches[0].clientX);
    magazine.on("touchmove", e => endX = e.originalEvent.touches[0].clientX);
    magazine.on("touchend", () => {
        const threshold = 50;
        if (startX - endX > threshold) magazine.turn("next");
        else if (endX - startX > threshold) magazine.turn("previous");
    });

    window.addEventListener("resize", resizeMagazine);
    window.addEventListener("orientationchange", () => setTimeout(resizeMagazine, 200));

    resizeMagazine();
    
    let hideTimeout;
    function showButtons() {
        clearTimeout(hideTimeout);
        $("#mag-container").addClass("touch-active");
        hideTimeout = setTimeout(() => {
            $("#mag-container").removeClass("touch-active");
        }, 2000);
    }

    $("#mag-container").on("mousemove", showButtons);
    $("#mag-container").on("touchstart", showButtons);
});