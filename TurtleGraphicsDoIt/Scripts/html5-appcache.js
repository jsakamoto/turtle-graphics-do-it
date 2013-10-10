(function () {
    var cache = window.applicationCache;
    cache.addEventListener("updateready", function () {
        cache.swapCache();
        window.location.reload();
    });
    if (window.navigator.onLine) {
        try { cache.update(); } catch (_) { }
    }
})();