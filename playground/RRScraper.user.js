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

async function postChapters(bookInfo, chapters) {
  try {
    //api request
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://xhgfzatdkuinipfuxtxn.supabase.co/rest/v1/CHAPTERS", //supabase access point
      headers: {
        "Content-Type": "application/json",
      },
      data: { bookInfo, chapters },
      onload: function (response) {
        console.log(response.responseText); //TESTING
      },
    });

    const r = await GM.xmlHttpRequest({ url: "https://example.com/" }).catch(
      (e) => console.error(e),
    );
    console.log(r.responseText);
  } catch (error) {
    console.error(error);
  }
}

function parseHTML(rawHTML) {
  const doc = new DOMParser().parseFromString(rawHTML, "text/html");
  const root = doc.body;

  function isBoxed(el) {
    // tune to whatever RR authors actually use **
    if (!(el instanceof HTMLElement)) return false;
    const s = el.style;
    return (
      el.tagName === "TABLE" ||
      s.border ||
      s.borderWidth ||
      /border/i.test(el.getAttribute("style") || "")
    );
  }

  function walk(node, out = []) {
    if (node.nodeType === Node.TEXT_NODE) {
      out.push(node.nodeValue.replace(/\s+/g, " "));
      return out;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return out;
    const el = /** @type {HTMLElement} */ (node);
    const tag = el.tagName;
    if (tag === "BR") {
      out.push("\n");
      return out;
    }
    if (tag === "SCRIPT" || tag === "STYLE") return out;
    if (isBoxed(el)) {
      const inner = [];
      for (const child of el.childNodes) walk(child, inner);
      out.push(frameBox(inner.join("").trim()));
      out.push("\n\n");
      return out;
    }
    const block = /^(P|DIV|H[1-6]|LI|TR)$/.test(tag);
    if (block) out.push("\n");
    for (const child of el.childNodes) walk(child, out);
    if (block) out.push("\n");
    return out;
  }

  return walk(root)
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function addScraperUI({ onScrape }) {
  const panel = document.createElement("div");
  panel.id = "rr-scraper-ui";
  Object.assign(panel.style, {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    zIndex: "999999",
    display: "flex",
    gap: "8px",
  });
  const currentChapBtn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Scrape Current Chapter";
  btn.addEventListener("click", () => onScrape(1));
  panel.append(currentChapBtn);

  const fiveChapBtn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Scrape Five Chapters";
  btn.addEventListener("click", () => onScrape(4));
  panel.append(fiveChapBtn);

  document.body.append(panel);
}

function getTitles() {
  const root = document.getElementById("chapterHeroData");
  if (!root) return null;

  const bookLink = root.querySelector('a[href^="/fiction/"]');
  const book = bookLink?.querySelector("h2")?.textContent?.trim() ?? null;
  const chapter = root.querySelector("h1")?.textContent?.trim() ?? null;
  const fictionMatch = bookLink
    ?.getAttribute("href")
    ?.match(/^\/fiction\/(\d+)\//);

  return {
    book,
    chapter,
    fictionId: fictionMatch?.[1] ?? null,
    fictionHref: bookLink?.getAttribute("href") ?? null,
  };
}

(function () {
  "use strict";
  const NEXT_CHAPTER_BUTTON = document.querySelector("#my-button-id"); // Use your specific selector

  const chapters = new Map();

  addScraperUI({
    onScrape(NumToScrape) {
      let bookInfo = getTitles();
      let scraped = 0;
      for (i = scraped; i < NumToScrape; i++) {
        const rawHTML = window?.getElementsByClassName(
          "chapter-inner chapter-content text-on-surface",
        )[0].innerHTML;

        if (!rawHtml) return;

        if (!chapters.has(bookInfo.chapter)) {
          chapters.set(bookInfo.chapter, parseHTML(rawHTML));
          scraped++; // only bump when it's new
        }

        if (NEXT_CHAPTER_BUTTON.disabled) {
          console.log("Next Chapter Unavailable");
          break;
        }
        NEXT_CHAPTER_BUTTON.click();
      }

      console.log(text); // TESTING
      postChapters(bookInfo, chapters);
    },
  });
})();
