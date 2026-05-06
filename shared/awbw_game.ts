/**
 * @file Constants, functions, and variables related to the game state in Advance Wars By Web.
 *  A lot of useful information came from game.js and the code at the bottom of each game page.
 */
import { getCurrentDocument } from "../music_player/iframe";
import { areAnimationsEnabled } from "./awbw_globals";
import { getReplayControls, getConnectionErrorDiv, PageType, getCurrentPageType } from "./awbw_page";

/**
 * Enumeration of all special CO names that have special themes.
 * Note: Must be lowercase as all other CO names are stored in lowercase.
 * @enum {string}
 */

export const enum SpecialCOs {
  Maintenance = "maintenance",
  MapEditor = "map-editor",
  MainPage = "main-page",
  LiveQueue = "live-queue",
  Default = "default",

  Victory = "victory",
  Defeat = "defeat",
  COSelect = "co-select",
  ModeSelect = "mode-select",
}

/**
 * Enum for the different states a CO Power can be in.
 * @enum {string}
 */
export enum COPowerEnum {
  NoPower = "N",
  COPower = "Y",
  SuperCOPower = "S",
}

/**
 * The amount of time between the silo launch animation and the hit animation in milliseconds.
 * Copied from game.js
 */
export const siloDelayMS = areAnimationsEnabled() ? 3000 : 0;

/**
 * The amount of time between an attack animation starting and the attack finishing in milliseconds.
 * Copied from game.js
 */
export const attackDelayMS = areAnimationsEnabled() ? 1000 : 0;

/**
 * Gets the username of the person logged in to the website.
 */
export function getMyUsername() {
  const document = getCurrentDocument();
  const profileMenu = document.querySelector("#profile-menu");
  if (!profileMenu) return null;
  const link = profileMenu.getElementsByClassName("dropdown-menu-link")[0] as HTMLAnchorElement;
  return link.href.split("username=")[1];
}

/**
 * The player ID for the person logged in to the website.
 * Singleton set and returned by {@link getMyID}
 */
let myID: number = -1;

/**
 * Gets the ID of the person logged in to the website.
 * @returns - The player ID of the person logged in to the website.
 */
export function getMyID() {
  if (getCurrentPageType() !== PageType.ActiveGame) return -1;
  if (myID < 0) {
    getAllPlayersInfo().forEach((entry) => {
      if (entry.users_username === getMyUsername()) {
        myID = entry.players_id;
      }
    });
  }
  return myID;
}

/**
 * Gets the player info data for the given user ID or null if the user ID is not part of the game.
 * @param pid - Player ID whose info we will get.
 * @returns - The info for that given player or null if such ID is not present in the game.
 */
export function getPlayerInfo(pid: number): PlayerInfo | null {
  if (getCurrentPageType() !== PageType.ActiveGame) return null;
  if (typeof playersInfo === "undefined") return null;
  return playersInfo[pid];
}

/**
 * Gets a list of all the player info data for all players in the current game.
 * @returns - List of player info data for all players in the current game.
 */
export function getAllPlayersInfo() {
  if (getCurrentPageType() !== PageType.ActiveGame) return [];
  if (typeof playersInfo === "undefined") return [];
  return Object.values(playersInfo);
}

/**
 * Determines if the given player is a spectator based on their ID.
 * @param pid - Player ID who we want to check.
 * @returns True if the player is a spectator, false if they are playing in this game.
 */
export function isPlayerSpectator(pid: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  if (typeof playerKeys === "undefined") return false;
  return !playerKeys.includes(pid);
}

/**
 * Checks if the given player is able to activate a regular CO Power.
 * @param pid - Player ID for whom we want to check.
 * @returns - True if the player can activate a regular CO Power.
 */
export function canPlayerActivateCOPower(pid: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  const info = getPlayerInfo(pid);
  if (!info) return false;
  return info.players_co_power >= info.players_co_max_power;
}

/**
 * Checks if the given player is able to activate a Super CO Power.
 * @param pid - Player ID for whom we want to check.
 * @returns - True if the player can activate a Super CO Power.
 */
export function canPlayerActivateSuperCOPower(pid: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  const info = getPlayerInfo(pid);
  if (!info) return false;
  return info.players_co_power >= info.players_co_max_spower;
}

/**
 * Determines if there is a building at the given coordinates.
 * @param x - X coordinate to check.
 * @param y - Y coordinate to check.
 * @returns - True if there is a building at the given coordinates.
 */
export function isValidBuilding(x: number, y: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  if (typeof buildingsInfo === "undefined") return false;
  return buildingsInfo[x] && buildingsInfo[x][y];
}

