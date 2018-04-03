// ==UserScript==
// @name         TOC - Table Of Contents
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Created a to a fixed position on the top-right side. You can click in the TOC to collapse the TOC-links.
// @author       Michael Brueggemann

// @include      https://*.wikipedia.org/wiki/*
// @include      https://www.heise.de/*
// @include      https://www.golem.de/news/*
// @include      https://docs.bmc.com/docs/cloudlifecyclemanagement/46/*

// @grant        unsafeWindow
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    console.log('TOC - Table Of Contents');

    if (!unsafeWindow.toc) {
        unsafeWindow.toc = {};
    }

    var tocBox;
    var tocBoxHead;
    var tocBoxBody;

    var contentSelector;


    // *****************************************************************************************************************
    // UTIL Funktions
    // *****************************************************************************************************************
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    var cssString = `
/* styles for debugbox */

#tocBox{
border: 1px solid #a2a9b1;
background-color: #f8f9fa;
font-family: sans-serif;
font-size: 13px;
line-height: 1.2;
min-width: 160px;
max-width:320px;
opacity: 0.95;
}

#tocBoxHead {
padding: 5px;
text-align: center;
}

#tocBoxHead .headline{
font-weight: bold;
}

#tocBoxBody {
padding: 5px;
}

#tocBoxBody div {
padding-top: 5px;
}

.tocBoxHeadline1{
padding-left: 0px;
}
.tocBoxHeadline2{
padding-left: 20px;
}
.tocBoxHeadline3{
padding-left: 40px;
}
.tocBoxHeadline4{
padding-left: 60px;
}
.tocBoxHeadline5{
padding-left: 80px;
}

`;

    addGlobalStyle(cssString);





    function createTocBox() {
        tocBox = document.createElement('div');
        tocBox.setAttribute('id', 'tocBox');
        tocBox.innerHTML = '<div id="tocBoxHead"><span class="headline">Table Of Contents</span> <span>[<a class="togglelink">hide</a>]</span></div><div id="tocBoxBody">Body</div>';

        // set styles to move TOC to the right
        tocBox.setAttribute('style', 'position: fixed; right: 4px; top:100px; z-index: 10;');

        // append new tocBox to the page
        document.querySelector('body').appendChild(tocBox);

        tocBoxHead = document.getElementById('tocBoxHead');
        tocBoxBody = document.getElementById('tocBoxBody');

        // hide toc in the tocBoox when clicking on the tocBox header
        var togglelink = tocBoxHead.querySelector('.togglelink');
        togglelink.addEventListener('click', function() {
            var style = tocBoxBody.getAttribute('style');
            if (tocBoxBody && style && style.length > 0) {
                tocBoxBody.setAttribute('style', '');
                togglelink.innerText = 'hide';
            } else {
                tocBoxBody.setAttribute('style', 'display:none');
                togglelink.innerText = 'show';
            }
        });
    }

    /**
     * default implmentation for: <h2 id="idOfTheHeadline">Headline text</h2>
     */
    var processHeadline = function (headline) {
        var result = {
            'size': '',
            'text': '',
            'id': ''
        };

        result.size = headline.nodeName.split('')[1];

        try {
            result.text = headline.innerText;
            result.id = headline.getAttribute('id');
            // if there is no id, add an id
            if (!result.id) {
                headline.setAttribute('id', headline.innerText);
                result.id = headline.getAttribute('id');
            }
        } catch (e) {
            return null;
        }

        return result;
    };

    var createTocEntry = function(headline) {
        //console.log('createTocEntry()');
        var entry = '';
        entry += '<div class="tocBoxHeadline'+ headline.size +'">';
        entry += '<a href="#' +headline.id+ '">';
        entry += headline.text;
        entry += '</a>';
        entry += '</div>';
        return entry;
    };


    function createTocBody() {
        var headlineTags = document.querySelector(contentSelector).querySelectorAll('h1, h2, h3, h4');

        var headlines = [];
        var biggestHeadlineSize = 4;
        // parse all headline html elements and check the biggest headline size
        for (var i=0; i<headlineTags.length; i++) {
            var headline = processHeadline(headlineTags[i]);
            if (!headline) {
                continue;
            }
            headlines.push(headline);
            if (headline.size < biggestHeadlineSize) {
                biggestHeadlineSize = headline.size;
            }
        }

        // adjust the headline sizes
        for (i=0; i<headlines.length; i++) {
            headlines[i].size = headlines[i].size - (biggestHeadlineSize-1);
        }

        var html = '';

        for (i=0; i<headlines.length; i++) {
            //console.log(headlines[i]);
            html += createTocEntry(headlines[i]);
        }

        tocBoxBody.innerHTML = html;
    }



    // Adjust top of TOC after scrolling
    var updatePositionOfToc = function(topMin, topMinScrolling, positionElement) {
        var position = positionElement.scrollTop;
        if (position > topMin-topMinScrolling) {
            var top = topMin-position;
            if (top < topMinScrolling) {
                top = topMinScrolling;
            }
            tocBox.style.top = top + 'px';
        } else {
            tocBox.style.top = topMin - position + 'px';
        }
    };






    // init function
    unsafeWindow.toc.init = function() {
        var plugin = unsafeWindow.toc.plugin;
        console.log('TOC plugin: ' +plugin.name);

        contentSelector = plugin.contentSelector;
        if (plugin.processHeadline) {
            processHeadline = plugin.processHeadline;
        }
        if (plugin.createTocEntry) {
            createTocEntry = plugin.createTocEntry;
        }

        createTocBox();
        createTocBody();

        if (plugin.scrollConfig) {
            plugin.scrollConfig.positionElement.addEventListener('scroll', function() {
                updatePositionOfToc(plugin.scrollConfig.topMin, plugin.scrollConfig.topMinScrolling, plugin.scrollConfig.positionElement);
            });
            updatePositionOfToc(plugin.scrollConfig.topMin, plugin.scrollConfig.topMinScrolling, plugin.scrollConfig.positionElement);
        }

    };



    //===================================
    // Example Plugin for wikipedia
    //===================================
    if (document.location.href.indexOf('.wikipedia.org/wiki/') >= 0) {

        // plugin start ---------------------------------------------------------------
        var Plugin = function() {

            this.contentSelector = '#bodyContent';

            this.processHeadline = function (headline) {
                var result = {
                    'size': '',
                    'text': '',
                    'id': ''
                };

                result.size = headline.nodeName.split('')[1];

                try {
                    var spanTag = headline.querySelector('.mw-headline');
                    result.text = spanTag.innerText;
                    result.id = spanTag.getAttribute('id');
                } catch (e) {
                    return null;
                }

                return result;
            };

            this.scrollConfig = {
                'topMin': 85,
                'topMinScrolling': 35,
                'positionElement': document
            };

        };
        // plugin end -----------------------------------------------------------------


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

    }


})();