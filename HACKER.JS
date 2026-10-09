// ==========================================
// CYBERSAFE - HACKER THEME SCRIPT
// Replaces emoji icons
// with an SVG shield/padlock, adds matrix rain.
// ==========================================

(function () {

    // 2) Logos (SVG)
    var SHIELD_LOGO =
        '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M32 4 56 13v19c0 14-10 24-24 28C18 56 8 46 8 32V13z" fill="#0a1630" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M26 30v-5a6 6 0 0 1 12 0v5" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>' +
        '<rect x="22" y="30" width="20" height="16" rx="3" fill="#38bdf8"/>' +
        '<circle cx="32" cy="37" r="2.6" fill="#050a18"/>' +
        '<rect x="31" y="38" width="2" height="5" fill="#050a18"/>' +
        '</svg>';

    var PADLOCK =
        '<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path class="lock-shackle" d="M36 62V42a24 24 0 0 1 48 0v20" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>' +
        '<rect x="18" y="60" width="84" height="66" rx="10" fill="#0a1630" stroke="#38bdf8" stroke-width="5"/>' +
        '<circle cx="60" cy="87" r="9" fill="#38bdf8"/>' +
        '<rect x="56" y="92" width="8" height="19" rx="3" fill="#38bdf8"/>' +
        '</svg>';


    function init() {

        // 3) Replace emoji icons
        var navLogo = document.querySelector(".logo span");
        if (navLogo) navLogo.innerHTML = SHIELD_LOGO;

        var footerLogo = document.querySelector(".footer-logo");
        if (footerLogo) footerLogo.innerHTML = SHIELD_LOGO + " CyberSafe";

        [".splash-icon", ".shield-icon", ".final-icon", ".result-icon"].forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                el.innerHTML = PADLOCK;
            });
        });


        // 4) Matrix rain background
        var canvas = document.createElement("canvas");
        canvas.id = "matrixCanvas";
        document.body.prepend(canvas);

        var ctx = canvas.getContext("2d");
        var chars = "01{}[]<>/\\|#$%&*+=";
        var size = 16;
        var drops = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drops = [];
            for (var i = 0; i < Math.ceil(canvas.width / size); i++) {
                drops.push(Math.random() * -50);
            }
        }

        function draw() {
            ctx.fillStyle = "rgba(5, 10, 24, 0.12)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#38bdf8";
            ctx.font = size + "px monospace";

            for (var i = 0; i < drops.length; i++) {
                var ch = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(ch, i * size, drops[i] * size);

                if (drops[i] * size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        resize();
        window.addEventListener("resize", resize);

        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) setInterval(draw, 60);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();