/**
 * Gets the internal info object for the given building.
 * @param x - X coordinate of the building.
 * @param y - Y coordinate of the building.
 * @returns - The info for that building at its current state.
 */
export function getBuildingInfo(x: number, y: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return null;
  if (typeof buildingsInfo === "undefined") return null;
  return buildingsInfo[x][y];
}

/**
 * Gets the data of the current building or unit clicked by the user if any.
 * @returns - Data of the current building or unit clicked by the user.
 */
export function getCurrentClickData() {
  if (getCurrentPageType() !== PageType.ActiveGame) return null;
  if (typeof currentClick === "undefined") return null;
  if (!currentClick) return null;
  return currentClick;
}

/**
 * Checks if we are currently in replay mode.
 * @returns - True if we are in replay mode.
 */
export function isReplayActive() {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  // Check if replay mode is open by checking if the replay section is set to display
  const replayControls = getReplayControls();

  if (!replayControls) return false;
  const replayOpen = replayControls.style.display !== "none";
  return replayOpen && Object.keys(replay).length > 0;
}

/**
 * Checks if the game has ended.
 * @returns - True if the game has ended.
 */
export function hasGameEnded() {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  // Count how many players are still in the game
  if (typeof playersInfo === "undefined") return false;
  const numberOfRemainingPlayers = Object.values(playersInfo).filter((info) => info.players_eliminated === "N").length;
  return numberOfRemainingPlayers <= 1;
}

export function getCOImagePrefix() {
  if (typeof coTheme === "undefined") return "aw2";
  return coTheme;
}

export function getServerTimeZone() {
  if (getCurrentPageType() !== PageType.ActiveGame) return "-05:00";
  if (typeof serverTimezone === "undefined") return "-05:00";
  if (!serverTimezone) return "-05:00";

  return serverTimezone;
}

export function didGameEndToday() {
  if (!hasGameEnded()) return false;
  const serverTimezone = parseInt(getServerTimeZone());

  // In server time
  const endDate = new Date(gameEndDate);
  endDate.setHours(23, 59, 59);

  // Convert now to the server timezone
  // https://stackoverflow.com/questions/68500998/converting-to-local-time-using-utc-time-zone-format-in-javascript
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() / 60;

  const difference = +serverTimezone + timezoneOffset;
  const nowAdjustedToServer = new Date(now.getTime() + difference * 3600000);
  const endDateAdjustedToServer = new Date(endDate.getTime() + difference * 3600000);

  // Check if more than X hours have passed since the game ended
  const oneDayMilliseconds = 24 * 60 * 60 * 1000; // X hours in milliseconds
  // logDebug(nowAdjustedToServer.getTime() - endDate.getTime(), oneDayMilliseconds);
  return nowAdjustedToServer.getTime() - endDateAdjustedToServer.getTime() < oneDayMilliseconds;
}

/**
 * Gets the current day in the game, also works properly in replay mode.
 * In the map editor, we consider it to be day 1.
 * @returns - The current day in the game.
 */
export function getCurrentGameDay() {
  if (getCurrentPageType() !== PageType.ActiveGame) return 1;
  if (typeof gameDay === "undefined") return 1;

  if (!isReplayActive()) return gameDay;

  const replayData = Object.values(replay);
  if (replayData.length === 0) return gameDay;

  const lastData = replayData[replayData.length - 1];
  if (typeof lastData === "undefined") return gameDay;
  if (typeof lastData.day === "undefined") return gameDay;

  return lastData.day;
}

/**
 * Useful variables related to the player currently playing this turn.
 */
export abstract class currentPlayer {
  /**
   * Get the internal info object containing the state of the current player.
   */
  static get info(): PlayerInfo | null {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof currentTurn === "undefined") return null;
    return getPlayerInfo(currentTurn);
  }

  /**
   * Determine whether a CO Power or Super CO Power is activated for the current player.
   * @returns - True if a regular CO power or a Super CO Power is activated.
   */
  static get isPowerActivated() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    return this?.coPowerState !== COPowerEnum.NoPower;
  }

  /**
   * Gets state of the CO Power for the current player represented as a single letter.
   * @returns - The state of the CO Power for the current player.
   */
  static get coPowerState() {
    if (getCurrentPageType() !== PageType.ActiveGame) return COPowerEnum.NoPower;
    return this.info?.players_co_power_on;
  }

  /**
   * Determine if the current player has been eliminated from the game.
   * @returns - True if the current player has been eliminated.
   */
  static get isEliminated() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    return this.info?.players_eliminated === "Y";
  }

  /**
   * Gets the name of the CO for the current player.
   * If the game has ended, it will return "victory" or "defeat".
   * If we are in the map editor, it will return "map-editor".
   * @returns - The name of the CO for the current player.
   */
  static get coName() {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;

    const myID = getMyID();
    const myInfo = getPlayerInfo(myID);
    const myWin = myInfo?.players_eliminated === "N";
    const myLoss = myInfo?.players_eliminated === "Y";
    const endedToday = didGameEndToday();
    const isSpectator = isPlayerSpectator(myID);
    const isDraw =
      hasGameEnded() && Object.values(playersInfo).filter((info) => info.players_eliminated === "N").length === 0;
    const endGameTheme = isSpectator || myWin || isDraw ? SpecialCOs.Victory : SpecialCOs.Defeat;

    // Play victory/defeat themes after the game ends for everyone

    if (hasGameEnded()) {
      // We were watching or playing a game that just ended or ended today
      if (endedToday) return endGameTheme;

      // The game ended more than a day ago and we just opened it or closed the replay
      if (!isReplayActive()) return SpecialCOs.COSelect;

      // The game ended more than a day ago and we are watching the replay
      return endGameTheme;
    }

    // The game has not ended, but we already lost
    if (myLoss) return SpecialCOs.Defeat;

    // The game has not ended
    return this.info?.co_name;
  }
}

