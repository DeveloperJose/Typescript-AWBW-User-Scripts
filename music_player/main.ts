/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 */

import canAutoplay, { CheckResponse } from "can-autoplay";

// Add our CSS to the page
import "../shared/style.css";
import "../shared/style_sliders.css";

import { getMusicPlayerUI, initializeMusicPlayerUI } from "./music_ui";
import {
  allowSettingsToBeSaved,
  getCurrentThemeType,
  loadSettingsFromLocalStorage,
  musicSettings,
} from "./music_settings";
import { addHandlers, changeCurrentMenuType, MenuOpenType } from "./handlers";
import { getLiveQueueBlockerPopup, getLiveQueueSelectPopup, getCurrentPageType, PageType } from "../shared/awbw_page";
import { GameSFX, getNeutralImgURL, getWorkingBaseURL, SpecialTheme } from "./resources";
import { logDebug, logInfo, logError, deepEqual } from "./utils";
import { checkHashesInDB, openDB } from "./db";
import { addThemeListeners, playMusicURL, playThemeSong, stopThemeSong } from "./music/co_themes";
import { preloadAllCommonAudio } from "./music/preloading";
import { broadcastChannel, getCurrentDocument, IFRAME_ID, initializeIFrame } from "./iframe";
import { playSFX } from "./music/sound_effects";
import { toggleDebugOverrides } from "./debugging";
import { notifyCOSelectorListeners } from "../shared/custom_ui";
import { isReplayActive } from "../shared/awbw_game";

/******************************************************************
 * MODULE EXPORTS
 ******************************************************************/
// Exporting this function is necessary for the CO Selector to work
export { notifyCOSelectorListeners as notifyCOSelectorListeners };
export { toggleDebugOverrides as toggleDebugOverrides };
//exports for Advanced Hotkeys user script
exports.playUiMenuOpen = function () {
  playSFX(GameSFX.uiMenuOpen);
};
exports.playUiMenuClose = function () {
  playSFX(GameSFX.uiMenuClose);
};
exports.resetMenuState = function () {
  changeCurrentMenuType(MenuOpenType.None);
};
exports.playUiUnitSelect = function () {
  playSFX(GameSFX.uiUnitSelect);
};

/******************************************************************
 * Functions
 ******************************************************************/

/**
 * Adjust the music player for the Live Queue page.
 */
function onLiveQueue() {
  const addMusicFn = () => {
    // Check if the parent popup is created and visible
    const blockerPopup = getLiveQueueBlockerPopup();
    if (!blockerPopup) return false;
    if (blockerPopup.style.display === "none") return false;

    // Now make sure the internal popup is created
    const popup = getLiveQueueSelectPopup();
    if (!popup) return false;

    // Get the div with "Match starts in ...."
    const box = popup.querySelector(".flex.row.hv-center");
    if (!box) return false;

    // Prepend the music player UI to the box
    // TODO
    getMusicPlayerUI().addToAWBWPage(box as HTMLElement, true);
    playMusicURL(SpecialTheme.COSelect);
    return true;
  };

  const checkStillActiveFn = () => {
    const blockerPopup = getLiveQueueBlockerPopup();
    return blockerPopup?.style.display !== "none";
  };

  const addPlayerIntervalID = window.setInterval(() => {
    // We have switched pages
    if (getCurrentPageType() !== PageType.LiveQueue) {
      window.clearInterval(addPlayerIntervalID);
      return;
    }

    if (!addMusicFn()) return;

    // We don't need to add the music player anymore
    window.clearInterval(addPlayerIntervalID);

    // Now we need to check if we need to pause/resume the music because the player left/rejoined
    // We will do this indefinitely until eventually the player accepts a match or leaves the page
    const checkInterval = window.setInterval(() => {
      // We have switched pages
      if (getCurrentPageType() !== PageType.LiveQueue) {
        window.clearInterval(checkInterval);
        playThemeSong();
        return;
      }

      // If we are still in the CO select, play the CO Select music
      // Otherwise play whatever is currently set
      if (checkStillActiveFn()) playMusicURL(SpecialTheme.COSelect);
      else playThemeSong();
    }, 500);
  }, 500);
}

/**
 * The ID of the timeout that checks for new music files every minute.
 */
let setHashesTimeoutID: number | undefined;

let preloaded = false;

/**
 * Preloads all themes and audio files, plays the theme song, and checks for new music files every minute.
 */
