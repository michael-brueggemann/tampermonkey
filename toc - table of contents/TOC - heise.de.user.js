// ==UserScript==
// @name         TOC - heise.de
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TOC plugin
// @author       Michael Brueggemann
// @include      https://www.heise.de/*
// @grant        unsafeWindow, GM_info
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('TOC - plugin: ' + GM_info.script.name);



    // plugin start ---------------------------------------------------------------
    var Plugin = function() {

        this.contentSelector = '.article-content';

        this.processHeadline = function (headline) {
            var result = {
                'size': '',
                'text': '',
                'id': ''
            };

            result.size = headline.nodeName.split('')[1] - 2;

            try {
                result.text = headline.innerText;
                result.id = headline.getAttribute('id');
            } catch (e) {
                return null;
            }

            return result;
        };
    };
    // plugin end -----------------------------------------------------------------



    if (!unsafeWindow.toc) {
        unsafeWindow.toc = {};
    }

    if (!unsafeWindow.toc.plugin) {
        var plugin = new Plugin();
        plugin.name = GM_info.script.name;
        unsafeWindow.toc.plugin = plugin;
    } else {
        console.warn('window.toc.plugin already defined!');
    }

    if (typeof unsafeWindow.toc.init === 'function') {
        unsafeWindow.toc.init();
    }

})();