/**
 * Determine who all the COs of the game are and return a list of their names.
 * @returns - List with the names of each CO in the game.
 */
export function getAllPlayingCONames(): Set<string> {
  if (getCurrentPageType() === PageType.MapEditor) return new Set(["map-editor"]);
  if (getCurrentPageType() !== PageType.ActiveGame) return new Set();
  const allPlayers = new Set(getAllPlayersInfo().map((info) => info.co_name));
  const allTagPlayers = getAllTagCONames();
  return new Set([...allPlayers, ...allTagPlayers]);
}

/**
 * Checks if the game is a tag game with 2 COs per team.
 * @returns - True if the game is a tag game.
 */
export function isTagGame() {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  return typeof tagsInfo !== "undefined" && tagsInfo;
}

/**
 * If the game is a tag game, get the names of all secondary COs that are part of the tags.
 * @returns - Set with the names of each secondary CO in the tag.
 */
export function getAllTagCONames(): Set<string> {
  if (getCurrentPageType() !== PageType.ActiveGame || !isTagGame()) return new Set();
  if (typeof tagsInfo === "undefined") return new Set();
  return new Set(Object.values(tagsInfo).map((tag) => tag.co_name));
}

/**
 * Gets the internal info object for the given unit.
 * @param unitId - ID of the unit for whom we want to get the current info state.
 * @returns - The info for that unit at its current state.
 */
export function getUnitInfo(unitId: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return null;
  if (typeof unitsInfo === "undefined") return null;
  return unitsInfo[unitId];
}

/**
 * Gets the name of the given unit or null if the given unit is invalid.
 * @param unitId - ID of the unit for whom we want to get the name.
 * @returns - Name of the unit.
 */
export function getUnitName(unitId: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return null;
  return getUnitInfo(unitId)?.units_name;
}

/**
 * Try to get the unit info for the unit at the given coordinates, if any.
 * @param x - X coordinate to get the unit info from.
 * @param y - Y coordinate to get the unit info from.
 * @returns - The info for the unit at the given coordinates or null if there is no unit there.
 */
export function getUnitInfoFromCoords(x: number, y: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return null;
  if (typeof unitsInfo === "undefined") return null;
  return Object.values(unitsInfo)
    .filter((info) => info.units_x == x && info.units_y == y)
    .pop();
}

/**
 * Checks if the given unit is a valid unit.
 * A unit is valid when we can find its info in the current game state.
 * @param unitId - ID of the unit we want to check.
 * @returns - True if the given unit is valid.
 */
export function isValidUnit(unitId: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  if (typeof unitsInfo === "undefined") return false;
  return unitId !== undefined && unitsInfo[unitId] !== undefined;
}

/**
 * Checks if the given unit has moved this turn.
 * @param unitId - ID of the unit we want to check.
 * @returns - True if the unit is valid and it has moved this turn.
 */
export function hasUnitMovedThisTurn(unitId: number) {
  if (getCurrentPageType() !== PageType.ActiveGame) return false;
  return isValidUnit(unitId) && getUnitInfo(unitId)?.units_moved === 1;
}

export function addConnectionErrorObserver(onConnectionError: (closeMsg: string) => void) {
  const connectionErrorDiv = getConnectionErrorDiv();
  if (!connectionErrorDiv) return;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type !== "childList") return;
      if (!mutation.target) return;
      if (!mutation.target.textContent) return;

      const closeMsg = mutation.target.textContent;
      onConnectionError(closeMsg);
    }
  });
  observer.observe(connectionErrorDiv, { childList: true });
}
