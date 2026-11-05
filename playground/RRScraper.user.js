// ==UserScript==

// @name         RR Scraper
// @namespace    http://tampermonkey.net/
// @version      2026-11-04
// @description  Scrapes the Royal Road website for chapters and saves them to a local file.
// @author       Cold Bread
// @match        @match https://www.royalroad.com/fiction/*/chapter/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// ==/UserScript==
    /*

    1. rawHtml = window.getElementById(chapter-page-container)[0].innerHTML
            Get raw htmw from chapter

    2. GM_xmlhttpRequest  { storyId, chapterNum, title, body } 
            POST to shared cache
            -You’ll want @grant GM_xmlhttpRequest and @connect your-host — with @grant none, 
                GM_xmlhttpRequest bypasses cors

    3. create a UI element for config buttons (getCurrentChapter, getToLatestChapter, etc.)
        - ensure delay between requests. 
        - button should link to RR next chapter href
    4. 
    */

    async function postChapter() {
    try{
        //api request
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://example.com/",
            headers: {
              "Content-Type": "application/json"
            },
            onload: function(response) {
              console.log(response.responseText);
            }
          });
          
          const r = await GM.xmlHttpRequest({ url: "https://example.com/" }).catch(e => console.error(e));
          console.log(r.responseText);
        }catch(error) {
            console.error(error);
        }
    }

(function () {
  "use strict";


    rawHtml = window.getElementById(chapter-page-container)[0].innerHTML


  }


    


    //
})();
