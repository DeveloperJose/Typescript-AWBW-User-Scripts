// ==UserScript==
// @name            AWBW Highlight Cursor Coordinates
// @description     Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.
// @namespace       https://awbw.amarriner.com/
// @author          DeveloperJose
// @match           https://awbw.amarriner.com/game.php*
// @match           https://awbw.amarriner.com/moveplanner.php*
// @match           https://awbw.amarriner.com/*editmap*
// @icon            https://awbw.amarriner.com/terrain/unit_select.gif
// @version         2.3.0
// @supportURL      https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @contributionURL https://ko-fi.com/developerjose
// @license         MIT
// @unwrap
// @grant           none
// ==/UserScript==
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function () {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent =
    '/* This file is used to style the music player settings */\n\niframe {\n  border: none;\n}\n\n.cls-settings-menu {\n  display: none;\n  /* display: flex; */\n  left: 50%;\n  top: 40px;\n  flex-direction: column;\n  width: 750px;\n  border: black 1px solid;\n  z-index: 20;\n  text-align: center;\n  align-items: center;\n  font-family: "Nova Square", cursive !important;\n}\n\n.cls-settings-menu label {\n  background-color: white;\n  font-size: 12px;\n}\n\n.cls-settings-menu .cls-group-box > label {\n  width: 100%;\n  font-size: 13px;\n  background-color: #d6e0ed;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n\n.cls-settings-menu .cls-vertical-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n  position: relative;\n}\n\n.cls-settings-menu .cls-horizontal-box {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n  position: relative;\n}\n\n/* Puts the checkbox next to the label */\n.cls-settings-menu .cls-vertical-box[id$="options"] {\n  align-items: center;\n  align-self: center;\n}\n\n.cls-settings-menu .cls-vertical-box[id$="options"] .cls-horizontal-box {\n  width: 100%;\n  justify-content: center;\n}\n\n.cls-settings-menu .cls-vertical-box[id$="options"] .cls-horizontal-box input {\n  vertical-align: middle;\n}\n\n/* .cls-settings-menu .cls-vertical-box[id$="options"] .cls-horizontal-box label {\n  display: block;\n  padding-right: 10px;\n  padding-left: 22px;\n  text-indent: -22px;\n} */\n\n/* .cls-settings-menu .cls-horizontal-box[id$="random-themes"],\n.cls-settings-menu .cls-horizontal-box[id$="soundtrack"] {\n  justify-content: center;\n} */\n\n.cls-settings-menu-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  width: 100%;\n}\n\n.cls-settings-menu image {\n  vertical-align: middle;\n}\n\n.cls-settings-menu label[id$="version"] {\n  width: 100%;\n  font-size: 10px;\n  color: #888888;\n  background-color: #f0f0f0;\n}\n\n.cls-settings-menu a[id$="update"] {\n  font-size: 12px;\n  background-color: #ff0000;\n  color: white;\n  width: 100%;\n}\n.cls-settings-menu .co_caret {\n  position: absolute;\n  top: 28px;\n  left: 25px;\n  border: none;\n  z-index: 30;\n}\n\n.cls-settings-menu .co_portrait {\n  border-color: #009966;\n  z-index: 30;\n  border: 2px solid;\n  vertical-align: middle;\n  align-self: center;\n}\n\n.cls-settings-menu input[type="range"][id$="themes-start-on-day"] {\n  --c: rgb(168, 73, 208); /* active color */\n}\n/* \n * CSS Custom Range Slider\n * https://www.sitepoint.com/css-custom-range-slider/ \n */\n\n.cls-settings-menu input[type="range"] {\n  --c: rgb(53 57 60); /* active color */\n  --l: 15px; /* line thickness*/\n  --h: 30px; /* thumb height */\n  --w: 15px; /* thumb width */\n\n  width: 100%;\n  height: var(--h); /* needed for Firefox*/\n  --_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  background: none;\n  cursor: pointer;\n  overflow: hidden;\n  display: inline-block;\n}\n.cls-settings-menu input:focus-visible,\n.cls-settings-menu input:hover {\n  --p: 25%;\n}\n\n/* chromium */\n.cls-settings-menu input[type="range" i]::-webkit-slider-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n/* Firefox */\n.cls-settings-menu input[type="range"]::-moz-range-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n@supports not (color: color-mix(in srgb, red, red)) {\n  .cls-settings-menu input {\n    --_c: var(--c);\n  }\n}\n/*$vite$:1*/';
  document.head.appendChild(__vite_style__);
  function logDebug(message, ...args) {
    console.debug("[AWBW Improved Music Player]", message, ...args);
  }
  const IFRAME_ID = "music-player-iframe";
  new BroadcastChannel("awbw-music-player");
  function isIFrameActive() {
    var _a;
    const iframe = document.getElementById(IFRAME_ID);
    if (!iframe) return false;
    const href = ((_a = iframe.contentDocument) == null ? void 0 : _a.location.href) ?? iframe.src;
    return href !== null && href !== "" && href !== "about:blank";
  }
  function getCurrentDocument() {
    if (!isIFrameActive()) return window.document;
    const iframe = document.getElementById(IFRAME_ID);
    return (iframe == null ? void 0 : iframe.contentDocument) ?? window.document;
  }
  var PageType = /* @__PURE__ */ ((PageType2) => {
    PageType2["Maintenance"] = "Maintenance";
    PageType2["ActiveGame"] = "ActiveGame";
    PageType2["MapEditor"] = "MapEditor";
    PageType2["MovePlanner"] = "MovePlanner";
    PageType2["LiveQueue"] = "LiveQueue";
    PageType2["MainPage"] = "MainPage";
    PageType2["Default"] = "Default";
    return PageType2;
  })(PageType || {});
  function getCurrentPageType() {
    const doc = getCurrentDocument();
    const isMaintenance = doc.querySelector("#server-maintenance-alert") !== null;
    if (isMaintenance) return "Maintenance";
    if (doc.location.href.indexOf("game.php") > -1) return "ActiveGame";
    if (doc.location.href.indexOf("editmap.php?") > -1) return "MapEditor";
    if (doc.location.href.indexOf("moveplanner.php") > -1) return "MovePlanner";
    if (doc.location.href.indexOf("live_queue.php") > -1) return "LiveQueue";
    if (doc.location.href === "https://awbw.amarriner.com/") return "MainPage";
    return "Default";
  }
  function getGamemap() {
    return getCurrentDocument().querySelector("#gamemap");
  }
  function getGamemapContainer() {
    return getCurrentDocument().querySelector("#gamemap-container");
  }
  function getZoomInBtn() {
    return getCurrentDocument().querySelector("#zoom-in");
  }
  function getZoomOutBtn() {
    return getCurrentDocument().querySelector("#zoom-out");
  }
  function getCurrentZoomLevel() {
    const storedScale = localStorage.getItem("scale") || "1";
    return parseFloat(storedScale);
  }
  function getCoordsDiv() {
    return getCurrentDocument().querySelector("#coords");
  }
  function addUpdateCursorObserver(onCursorMove2) {
    const coordsDiv = getCoordsDiv();
    if (!coordsDiv) return;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        let coordsText = mutation.target.textContent;
        coordsText = coordsText.substring(1, coordsText.length - 1);
        const splitCoords = coordsText.split(",");
        const cursorX = Number(splitCoords[0]);
        const cursorY = Number(splitCoords[1]);
        onCursorMove2(cursorX, cursorY);
      }
    });
    observer.observe(coordsDiv, { childList: true });
  }
  const ORANGE_STAR_COs = /* @__PURE__ */ new Set(["andy", "max", "sami", "nell", "hachi", "jake", "rachel"]);
  const BLUE_MOON_COs = /* @__PURE__ */ new Set(["olaf", "grit", "colin", "sasha"]);
  const GREEN_EARTH_COs = /* @__PURE__ */ new Set(["eagle", "drake", "jess", "javier"]);
  const YELLOW_COMET_COs = /* @__PURE__ */ new Set(["kanbei", "sonja", "sensei", "grimm"]);
  const BLACK_HOLE_COs = /* @__PURE__ */ new Set([
    "flak",
    "lash",
    "adder",
    "hawke",
    "sturm",
    "jugger",
    "koal",
    "kindle",
    "vonbolt",
  ]);
  function getAllCONames(properCase = false) {
    if (!properCase)
      return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    const allCOs = [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    allCOs[allCOs.indexOf("vonbolt")] = "Von Bolt";
    return allCOs.map((co) => co[0].toUpperCase() + co.slice(1));
  }
  function getMapColumns() {
    if (getCurrentPageType() === PageType.MapEditor) return designMapEditor.map.maxX;
    return typeof maxX !== "undefined" ? maxX : typeof map_width !== "undefined" ? map_width : -1;
  }
  function getMapRows() {
    if (getCurrentPageType() === PageType.MapEditor) return designMapEditor.map.maxY;
    return typeof maxY !== "undefined" ? maxY : typeof map_height !== "undefined" ? map_height : -1;
  }
  function getResizeMapFn() {
    return typeof designMapEditor !== "undefined" ? designMapEditor.resizeMap : null;
  }
  var ScriptName = /* @__PURE__ */ ((ScriptName2) => {
    ScriptName2["None"] = "none";
    ScriptName2["MusicPlayer"] = "music_player";
    ScriptName2["HighlightCursorCoordinates"] = "highlight_cursor_coordinates";
    return ScriptName2;
  })(ScriptName || {});
  const versions = /* @__PURE__ */ new Map([
    ["music_player", "5.29.1"],
    ["highlight_cursor_coordinates", "2.3.0"],
  ]);
  const updateURLs = /* @__PURE__ */ new Map([
    ["music_player", "https://update.greasyfork.org/scripts/518170/Improved%20AWBW%20Music%20Player.meta.js"],
    [
      "highlight_cursor_coordinates",
      "https://update.greasyfork.org/scripts/520884/AWBW%20Highlight%20Cursor%20Coordinates.meta.js",
    ],
  ]);
  const homepageURLs = /* @__PURE__ */ new Map([
    ["music_player", "https://greasyfork.org/en/scripts/518170-improved-awbw-music-player"],
    ["highlight_cursor_coordinates", "https://greasyfork.org/en/scripts/520884-awbw-highlight-cursor-coordinates"],
  ]);
  function checkIfUpdateIsAvailable(scriptName) {
    const isGreater = (a, b) => {
      return a.localeCompare(b, void 0, { numeric: true }) === 1;
    };
    return new Promise((resolve, reject) => {
      const updateURL = updateURLs.get(scriptName);
      if (!updateURL) return reject(`Failed to get the update URL for the script.`);
      return fetch(updateURL)
        .then((response) => response.text())
        .then((text) => {
          var _a;
          if (!text) return reject(`Failed to get the HTML from the update URL for the script.`);
          const latestVersion = (_a = text.match(/@version\s+([0-9.]+)/)) == null ? void 0 : _a[1];
          if (!latestVersion) return reject(`Failed to get the latest version of the script.`);
          const currentVersion = versions.get(scriptName);
          if (!currentVersion) return reject(`Failed to get the current version of the script.`);
          const currentVersionParts = currentVersion.split(".");
          const latestVersionParts = latestVersion.split(".");
          const hasThreeParts = currentVersionParts.length === 3 && latestVersionParts.length === 3;
          if (!hasThreeParts) return reject(`The version number of the script is not in the correct format.`);
          const isUpdateAvailable = isGreater(latestVersion, currentVersion);
          logDebug(`Current version: ${currentVersion}, latest: ${latestVersion}, update needed: ${isUpdateAvailable}`);
          return resolve(isUpdateAvailable);
        })
        .catch((reason) => reject(reason));
    });
  }
  function sanitize(str) {
    return str.toLowerCase().replaceAll(" ", "-");
  }
  class CustomMenuSettingsUI {
    /**
     * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
     * @param prefix - A string used to prefix the IDs of the elements in the menu.
     * @param buttonImageURL - The URL of the image to be used as the button.
     * @param hoverText - The text to be displayed when hovering over the button.
     */
    constructor(prefix, buttonImageURL, hoverText = "") {
      /**
       * The root element or parent of the custom menu.
       */
      __publicField(this, "parent");
      /**
       * A map that contains the important nodes of the menu.
       * The keys are the names of the children, and the values are the elements themselves.
       * Allows for easy access to any element in the menu.
       */
      __publicField(this, "groups", /* @__PURE__ */ new Map());
      /**
       * A map that contains the group types for each group in the menu.
       * The keys are the names of the groups, and the values are the types of the groups.
       */
      __publicField(this, "groupTypes", /* @__PURE__ */ new Map());
      /**
       * An array of all the input elements in the menu.
       */
      __publicField(this, "inputElements", []);
      /**
       * An array of all the button elements in the menu.
       */
      __publicField(this, "buttonElements", []);
      /**
       * A boolean that represents whether the settings menu is open or not.
       */
      __publicField(this, "isSettingsMenuOpen", false);
      /**
       * A string used to prefix the IDs of the elements in the menu.
       */
      __publicField(this, "prefix");
      /**
       * A boolean that represents whether an update is available for the script.
       */
      __publicField(this, "isUpdateAvailable", false);
      /**
       * Text to be displayed when hovering over the main button.
       */
      __publicField(this, "parentHoverText", "");
      /**
       * A map that contains the tables in the menu.
       * The keys are the names of the tables, and the values are the table elements.
       */
      __publicField(this, "tableMap", /* @__PURE__ */ new Map());
      __publicField(this, "visualProgress", 0);
      __publicField(this, "animationFrame", null);
      __publicField(this, "fadeTimeout", null);
      this.prefix = prefix;
      this.parentHoverText = hoverText;
      this.parent = document.createElement("div");
      this.parent.classList.add("game-tools-btn");
      this.parent.style.width = "34px";
      this.parent.style.height = "30px";
      this.setNodeID(
        this.parent,
        "parent",
        /* Parent */
      );
      const hoverSpan = document.createElement("span");
      hoverSpan.classList.add("game-tools-btn-text", "small_text");
      hoverSpan.innerText = hoverText;
      this.parent.appendChild(hoverSpan);
      this.setNodeID(
        hoverSpan,
        "hover",
        /* Hover */
      );
      const bgDiv = document.createElement("div");
      bgDiv.classList.add("game-tools-bg");
      bgDiv.style.position = "relative";
      bgDiv.style.width = "100%";
      bgDiv.style.height = "20px";
      bgDiv.style.backgroundColor = "transparent";
      bgDiv.style.overflow = "hidden";
      const fillDiv = document.createElement("div");
      fillDiv.style.position = "absolute";
      fillDiv.style.top = "0";
      fillDiv.style.left = "0";
      fillDiv.style.bottom = "0";
      fillDiv.style.width = "0%";
      fillDiv.style.backgroundColor = "#0066CC";
      fillDiv.style.zIndex = "0";
      bgDiv.appendChild(fillDiv);
      this.parent.appendChild(bgDiv);
      this.setNodeID(
        bgDiv,
        "background",
        /* Background */
      );
      this.setNodeID(
        fillDiv,
        "progress-fill",
        /* ProgressFill */
      );
      bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
      bgDiv.addEventListener("mouseout", () => this.setHoverText(""));
      const btnLink = document.createElement("a");
      btnLink.classList.add("norm2");
      btnLink.style.zIndex = "20";
      bgDiv.appendChild(btnLink);
      const btnImg = document.createElement("img");
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this.setNodeID(
        btnImg,
        "button-image",
        /* Button_Image */
      );
      const contextMenu = document.createElement("div");
      contextMenu.classList.add("cls-settings-menu");
      contextMenu.style.zIndex = "30";
      this.parent.appendChild(contextMenu);
      this.setNodeID(
        contextMenu,
        "settings",
        /* Settings */
      );
      const contextMenuBoxesContainer = document.createElement("div");
      contextMenuBoxesContainer.classList.add("cls-horizontal-box");
      contextMenu.appendChild(contextMenuBoxesContainer);
      const leftBox = document.createElement("div");
      leftBox.classList.add("cls-settings-menu-box");
      leftBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(leftBox);
      this.setNodeID(
        leftBox,
        "settings-left",
        /* Settings_Left */
      );
      const centerBox = document.createElement("div");
      centerBox.classList.add("cls-settings-menu-box");
      centerBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(centerBox);
      this.setNodeID(
        centerBox,
        "settings-center",
        /* Settings_Center */
      );
      const rightBox = document.createElement("div");
      rightBox.classList.add("cls-settings-menu-box");
      rightBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(rightBox);
      this.setNodeID(
        rightBox,
        "settings-right",
        /* Settings_Right */
      );
      document.addEventListener("contextmenu", (event) => {
        const element = event.target;
        if (!element.id.startsWith(this.prefix)) return;
        event.stopImmediatePropagation();
        event.preventDefault();
        this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
        if (this.isSettingsMenuOpen) {
          this.openContextMenu();
        } else {
          this.closeContextMenu();
        }
      });
      document.addEventListener("click", (event) => {
        let elmnt = event.target;
        if (!elmnt.id) {
          while (!elmnt.id) {
            elmnt = elmnt.parentNode;
            if (!elmnt) break;
          }
        }
        if (!elmnt) return;
        if (elmnt.id.startsWith(this.prefix) || elmnt.id === "overDiv") return;
        this.closeContextMenu();
      });
    }
    setNodeID(node, id) {
      node.id = `${this.prefix}_${id}`;
    }
    getNodeByID(id) {
      const fullID = `${this.prefix}_${id}`;
      const node = getCurrentDocument().getElementById(fullID) ?? this.parent.querySelector(`#${fullID}`);
      if (!node) {
        if (id !== "co-selector") console.log(`[DevJ] Node with ID ${fullID} not found.`);
        return null;
      }
      const isSettingsSubMenu = id === "settings-left" || id === "settings-center" || id === "settings-right";
      const isHidden = node.style.display === "none";
      const hasChildren = node.children.length > 0;
      if (isSettingsSubMenu && isHidden && hasChildren) {
        node.style.display = "flex";
      }
      return node;
    }
    /**
     * Adds the custom menu to the AWBW page.
     */
    addToAWBWPage(div, prepend = false) {
      if (!div) {
        console.error("[DevJ] Parent div is null, cannot add custom menu to the page.");
        return;
      }
      if (!prepend) {
        div.appendChild(this.parent);
        this.parent.style.borderLeft = "none";
        return;
      }
      div.prepend(this.parent);
      this.parent.style.borderRight = "none";
    }
    hasSettings() {
      var _a, _b, _c;
      const hasLeftMenu =
        ((_a = this.getNodeByID(
          "settings-left",
          /* Settings_Left */
        )) == null
          ? void 0
          : _a.style.display) !== "none";
      const hasCenterMenu =
        ((_b = this.getNodeByID(
          "settings-center",
          /* Settings_Center */
        )) == null
          ? void 0
          : _b.style.display) !== "none";
      const hasRightMenu =
        ((_c = this.getNodeByID(
          "settings-right",
          /* Settings_Right */
        )) == null
          ? void 0
          : _c.style.display) !== "none";
      return hasLeftMenu || hasCenterMenu || hasRightMenu;
    }
    getGroup(groupName) {
      return this.groups.get(groupName);
    }
    /**
     * Changes the hover text of the main button.
     * @param text - The text to be displayed when hovering over the button.
     * @param replaceParent - Whether to replace the current hover text for the main button or not.
     */
    setHoverText(text, replaceParent = false) {
      const hoverSpan = this.getNodeByID(
        "hover",
        /* Hover */
      );
      if (!hoverSpan) return;
      if (replaceParent) this.parentHoverText = text;
      if (this.isUpdateAvailable) text += " (New Update Available!)";
      hoverSpan.innerText = text;
      hoverSpan.style.display = text === "" ? "none" : "block";
      hoverSpan.style.textAlign = "center";
    }
    /**
     * Sets the progress of the UI by coloring the background of the main button.
     * @param progress - A number between 0 and 100 representing the percentage of the progress bar to fill.
     */
    setProgress(targetProgress) {
      const fillDiv = this.getNodeByID(
        "progress-fill",
        /* ProgressFill */
      );
      if (!fillDiv) return;
      const clamped = Math.max(0, Math.min(targetProgress, 100));
      if (this.fadeTimeout) {
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = null;
      }
      if (clamped === 0) {
        fillDiv.style.opacity = "1";
        fillDiv.style.width = "0%";
        fillDiv.style.transition = "";
      } else if (clamped >= 100) {
        fillDiv.style.width = "100%";
        this.fadeTimeout = window.setTimeout(() => (fillDiv.style.opacity = "0"), 300);
        fillDiv.style.transition = "width 0.25s ease, opacity 0.5s ease";
      } else {
        fillDiv.style.opacity = "1";
        fillDiv.style.width = `${clamped}%`;
        fillDiv.style.transition = "width 0.25s ease, opacity 0.5s ease";
      }
      this.visualProgress = clamped;
    }
    /**
     * Sets the image of the main button.
     * @param imageURL - The URL of the image to be used on the button.
     */
    setImage(imageURL) {
      const btnImg = this.getNodeByID(
        "button-image",
        /* Button_Image */
      );
      btnImg.src = imageURL;
    }
    /**
     * Adds an event listener to the main button.
     * @param type - The type of event to listen for.
     * @param listener - The function to be called when the event is triggered.
     */
    addEventListener(type, listener, options = false) {
      const div = this.getNodeByID(
        "background",
        /* Background */
      );
      div == null ? void 0 : div.addEventListener(type, listener, options);
    }
    /**
     * Opens the context (right-click) menu.
     */
    openContextMenu() {
      var _a;
      const contextMenu = this.getNodeByID(
        "settings",
        /* Settings */
      );
      if (!contextMenu) return;
      const hasVersion =
        ((_a = this.getNodeByID(
          "version",
          /* Version */
        )) == null
          ? void 0
          : _a.style.display) !== "none";
      if (!this.hasSettings() && !hasVersion) return;
      contextMenu.style.display = "flex";
      this.isSettingsMenuOpen = true;
    }
    /**
     * Closes the context (right-click) menu.
     */
    closeContextMenu() {
      const contextMenu = this.getNodeByID(
        "settings",
        /* Settings */
      );
      if (!contextMenu) return;
      contextMenu.style.display = "none";
      this.isSettingsMenuOpen = false;
      const overDiv = document.querySelector("#overDiv");
      const hasCOSelector =
        this.getNodeByID(
          "co-selector",
          /* CO_Selector */
        ) !== null;
      const isGamePageAndActive = getCurrentPageType() === PageType.ActiveGame;
      if (overDiv && hasCOSelector && isGamePageAndActive) {
        overDiv.style.visibility = "hidden";
      }
    }
    /**
     * Adds an input slider to the context menu.
     * @param name - The name of the slider.
     * @param min - The minimum value of the slider.
     * @param max - The maximum value of the slider.
     * @param step - The step value of the slider.
     * @param hoverText - The text to be displayed when hovering over the slider.
     * @param position - The position of the slider in the context menu.
     * @returns - The slider element.
     */
    addSlider(name, min, max, step, hoverText = "", position = "settings-center") {
      const submenu = this.getNodeByID(position);
      if (!submenu) return;
      const sliderBox = document.createElement("div");
      sliderBox.classList.add("cls-vertical-box");
      sliderBox.classList.add("cls-group-box");
      submenu == null ? void 0 : submenu.appendChild(sliderBox);
      const label = document.createElement("label");
      sliderBox == null ? void 0 : sliderBox.appendChild(label);
      const slider = document.createElement("input");
      slider.id = `${this.prefix}-${sanitize(name)}`;
      slider.type = "range";
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      this.inputElements.push(slider);
      slider.addEventListener("input", (_e) => {
        let displayValue = slider.value;
        if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";
        label.innerText = `${name}: ${displayValue}`;
      });
      sliderBox == null ? void 0 : sliderBox.appendChild(slider);
      slider.title = hoverText;
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addGroup(groupName, type = "cls-horizontal-box", position = "settings-center") {
      const submenu = this.getNodeByID(position);
      if (!submenu) return;
      if (this.groups.has(groupName)) return this.groups.get(groupName);
      const groupBox = document.createElement("div");
      groupBox.classList.add("cls-vertical-box");
      groupBox.classList.add("cls-group-box");
      submenu == null ? void 0 : submenu.appendChild(groupBox);
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      groupBox == null ? void 0 : groupBox.appendChild(groupLabel);
      const group = document.createElement("div");
      group.id = `${this.prefix}-${sanitize(groupName)}`;
      group.classList.add(type);
      groupBox == null ? void 0 : groupBox.appendChild(group);
      this.groups.set(groupName, group);
      this.groupTypes.set(groupName, type);
      return group;
    }
    addRadioButton(name, groupName, hoverText = "") {
      return this.addInput(
        name,
        groupName,
        hoverText,
        "radio",
        /* Radio */
      );
    }
    addCheckbox(name, groupName, hoverText = "") {
      return this.addInput(
        name,
        groupName,
        hoverText,
        "checkbox",
        /* Checkbox */
      );
    }
    addButton(name, groupName, hoverText = "") {
      return this.addInput(
        name,
        groupName,
        hoverText,
        "button",
        /* Button */
      );
    }
    /**
     * Adds an input to the context menu in a specific group.
     * @param name - The name of the input.
     * @param groupName - The name of the group the input belongs to.
     * @param hoverText - The text to be displayed when hovering over the input.
     * @param type - The type of input to be added.
     * @returns - The input element.
     */
    addInput(name, groupName, hoverText = "", type) {
      const groupDiv = this.getGroup(groupName);
      const groupType = this.groupTypes.get(groupName);
      if (!groupDiv || !groupType) return;
      const inputBox = document.createElement("div");
      const otherType = groupType === "cls-horizontal-box" ? "cls-vertical-box" : "cls-horizontal-box";
      inputBox.classList.add(otherType);
      groupDiv.appendChild(inputBox);
      inputBox.title = hoverText;
      inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
      inputBox.addEventListener("mouseout", () => this.setHoverText(""));
      let input;
      if (type === "button") {
        input = this.createButton(name, inputBox);
      } else {
        input = this.createInput(name, inputBox);
      }
      input.type = type;
      input.name = groupName;
      return input;
    }
    createButton(name, inputBox) {
      const input = document.createElement("button");
      input.innerText = name;
      inputBox.appendChild(input);
      this.buttonElements.push(input);
      return input;
    }
    createInput(name, inputBox) {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.appendChild(input);
      label.appendChild(document.createTextNode(name));
      inputBox.appendChild(label);
      this.inputElements.push(input);
      return input;
    }
    /**
     * Adds a special version label to the context menu.
     * @param version - The version to be displayed.
     */
    addVersion() {
      const version = versions.get(this.prefix);
      if (!version) return;
      const contextMenu = this.getNodeByID(
        "settings",
        /* Settings */
      );
      const versionDiv = document.createElement("label");
      versionDiv.innerText = `Version: ${version} (DevJ Edition)`;
      contextMenu == null ? void 0 : contextMenu.appendChild(versionDiv);
      this.setNodeID(
        versionDiv,
        "version",
        /* Version */
      );
    }
    checkIfNewVersionAvailable() {
      const currentVersion = versions.get(this.prefix);
      const updateURL = updateURLs.get(this.prefix);
      const homepageURL = homepageURLs.get(this.prefix) || "";
      if (!currentVersion || !updateURL) return;
      checkIfUpdateIsAvailable(this.prefix)
        .then((isUpdateAvailable) => {
          this.isUpdateAvailable = isUpdateAvailable;
          console.log("[DevJ] Checking if a new version is available...", isUpdateAvailable);
          if (!isUpdateAvailable) return;
          const contextMenu = this.getNodeByID(
            "settings",
            /* Settings */
          );
          const versionDiv = document.createElement("a");
          versionDiv.id = this.prefix + "-update";
          versionDiv.href = homepageURL;
          versionDiv.target = "_blank";
          versionDiv.innerText = `(!) Update Available: Please click here to open the update page in a new tab. (!)`;
          contextMenu == null ? void 0 : contextMenu.append(versionDiv.cloneNode(true));
          if (this.hasSettings()) contextMenu == null ? void 0 : contextMenu.prepend(versionDiv);
        })
        .catch((error) => console.error(error));
    }
    addTable(name, rows, columns, groupName, hoverText = "") {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const table = document.createElement("table");
      table.classList.add("cls-settings-table");
      groupDiv.appendChild(table);
      table.title = hoverText;
      table.addEventListener("mouseover", () => this.setHoverText(hoverText));
      table.addEventListener("mouseout", () => this.setHoverText(""));
      const tableData = {
        table,
        rows,
        columns,
      };
      this.tableMap.set(name, tableData);
      return table;
    }
    addItemToTable(name, item) {
      const tableData = this.tableMap.get(name);
      if (!tableData) return;
      const table = tableData.table;
      if (table.rows.length === 0) table.insertRow();
      const maxItemsPerRow = tableData.columns;
      const currentItemsInRow = table.rows[table.rows.length - 1].cells.length;
      if (currentItemsInRow >= maxItemsPerRow) table.insertRow();
      const currentRow = table.rows[table.rows.length - 1];
      const cell = currentRow.insertCell();
      cell.appendChild(item);
    }
    clearTable(name) {
      const tableData = this.tableMap.get(name);
      if (!tableData) return;
      const table = tableData.table;
      table.innerHTML = "";
    }
    /**
     * Calls the input event on all input elements in the menu.
     * Useful for updating the labels of all the inputs.
     */
    updateAllInputLabels() {
      const event = new Event("input");
      this.inputElements.forEach((input) => {
        input.dispatchEvent(event);
      });
    }
    /**
     * Adds a CO selector to the context menu. Only one CO selector can be added to the menu.
     * @param groupName - The name of the group the CO selector should be added to.
     * @param hoverText - The text to be displayed when hovering over the CO selector.
     * @param onClickFn - The function to be called when a CO is selected from the selector.
     * @returns - The CO selector element.
     */
    addCOSelector(groupName, hoverText = "", onClickFn) {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const coSelector = document.createElement("a");
      coSelector.classList.add("game-tools-btn");
      coSelector.href = "javascript:void(0)";
      const imgCaret = this.createCOSelectorCaret();
      const imgCO = this.createCOPortraitImage("andy");
      coSelector.appendChild(imgCaret);
      coSelector.appendChild(imgCO);
      coSelector.title = hoverText;
      coSelector.addEventListener("mouseover", () => this.setHoverText(hoverText));
      coSelector.addEventListener("mouseout", () => this.setHoverText(""));
      this.setNodeID(
        coSelector,
        "co-selector",
        /* CO_Selector */
      );
      this.setNodeID(
        imgCO,
        "co-portrait",
        /* CO_Portrait */
      );
      groupDiv == null ? void 0 : groupDiv.appendChild(coSelector);
      const allCOs = getAllCONames(true).sort();
      let allColumnsHTML = "";
      for (let i = 0; i < 7; i++) {
        const startIDX = i * 4;
        const endIDX = startIDX + 4;
        const templateFn = (coName) => this.createCOSelectorItem(coName);
        const currentColumnHTML = allCOs.slice(startIDX, endIDX).map(templateFn).join("");
        allColumnsHTML += `<td><table>${currentColumnHTML}</table></td>`;
      }
      const selectorInnerHTML = `<table><tr>${allColumnsHTML}</tr></table>`;
      const selectorTitle = `<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO`;
      coSelector.onclick = () => {
        const ret = overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
        const overdiv = document.querySelector("#overDiv");
        if (overdiv) overdiv.style.zIndex = "1000";
        return ret;
      };
      return coSelector;
    }
    createCOSelectorItem(coName) {
      const location = "javascript:void(0)";
      const internalName = coName.toLowerCase().replaceAll(" ", "");
      const prefix = internalName === "sturm" ? "aw2" : "ds";
      const imgSrc = `terrain/co-portraits/${prefix}/${internalName}.png?v=1`;
      const onClickFn = `awbw_music_player.notifyCOSelectorListeners('${internalName}');`;
      return `<tr><td class=borderwhite><img class=co_portrait src=${imgSrc}></td><td class=borderwhite align=center valign=center><span class=small_text><a onclick="${onClickFn}" href=${location}>${coName}</a></b></span></td></tr>`;
    }
    createCOSelectorCaret() {
      const imgCaret = document.createElement("img");
      imgCaret.classList.add("co_caret");
      imgCaret.src = "terrain/co_down_caret.gif";
      imgCaret.style.zIndex = "300";
      return imgCaret;
    }
    createCOPortraitImage(coName) {
      const imgCO = document.createElement("img");
      imgCO.classList.add("co_portrait");
      const prefix = coName.toLowerCase() === "sturm" ? "aw2" : "ds";
      imgCO.src = `terrain/co-portraits/${prefix}/${coName}.png?v=1`;
      if (!getAllCONames().includes(coName)) {
        imgCO.src = `terrain/${coName}`;
      }
      return imgCO;
    }
    createCOPortraitImageWithText(coName, text) {
      const div = document.createElement("div");
      div.classList.add("cls-vertical-box");
      const coImg = this.createCOPortraitImage(coName);
      div.appendChild(coImg);
      const coLabel = document.createElement("label");
      coLabel.textContent = text;
      div.appendChild(coLabel);
      return div;
    }
    onCOSelectorClick(coName) {
      const overDiv = document.querySelector("#overDiv");
      overDiv.style.visibility = "hidden";
      const imgCO = this.getNodeByID(
        "co-portrait",
        /* CO_Portrait */
      );
      const prefix = coName.toLowerCase() === "sturm" ? "aw2" : "ds";
      imgCO.src = `terrain/co-portraits/${prefix}/${coName}.png?v=1`;
    }
  }
  function getMaximizeBtn() {
    return document.getElementsByClassName("AWBWMaxmiseButton")[0];
  }
  const gamemap = getGamemap();
  const gamemapContainer = getGamemapContainer();
  const zoomInBtn = getZoomInBtn();
  const zoomOutBtn = getZoomOutBtn();
  let ahResizeMap = getResizeMapFn();
  const FONT_SIZE = 9;
  const PREFIX = ScriptName.HighlightCursorCoordinates;
  const BUTTON_IMG_URL = "https://awbw.amarriner.com/terrain/unit_select.gif";
  let isEnabled = true;
  let previousHighlight = [];
  let isMaximizeToggled = false;
  const currentSquares = new Array();
  function getMenu() {
    var _a;
    switch (getCurrentPageType()) {
      case PageType.MapEditor:
        return (_a = document.querySelector("#design-map-controls-container")) == null ? void 0 : _a.children[1];
      case PageType.MovePlanner:
        return document.querySelector("#map-controls-container");
      case PageType.ActiveGame: {
        const coordsDiv = getCoordsDiv();
        return coordsDiv.parentElement;
      }
    }
  }
  function setHighlight(node, highlight) {
    if (!isEnabled) return;
    if (!node) {
      console.error("[AWBW Highlight Cursor Coordinates] Node is null, something isn't right.");
      return;
    }
    let fontWeight = "";
    let color = "";
    let backgroundColor = "";
    if (highlight) {
      fontWeight = "bold";
      color = "#FFFFFF";
      backgroundColor = "#FF0000";
    }
    node.style.fontWeight = fontWeight;
    node.style.color = color;
    node.style.backgroundColor = backgroundColor;
  }
  function onZoomChangeEvent(_event, zoom = -1) {
    if (!isEnabled) return;
    if (zoom < 0) {
      zoom = getCurrentZoomLevel();
    }
    const padding = 16 * zoom;
    gamemapContainer.style.paddingBottom = padding + "px";
    gamemapContainer.style.paddingLeft = padding + "px";
  }
  function onCursorMove(cursorX, cursorY) {
    if (!isEnabled) return;
    const highlightRow = document.getElementById("grid-spot-row-" + cursorY);
    const highlightCol = document.getElementById("grid-spot-col-" + cursorX);
    if (!highlightRow || !highlightCol) {
      console.error("[AWBW Highlight Cursor Coordinates] Highlight row or column is null, something isn't right.");
      return;
    }
    if (previousHighlight.length > 0) {
      setHighlight(previousHighlight[0], false);
      setHighlight(previousHighlight[1], false);
    }
    setHighlight(highlightRow, true);
    setHighlight(highlightCol, true);
    previousHighlight = [highlightRow, highlightCol];
  }
  function onResizeMap(num, btnName) {
    ahResizeMap == null ? void 0 : ahResizeMap.apply(ahResizeMap, [num, btnName]);
    if (!isEnabled) return;
    addHighlightBoxesAroundMapEdges();
  }
  function clearHighlightBoxes() {
    if (currentSquares.length > 0) {
      currentSquares.forEach((element) => element.remove());
    }
    gamemapContainer.style.paddingBottom = "0px";
    gamemapContainer.style.paddingLeft = "0px";
  }
  function addHighlightBoxesAroundMapEdges() {
    const mapRows = getMapRows();
    const mapCols = getMapColumns();
    console.debug("[AWBW Highlight Cursor Coordinates] Adding highlight boxes", mapRows, mapCols);
    const spotSpanTemplate = document.createElement("span");
    spotSpanTemplate.style.width = "16px";
    spotSpanTemplate.style.height = "16px";
    spotSpanTemplate.style.left = "-16px";
    spotSpanTemplate.style.top = mapRows * 16 + "px";
    spotSpanTemplate.style.fontFamily = "monospace";
    spotSpanTemplate.style.position = "absolute";
    spotSpanTemplate.style.fontSize = FONT_SIZE + "px";
    spotSpanTemplate.style.zIndex = "100";
    spotSpanTemplate.style.alignContent = "center";
    clearHighlightBoxes();
    for (let row = 0; row < mapRows; row++) {
      const spotSpan = spotSpanTemplate.cloneNode(true);
      spotSpan.id = "grid-spot-row-" + row;
      spotSpan.style.top = row * 16 + "px";
      spotSpan.textContent = row.toString().padStart(2, "0");
      gamemap.appendChild(spotSpan);
      currentSquares.push(spotSpan);
    }
    for (let col = 0; col < mapCols; col++) {
      const spotSpan = spotSpanTemplate.cloneNode(true);
      spotSpan.id = "grid-spot-col-" + col;
      spotSpan.style.left = col * 16 + "px";
      spotSpan.textContent = col.toString().padStart(2, "0");
      gamemap.appendChild(spotSpan);
      currentSquares.push(spotSpan);
    }
    onZoomChangeEvent();
  }
  function main() {
    if (getCurrentPageType() === PageType.Maintenance) {
      console.log("[AWBW Highlight Cursor Coordinates] Maintenance mode is active, not loading script...");
      return;
    }
    if (getCurrentPageType() === PageType.MapEditor || getCurrentPageType() === PageType.MovePlanner) {
      isEnabled = false;
    }
    const isMapEditorAndNotLoaded =
      getCurrentPageType() === PageType.MapEditor && !(designMapEditor == null ? void 0 : designMapEditor.loaded);
    if (isMapEditorAndNotLoaded) {
      const interval = window.setInterval(() => {
        if (designMapEditor.loaded) {
          ahResizeMap = getResizeMapFn();
          main();
          window.clearInterval(interval);
        }
      }, 1e3);
      return;
    }
    addUpdateCursorObserver(onCursorMove);
    if (getCurrentPageType() === PageType.MapEditor) {
      designMapEditor.resizeMap = onResizeMap;
    }
    if (zoomInBtn != null) zoomInBtn.addEventListener("click", onZoomChangeEvent);
    if (zoomOutBtn != null) zoomOutBtn.addEventListener("click", onZoomChangeEvent);
    const maximizeBtn = getMaximizeBtn();
    if (maximizeBtn != null) {
      console.log("[AWBW Highlight Cursor Coordinates] Found AWBW Maximize script and connected to it.");
      maximizeBtn.addEventListener("click", (event) => {
        isMaximizeToggled = !isMaximizeToggled;
        onZoomChangeEvent(event, isMaximizeToggled ? 3 : -1);
      });
    }
    onZoomChangeEvent();
    if (isEnabled) addHighlightBoxesAroundMapEdges();
    const customUI = new CustomMenuSettingsUI(PREFIX, BUTTON_IMG_URL, "Disable Highlight Cursor Coordinates");
    customUI.addEventListener("click", () => {
      isEnabled = !isEnabled;
      const hoverText = isEnabled ? "Disable Highlight Cursor Coordinates" : "Enable Highlight Cursor Coordinates";
      customUI.setHoverText(hoverText, true);
      if (isEnabled) addHighlightBoxesAroundMapEdges();
      else clearHighlightBoxes();
    });
    customUI.addToAWBWPage(getMenu(), true);
    customUI.setProgress(100);
    if (getCurrentPageType() === PageType.MapEditor || getCurrentPageType() === PageType.MovePlanner) {
      customUI.parent.style.height = "31px";
    }
    customUI.addVersion();
    customUI.checkIfNewVersionAvailable();
    console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
  }
  main();
})();