function preloadThemes() {
  addThemeListeners();
  if (preloaded) return;
  preloaded = true;

  preloadAllCommonAudio(() => {
    logInfo("All common audio has been pre-loaded!");

    // Set dynamic settings based on the current game state
    // Lastly, update the UI to reflect the current settings
    musicSettings.themeType = getCurrentThemeType();
    getMusicPlayerUI().updateAllInputLabels();

    const ndxInURL = window.location.href.includes("&ndx=");
    if (!ndxInURL) {
      // We aren't opening in the middle of a replay, so just play based on the current game state
      playThemeSong();
      window.setTimeout(playThemeSong, 1000);
    } else {
      // We are refreshing with a replay open, wait until the replay finishes loading or 3 seconds pass to start the music
      // Pause any music and sounds until then, and update the music player internals to sync with the game state
      musicSettings.runWithoutSavingSettings(() => (musicSettings.isPlaying = false));
      new Promise<void>((resolve) => {
        const start = performance.now();
        const timeoutMs = 3000;

        function check() {
          if (isReplayActive() && deepEqual(Object.values(replay)[0].gameState.playersInfo, playersInfo)) {
            resolve();
          } else if (performance.now() - start >= timeoutMs) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        }

        check();
      }).then(() => {
        musicSettings.runWithoutSavingSettings(() => (musicSettings.isPlaying = true));
        musicSettings.themeType = getCurrentThemeType();
        playThemeSong();
      });
    }

    // Check for new music files every minute
    if (!setHashesTimeoutID) {
      const checkHashesMS = 1000 * 60 * 1;
      const checkHashesFn = () => {
        checkHashesInDB()
          .then(() => logInfo("All music files have been checked for updates."))
          .catch((reason) => logError("Could not check for music file updates:", reason));

        setHashesTimeoutID = window.setTimeout(checkHashesFn, checkHashesMS);
      };
      checkHashesFn();
    }
    // TODO:
    getMusicPlayerUI().checkIfNewVersionAvailable();
    // musicPlayerVue.$emit("initialize");

    //window.setTimeout(() => {
    //  preloadAllAudio(() => {
    //    logInfo("All other audio has been pre-loaded!");
    //  });
    //}, 5000);
  });
}
let lastCursorCall = Date.now();

/**
 * Initializes the music player script by setting everything up.
 */
export function initializeMusicPlayer() {
  const currentPageType = getCurrentPageType();
  // logInfo("Initializing music player for page type:", currentPageType);

  // Override the saved setting for autoplay if we are on a different page than an active game page
  if (currentPageType !== PageType.ActiveGame) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;

  switch (currentPageType) {
    case PageType.LiveQueue:
      onLiveQueue();
      break;
    case PageType.Maintenance:
      // TODO
      getMusicPlayerUI().openContextMenu();
      break;
    case PageType.MovePlanner:
      musicSettings.isPlaying = true;
      break;
  }
  preloadThemes();
  initializeMusicPlayerUI();
  allowSettingsToBeSaved();
  // musicPlayerUI.$emit("initialize");
  addHandlers();

  const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
  iframe?.addEventListener("focus", () => {
    if (musicSettings.isPlaying && !document.hidden) playThemeSong();
  });

  window.addEventListener("focus", () => {
    if (musicSettings.isPlaying && !document.hidden) playThemeSong();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopThemeSong();
      return;
    }
    if (musicSettings.isPlaying) playThemeSong();
  });

  broadcastChannel.onmessage = (ev) => {
    logDebug("Received message from another tab:", ev.data);
    if (ev.data === "pause") stopThemeSong();
    else if (ev.data === "play") playThemeSong();
  };

  const fn = (_e: Event) => {
    const timeSinceLastCursorCall = Date.now() - lastCursorCall;
    if (!musicSettings.sfxOnOtherPages) return;
    if (timeSinceLastCursorCall < 80) return;
    playSFX(GameSFX.uiMenuMove);
    lastCursorCall = Date.now();
  };

  const addSFXToPage = () => {
    getCurrentDocument()
      .querySelectorAll("a")
      .forEach((link) =>
        link.addEventListener("click", () => {
          if (!musicSettings.sfxOnOtherPages) return;
          playSFX(GameSFX.uiMenuOpen);
        }),
      );

    const hoverElements = Array.from(
      getCurrentDocument().querySelectorAll("li, ul, .dropdown-menu, .co_portrait, a, input, button"),
    );
    hoverElements.forEach((menu) => menu.addEventListener("mouseenter", fn));
  };
  addSFXToPage();

  let overDiv = document.querySelector("#overDiv") as HTMLElement;
  if (!overDiv) {
    overDiv = document.createElement("div");
    overDiv.id = "overDiv";
    overDiv.style.visibility = "hidden";
    overDiv.style.position = "absolute";
    overDiv.style.zIndex = "2000";
    document.appendChild(overDiv);
  }

  const overDivObserver = new MutationObserver(() => {
    if (overDiv.style.visibility === "visible") addSFXToPage();
  });
  overDivObserver.observe(overDiv, { attributes: true });
}

