// ==UserScript==
// @name         TOC - golem.de
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TOC plugin
// @author       Michael Brueggemann
// @include      https://www.golem.de/news/*
// @grant        unsafeWindow, GM_info
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('TOC - plugin: ' + GM_info.script.name);





    // plugin start ---------------------------------------------------------------
    var Plugin = function() {

        this.contentSelector = '.formatted';

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