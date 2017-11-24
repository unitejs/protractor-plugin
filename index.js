function uniteLoadAndWaitForPage(url, timeout) {
    return browser.get(url).then(function () {
        let rootLocator = $("#root");
        return browser.wait(protractor.ExpectedConditions.and(protractor.ExpectedConditions.presenceOf(rootLocator),
            function() {
                return rootLocator.getText()
                    .then((text) => {
                        return text && text.length > 0;
                    });
            }), timeout ? timeout : 5000, "Timeout expired waiting for #root content");
    });
}

/* Borrowed from here https://github.com/angular/protractor/pull/4392/files */
function customShadowRoot(selector, starting) {
    var selectors = selector.split('::sr');
    if (selectors.length === 0) {
        return [];
    }

    var shadowDomInUse = (document.head.createShadowRoot || document.head.attachShadow);
    var getShadowRoot = function (el) {
        return ((el && shadowDomInUse) ? el.shadowRoot : el);
    };
    var findAllMatches = function (selector /*string*/, targets /*array*/, firstTry /*boolean*/) {
        var scope, i, matches = [];
        for (i = 0; i < targets.length; ++i) {
            scope = (firstTry) ? targets[i] : getShadowRoot(targets[i]);
            if (scope) {
                if (selector === '') {
                    matches.push(scope);
                } else {
                    Array.prototype.push.apply(matches, scope.querySelectorAll(selector));
                }
            }
        }
        return matches;
    };

    var matches = findAllMatches(selectors.shift().trim(), [starting || document], true);
    while (selectors.length > 0 && matches.length > 0) {
        matches = findAllMatches(selectors.shift().trim(), matches, false);
    }
    return matches;
}

exports.setup = function () {
    browser.ignoreSynchronization = true;

    var path = require("path");
    var uniteConfig = require(path.join(process.cwd(), "../unite.json"));

    if (/aurelia/i.test(uniteConfig.applicationFramework)) {
        var app = require("aurelia-protractor-plugin");
        app.setup();
        browser.uniteLoadAndWaitForPage = browser.loadAndWaitForAureliaPage;
    } else {
        browser.uniteLoadAndWaitForPage = uniteLoadAndWaitForPage;
    }

    by.addLocator('customShadowRoot', customShadowRoot);
};

