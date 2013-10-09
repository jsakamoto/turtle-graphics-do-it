(function () {
    function updateBodyCssClass() {
        var isOnline = window.navigator.onLine;
        var classes = window.document.body.className.split(' ');
        var newClasses = [];
        for (var i = 0; i < classes.length; i++) {
            var className = classes[i];
            if (className == '') continue;
            if (className == 'html5-online') continue;
            if (className == 'html5-offline') continue;
            newClasses.push(className);
        }
        newClasses.push(isOnline ? 'html5-online' : 'html5-offline');
        window.document.body.className = newClasses.join(' ');
    }
    window.addEventListener('online', updateBodyCssClass);
    window.addEventListener('offline', updateBodyCssClass);
    updateBodyCssClass();
})();