/**
 * Whether the autoplay settings have been checked already.
 */
let autoplayChecked = false;

let autoplayIntervalID: number | undefined;

export function checkAutoplayThenInitialize() {
  logDebug("Checking if we can autoplay then initializing the music player.");
  if (autoplayChecked) {
    initializeMusicPlayer();
    return;
  }
  autoplayChecked = true;

  const ifCanAutoplay = () => {
    initializeMusicPlayer();
  };

  const ifCannotAutoplay = () => {
    const initfn = () => {
      if (autoplayIntervalID) window.clearInterval(autoplayIntervalID);
      initializeMusicPlayer();
    };
    getMusicPlayerUI().addEventListener("click", initfn, { once: true });
    document.querySelector("body")?.addEventListener("click", initfn, { once: true });
  };

  const checkAutoplay = () => {
    if (document.hidden) return;
    if (autoplayIntervalID) window.clearInterval(autoplayIntervalID);
    canAutoplay
      .audio()
      .then((response: CheckResponse) => {
        const result = response.result;
        logDebug("Script starting, does your browser allow you to auto-play:", result);

        if (result) {
          ifCanAutoplay();
        } else ifCannotAutoplay();
      })
      .catch((reason) => {
        logDebug("Script starting, could not check your browser allows auto-play so assuming no: ", reason);
        ifCannotAutoplay();
      });
  };

  if (document.hidden) autoplayIntervalID = window.setInterval(checkAutoplay, 1000);
  else checkAutoplay();
}

/**
 * Main function that begins the script.
 */
async function main() {
  // Only run the script if we are the top window and not inside the iframe
  // Also only run the script if we are on a .php page
  if (self !== top) return;

  const isMainPage = getCurrentPageType() === PageType.MainPage;
  if (!isMainPage && !window.location.href.includes(".php")) return;

  // Only run the music player if we find a working BASE_URL
  logInfo("Trying different websites to fetch music data from");
  const possibleBaseURL = await getWorkingBaseURL();
  if (!possibleBaseURL) {
    logError("Could not load data from any URL, stopping music player. Possibly ISP blocked?");
    return;
  }
  logInfo("Using", possibleBaseURL, "double-checking...", getNeutralImgURL());

  // Create UI
  getMusicPlayerUI();

  // Load settings from local storage but don't allow saving yet
  loadSettingsFromLocalStorage();

  // Open the database for caching music files first
  // No matter what happens, we will initialize the music player
  logInfo("Opening database to cache music files.");
  openDB()
    .then(() => logInfo("Database opened successfully. Ready to cache music files."))
    .catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`))
    .finally(() => {
      // Always run maintenance pages without iframes
      if (getCurrentPageType() === PageType.Maintenance) {
        checkAutoplayThenInitialize();

        // The site is currently down for daily maintenance. Please try again in 2m 24s.
        // const el = document.createElement("div"); el.id = "server-maintenance-alert"; el.textContent = "The site is currently down for daily maintenance. Please try again in 12m 24s."; document.body.appendChild(el);
        const startTime = Date.now();
        const maintenanceDiv = document.querySelector("#server-maintenance-alert") as HTMLDivElement;
        if (!maintenanceDiv) return;
        const currentText = maintenanceDiv.textContent;
        const minutesStr = currentText?.match(/\d+m/)?.[0].replace("m", "");
        const secondsStr = currentText?.match(/\d+s/)?.[0].replace("s", "");

        if (!minutesStr || !secondsStr) return;
        const minutes = parseInt(minutesStr);
        const totalSeconds = parseInt(secondsStr) + minutes * 60;

        const ID = window.setInterval(() => {
          const elapsedMS = Date.now() - startTime;
          const elapsedSeconds = elapsedMS / 1000;
          const secondsLeft = totalSeconds - elapsedSeconds;

          const displayMinutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
          const displaySeconds = String(Math.floor(secondsLeft % 60)).padStart(2, "0");
          const displayMS = String(Math.floor((secondsLeft % 1) * 1000)).padStart(3, "0");

          maintenanceDiv.innerHTML = `The site is currently down for daily maintenance. Please try again in ${displayMinutes}m ${displaySeconds}s ${displayMS}ms. <br> This automatic message is brought to you by the AWBW Improved Music Player.`;
          maintenanceDiv.style.fontFamily = "Chivo Mono, monospace";
          maintenanceDiv.style.fontSize = "16";

          if (secondsLeft <= 0) {
            window.clearInterval(ID);
            maintenanceDiv.textContent = "The site is back up! Please refresh the page to continue.";
            window.location.reload();
          }
        }, 1);
        return;
      }

      initializeIFrame(checkAutoplayThenInitialize);
    });
}

/******************************************************************
 * SCRIPT ENTRY
 ******************************************************************/
main();
