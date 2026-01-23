/**
 * @file This file contains all the AWBW website handlers that will intercept clicks and any relevant functions of the website.
 */
import {
  canPlayerActivateSuperCOPower,
  canPlayerActivateCOPower,
  getMyID,
  isPlayerSpectator,
  siloDelayMS,
  attackDelayMS,
  isValidUnit,
  getUnitName,
  getUnitInfoFromCoords,
  COPowerEnum,
  isReplayActive,
  getUnitInfo,
  hasUnitMovedThisTurn,
  addConnectionErrorObserver,
  hasGameEnded,
} from "../shared/awbw_game";
import {
  addUpdateCursorObserver,
  getAllDamageSquares,
  getReplayBackwardActionBtn,
  getReplayBackwardBtn,
  getReplayCloseBtn,
  getReplayForwardActionBtn,
  getReplayForwardBtn,
  getReplayOpenBtn,
  getCurrentPageType,
  PageType,
} from "../shared/awbw_page";

import { areAnimationsEnabled } from "../shared/awbw_globals";

import { getCurrentThemeType, musicSettings, GameType, ThemeType, RandomThemeType } from "./music_settings";
import { GameSFX } from "./resources";
import {
  getAnimExplosionFn,
  getAnimUnitFn,
  getAttackSeamFn,
  getBuildFn,
  getCaptFn,
  getCloseMenuFn,
  getCreateDamageSquaresFn,
  getEliminationFn,
  getFireFn,
  getFogFn,
  getGameOverFn,
  getHideFn,
  getJoinFn,
  getLaunchFn,
  getLoadFn,
  getMoveFn,
  getNextTurnFn,
  getOpenMenuFn,
  getPowerFn,
  getQueryTurnFn,
  getRepairFn,
  getResignFn,
  getShowEndGameScreenFn,
  getShowEventScreenFn,
  getSupplyFn,
  getUnhideFn,
  getUnitClickFn,
  getUnloadFn,
  getWaitFn,
} from "../shared/awbw_handlers";
import {
  clearThemeDelay,
  playThemeSong,
  restartTheme,
  specialIntroMap,
  specialPreloopMap,
  stopThemeSong,
} from "./music/co_themes";
import { playSFX, stopSFX } from "./music/sound_effects";
import { stopAllMovementSounds, stopMovementSound, playMovementSound } from "./music/unit_movement";
import { getCurrentDocument } from "./iframe";

/**
 * How long to wait in milliseconds before we register a cursor movement.
 * Used to prevent overwhelming the user with too many cursor movement sound effects.
 * @constant
 */
const CURSOR_THRESHOLD_MS = 25;

/**
 * Date representing when we last moved the game cursor.
 */
let lastCursorCall = Date.now();

/**
 * The last known X coordinate of the cursor.
 */
let lastCursorX = -1;

/**
 * The last known Y coordinate of the cursor.
 */
let lastCursorY = -1;

/**
 * Enum representing the type of menu that is currently open, if any.
 * @enum {string}
 */
export enum MenuOpenType {
  None = "None",
  DamageSquare = "DamageSquare",
  Regular = "Regular",
  UnitSelect = "UnitSelect",
}

/**
 * The current type of menu that is open, if any.
 */
let currentMenuType = MenuOpenType.None;

export function changeCurrentMenuType(next: MenuOpenType) {
  currentMenuType = next;
}

/**
 * Map of unit IDs to their visibility status. Used to check if a unit that was visible disappeared in the fog.
 */
const visibilityMap: Map<number, boolean> = new Map();

/**
 * Map of unit IDs to their movement responses. Used to check if a unit got trapped.
 */
const movementResponseMap: Map<number, MoveResponse> = new Map();

/**
 * Map of damage squares that have been clicked.
 * Used to check if the user clicked on a damage square twice to finalize an attack.
 */
const clickedDamageSquaresMap: Map<HTMLSpanElement, boolean> = new Map();

// Replay handlers
const ahQueryTurn = getQueryTurnFn();

// Game handlers
const ahShowEventScreen = getShowEventScreenFn();
const ahShowEndGameScreen = getShowEndGameScreenFn();
const ahOpenMenu = getOpenMenuFn();
const ahCloseMenu = getCloseMenuFn();
const ahCreateDamageSquares = getCreateDamageSquaresFn();
const ahUnitClick = getUnitClickFn();
const ahWait = getWaitFn();
const ahAnimUnit = getAnimUnitFn();
const ahAnimExplosion = getAnimExplosionFn();
const ahFog = getFogFn();
const ahFire = getFireFn();
const ahAttackSeam = getAttackSeamFn();
const ahMove = getMoveFn();
const ahCapt = getCaptFn();
const ahBuild = getBuildFn();
const ahLoad = getLoadFn();
const ahUnload = getUnloadFn();
const ahSupply = getSupplyFn();
const ahRepair = getRepairFn();
const ahHide = getHideFn();
const ahUnhide = getUnhideFn();
const ahJoin = getJoinFn();
const ahLaunch = getLaunchFn();
const ahNextTurn = getNextTurnFn();
const ahElimination = getEliminationFn();
const ahPower = getPowerFn();
const ahGameOver = getGameOverFn();
const ahResign = getResignFn();

/**
 * Intercept functions and add our own handlers to the website.
 */
export function addHandlers() {
  const currentPageType = getCurrentPageType();
  if (currentPageType === PageType.Maintenance) return;

  // Global handlers
  addUpdateCursorObserver(onCursorMove);

  // Specific page handlers
  switch (currentPageType) {
    case PageType.ActiveGame:
      addReplayHandlers();
      addGameHandlers();
      return;
    case PageType.MapEditor:
      addMapEditorHandlers();
      return;
    case PageType.MovePlanner:
      addMovePlannerHandlers();
      return;
  }
}

/**
 * Add all handlers that will intercept clicks and functions on the map editor.
 */
function addMapEditorHandlers() {}

/**
 * Add all handlers that will intercept clicks and functions when using the move planner.
 */
function addMovePlannerHandlers() {
  // getBuildMenu().addEventListener("click", (event) => {
  //   onOpenMenu(event.target as HTMLDivElement, 0, 0);
  // });
  // closeMenu = onCloseMenu;
}

/**
 * Syncs the music with the game state. Does not randomize the COs. You can spam this a little bit.
 */
function syncMusic() {
  const themeTypeBefore = musicSettings.themeType;
  musicSettings.themeType = getCurrentThemeType();

  playThemeSong();
  window.setTimeout(() => {
    musicSettings.themeType = getCurrentThemeType();
    playThemeSong();
  }, 500);

  window.setTimeout(() => {
    musicSettings.themeType = getCurrentThemeType();
    if (themeTypeBefore !== ThemeType.REGULAR && musicSettings.themeType === ThemeType.REGULAR) {
      specialIntroMap.forEach((_introURL, loopURL) => {
        if (loopURL.includes("-cop")) specialIntroMap.delete(loopURL);
      });
    }
    playThemeSong();
  }, 750);
}

/**
 * Refreshes everything needed for the music when finishing a turn. Also randomizes the COs if needed.
 * Use this only for turn changes, not for music syncs.
 * @param playDelayMS - The delay in milliseconds before the theme song starts playing.
 */
function refreshMusicForNextTurn(playDelayMS = 0) {
  // It's a new turn, so we need to clear the visibility map, randomize COs, and play the theme song
  visibilityMap.clear();
  musicSettings.randomizeCO();
  musicSettings.themeType = getCurrentThemeType();

  const refreshMusic = () => {
    musicSettings.themeType = getCurrentThemeType();
    if (!musicSettings.seamlessLoopsInMirrors && !hasGameEnded()) restartTheme(); 
    if (musicSettings.playIntroEveryTurn) {
      specialIntroMap.clear();
    } else {
      specialIntroMap.forEach((_, url) => {
        if (url.includes("-cop")) {
          specialIntroMap.delete(url);
        }
      });
    }

    if (musicSettings.restartThemes) {
      specialPreloopMap.clear();
    }
    playThemeSong();
    window.setTimeout(playThemeSong, 350);
  };
  if (playDelayMS > 0) window.setTimeout(refreshMusic, playDelayMS);
  else refreshMusic();
}

/**
 * Add all handlers that will intercept clicks and functions when watching a replay.
 */
function addReplayHandlers() {
  queryTurn = onQueryTurn;

  const replayForwardActionBtn = getReplayForwardActionBtn();
  const replayBackwardActionBtn = getReplayBackwardActionBtn();
  const replayForwardBtn = getReplayForwardBtn();
  const replayBackwardBtn = getReplayBackwardBtn();
  const replayOpenBtn = getReplayOpenBtn();
  const replayCloseBtn = getReplayCloseBtn();

  window.addEventListener("keydown", function (event) {
    if (!event.key) return;
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
      syncMusic();
    }
  });

  // Stop all movement sounds when we go backwards on action, open a replay, or close a replay
  replayBackwardActionBtn.addEventListener("click", stopAllMovementSounds);
  replayOpenBtn.addEventListener("click", stopAllMovementSounds);
  replayCloseBtn.addEventListener("click", stopAllMovementSounds);

  // Remove theme pauses when the user is going through a replay
  replayForwardBtn.addEventListener("click", clearThemeDelay);
  replayBackwardActionBtn.addEventListener("click", clearThemeDelay);
  replayBackwardBtn.addEventListener("click", clearThemeDelay);

  // Remove extra sound effects if we are moving through the replay quickly
  const stopExtraSFX = () => {
    stopSFX(GameSFX.powerActivateAW1COP);
    // stopSFX(GameSFX.powerActivateAllyCOP);
    // stopSFX(GameSFX.powerActivateAllySCOP);
    // stopSFX(GameSFX.powerActivateBHCOP);
    // stopSFX(GameSFX.powerActivateBHSCOP);
  };
  replayBackwardActionBtn.addEventListener("click", stopExtraSFX);
  replayForwardBtn.addEventListener("click", stopExtraSFX);
  replayBackwardBtn.addEventListener("click", stopExtraSFX);
  replayCloseBtn.addEventListener("click", stopExtraSFX);

  // onQueryTurn isn't called when closing the replay viewer, so change the music for the turn change here
  // replayCloseBtn.addEventListener("click", () => refreshMusicForNextTurn(500));
  // replayForwardBtn.addEventListener("click", () => refreshMusicForNextTurn(500));
  // replayBackwardBtn.addEventListener("click", () => refreshMusicForNextTurn(500));

  // Keep the music in sync, we do not need to handle turn changes because onQueryTurn will handle that
  replayBackwardActionBtn.addEventListener("click", syncMusic);
  replayForwardActionBtn.addEventListener("click", syncMusic);
  replayForwardBtn.addEventListener("click", syncMusic);
  replayBackwardBtn.addEventListener("click", syncMusic);
  replayCloseBtn.addEventListener("click", syncMusic);
  replayOpenBtn.addEventListener("click", syncMusic);
}

/**
 * Add all handlers that will intercept clicks and functions during a game.
 */
function addGameHandlers() {
  // updateCursor = onCursorMove
  showEventScreen = onShowEventScreen;
  showEndGameScreen = onShowEndGameScreen;
  openMenu = onOpenMenu;
  closeMenu = onCloseMenu;
  createDamageSquares = onCreateDamageSquares;
  unitClickHandler = onUnitClick;
  waitUnit = onUnitWait;
  animUnit = onAnimUnit;
  animExplosion = onAnimExplosion;
  updateAirUnitFogOnMove = onFogUpdate;

  actionHandlers.Fire = onFire;
  actionHandlers.AttackSeam = onAttackSeam;
  actionHandlers.Move = onMove;
  actionHandlers.Capt = onCapture;
  actionHandlers.Build = onBuild;
  actionHandlers.Load = onLoad;
  actionHandlers.Unload = onUnload;
  actionHandlers.Supply = onSupply;
  actionHandlers.Repair = onRepair;
  actionHandlers.Hide = onHide;
  actionHandlers.Unhide = onUnhide;
  actionHandlers.Join = onJoin;
  actionHandlers.Launch = onLaunch;
  actionHandlers.NextTurn = onNextTurn;
  actionHandlers.Elimination = onElimination;
  actionHandlers.Power = onPower;
  actionHandlers.GameOver = onGameOver;
  actionHandlers.Resign = onResign;

  addConnectionErrorObserver(onConnectionError);
}

function onCursorMove(cursorX: number, cursorY: number) {
  if (!musicSettings.isPlaying) return;
  // debug("Cursor Move", cursorX, cursorY);

  const dx = Math.abs(cursorX - lastCursorX);
  const dy = Math.abs(cursorY - lastCursorY);
  const cursorMoved = dx >= 1 || dy >= 1;
  const timeSinceLastCursorCall = Date.now() - lastCursorCall;

  // Don't play the sound if we moved the cursor too quickly
  if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;

  if (cursorMoved) {
    playSFX(GameSFX.uiCursorMove);
    lastCursorCall = Date.now();
  }
  lastCursorX = cursorX;
  lastCursorY = cursorY;
}

function onQueryTurn(
  gameId: number,
  turn: number,
  turnPId: number,
  turnDay: number,
  replay: ReplayObject[],
  initial: boolean,
) {
  const result = ahQueryTurn?.apply(ahQueryTurn, [gameId, turn, turnPId, turnDay, replay, initial]);
  if (!musicSettings.isPlaying) return result;
  // log("Query Turn", gameId, turn, turnPId, turnDay, replay, initial);

  // Check if replay is open, if not, don't restart music so it's not as jarring
  if (initial) {
    syncMusic();
  } else {
    refreshMusicForNextTurn(250);
  }
  return result;
}

function onShowEventScreen(event: ShowEventScreenData) {
  ahShowEventScreen?.apply(ahShowEventScreen, [event]);
  if (!musicSettings.isPlaying) return;
  // debug("Show Event Screen", event);

  if (hasGameEnded()) {
    refreshMusicForNextTurn();
    return;
  }

  playThemeSong();
  //window.setTimeout(playThemeSong, 500);
}

function onShowEndGameScreen(event: ShowEndGameScreenData) {
  ahShowEndGameScreen?.apply(ahShowEndGameScreen, [event]);
  if (!musicSettings.isPlaying) return;

  // debug("Show End Game Screen", event);
  refreshMusicForNextTurn();
}

function onOpenMenu(menu: HTMLDivElement, x: number, y: number) {
  ahOpenMenu?.apply(openMenu, [menu, x, y]);
  if (!musicSettings.isPlaying) return;
  // debug("Open Menu", menu, x, y);

  currentMenuType = MenuOpenType.Regular;
  playSFX(GameSFX.uiMenuOpen);

  const menuOptions = getCurrentDocument().getElementsByClassName("menu-option");
  for (let i = 0; i < menuOptions.length; i++) {
    menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
    menuOptions[i].addEventListener("click", (event) => {
      const target = event.target as HTMLDivElement;
      if (!target) return;

      // Check if we clicked on a unit we cannot buy
      if (
        target.classList.contains("forbidden") ||
        target.parentElement?.classList.contains("forbidden") ||
        target.parentElement?.parentElement?.classList.contains("forbidden") ||
        target.parentElement?.parentElement?.parentElement?.classList.contains("forbidden")
      ) {
        playSFX(GameSFX.uiInvalid);
        return;
      }
      currentMenuType = MenuOpenType.None;
      playSFX(GameSFX.uiMenuOpen);
    });
  }
}

function onCloseMenu() {
  ahCloseMenu?.apply(closeMenu, []);
  if (!musicSettings.isPlaying) return;

  const isMenuOpen = currentMenuType !== MenuOpenType.None;
  // debug("CloseMenu", currentMenuType, isMenuOpen);
  if (isMenuOpen) {
    playSFX(GameSFX.uiMenuClose);
    clickedDamageSquaresMap.clear();
    currentMenuType = MenuOpenType.None;
  }
}

function onCreateDamageSquares(
  attackerUnit: UnitInfo,
  unitsInRange: UnitInfo[],
  movementInfo: object,
  movingUnit: object,
) {
  ahCreateDamageSquares?.apply(createDamageSquares, [attackerUnit, unitsInRange, movementInfo, movingUnit]);
  if (!musicSettings.isPlaying) return;
  // debug("Create Damage Squares", attackerUnit, unitsInRange, movementInfo, movingUnit);

  // Hook up to all new damage squares
  for (const damageSquare of getAllDamageSquares()) {
    damageSquare.addEventListener("click", (event) => {
      if (!event.target) return;
      const targetSpan = event.target as HTMLSpanElement;
      playSFX(GameSFX.uiMenuOpen);

      // If we have clicked this before, then this click is to finalize the attack so no more open menu
      if (clickedDamageSquaresMap.has(targetSpan)) {
        currentMenuType = MenuOpenType.None;
        clickedDamageSquaresMap.clear();
        return;
      }
      // If we haven't clicked this before, then consider it like opening a menu
      currentMenuType = MenuOpenType.DamageSquare;
      clickedDamageSquaresMap.set(targetSpan, true);
    });
  }
}

function onUnitClick(clicked: UnitClickData) {
  ahUnitClick?.apply(unitClickHandler, [clicked]);
  if (!musicSettings.isPlaying) return;
  // debug("Unit Click", clicked);

  // Check if we clicked on a waited unit or an enemy unit, if so, no more actions can be taken
  const unitInfo = getUnitInfo(Number(clicked.id));
  if (!unitInfo) return;

  const myID = getMyID();
  const isUnitWaited = hasUnitMovedThisTurn(unitInfo.units_id);
  const isMyUnit = unitInfo?.units_players_id === myID;
  const isMyTurn = currentTurn === myID;
  const canActionsBeTaken = !isUnitWaited && isMyUnit && isMyTurn && !isReplayActive();

  // If action can be taken, then we can cancel out of that action
  currentMenuType = canActionsBeTaken ? MenuOpenType.UnitSelect : MenuOpenType.None;

  playSFX(GameSFX.uiUnitSelect);
}

function onUnitWait(unitId: number) {
  ahWait?.apply(waitUnit, [unitId]);
  if (!musicSettings.isPlaying) return;
  // debug("Wait", unitId, getUnitName(unitId));

  // Check if we stopped because we got trapped
  if (movementResponseMap.has(unitId)) {
    const response = movementResponseMap.get(unitId);
    if (response?.trapped) {
      playSFX(GameSFX.unitTrap);
    }
    stopMovementSound(unitId, !response?.trapped);
    movementResponseMap.delete(unitId);
    return;
  }
  stopMovementSound(unitId);
}

function onAnimUnit(
  path: PathInfo[],
  unitId: number,
  unitSpan: HTMLSpanElement,
  unitTeam: number,
  viewerTeam: number,
  i: number,
) {
  ahAnimUnit?.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
  if (!musicSettings.isPlaying) return;
  // debug("AnimUnit", path, unitId, unitSpan, unitTeam, viewerTeam, i);

  // Only check if valid
  if (!isValidUnit(unitId) || !path || !i) return;
  // Don't go outside the bounds of the path
  if (i >= path.length) return;
  // The unit disappeared already, no need to stop its sound again
  if (visibilityMap.has(unitId)) return;
  // A visible unit just disappeared
  const unitVisible = path[i].unit_visible;
  if (!unitVisible) {
    visibilityMap.set(unitId, unitVisible);
    // Stop the sound after a little delay, giving more time to react to it
    window.setTimeout(() => stopMovementSound(unitId, false), 1000);
  }
}

function onAnimExplosion(unit: UnitInfo) {
  ahAnimExplosion?.apply(animExplosion, [unit]);
  if (!musicSettings.isPlaying) return;
  // debug("Exploded", unit);

  const unitId = unit.units_id;
  const unitFuel = unit.units_fuel;
  let sfx = GameSFX.unitExplode;
  if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
    sfx = GameSFX.unitMissileHit;
  }
  playSFX(sfx);
  stopMovementSound(unitId, false);
}

function onFogUpdate(
  x: number,
  y: number,
  mType: object,
  neighbours: object[],
  unitVisible: boolean,
  change: string,
  delay: number,
) {
  ahFog?.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
  if (!musicSettings.isPlaying) return;
  // debug("Fog", x, y, mType, neighbours, unitVisible, change, delay);

  const unitInfo = getUnitInfoFromCoords(x, y);
  if (!unitInfo) return;
  if (change === "Add") {
    window.setTimeout(() => stopMovementSound(unitInfo.units_id, true), delay);
  }
}

function onFire(response: FireResponse) {
  if (!musicSettings.isPlaying) {
    ahFire?.apply(actionHandlers.Fire, [response]);
    return;
  }
  // debug("Fire", response);

  const attackerID = response.copValues.attacker.playerId;
  const defenderID = response.copValues.defender.playerId;
  // stopMovementSound(response.attacker.units_id, false);
  // stopMovementSound(response.defender.units_id, false);

  // Let the user hear a confirmation sound
  // if (currentPlayer.info.players_id == attackerID) {
  //   playSFX(gameSFX.uiMenuOpen);
  // }

  // Calculate charge before attack
  const couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
  const couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
  const couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
  const couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);

  // Let the attack proceed normally
  ahFire?.apply(actionHandlers.Fire, [response]);

  // Check if the attack gave enough charge for a power to either side
  // Give it a little bit of time for the animation if needed
  const delay = areAnimationsEnabled() ? 750 : 0;
  const canAttackerActivateSCOPAfter = canPlayerActivateSuperCOPower(attackerID);
  const canAttackerActivateCOPAfter = canPlayerActivateCOPower(attackerID);
  const canDefenderActivateSCOPAfter = canPlayerActivateSuperCOPower(defenderID);
  const canDefenderActivateCOPAfter = canPlayerActivateCOPower(defenderID);
  const madeSCOPAvailable =
    (!couldAttackerActivateSCOPBefore && canAttackerActivateSCOPAfter) ||
    (!couldDefenderActivateSCOPBefore && canDefenderActivateSCOPAfter);
  const madeCOPAvailable =
    (!couldAttackerActivateCOPBefore && canAttackerActivateCOPAfter) ||
    (!couldDefenderActivateCOPBefore && canDefenderActivateCOPAfter);

  window.setTimeout(() => {
    if (madeSCOPAvailable) playSFX(GameSFX.powerSCOPAvailable);
    else if (madeCOPAvailable) playSFX(GameSFX.powerCOPAvailable);
  }, delay);
}

function onAttackSeam(response: SeamResponse) {
  ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
  if (!musicSettings.isPlaying) return;
  // debug("AttackSeam", response);
  const seamWasDestroyed = response.seamHp <= 0;

  if (seamWasDestroyed) {
    playSFX(GameSFX.unitAttackPipeSeam);
    playSFX(GameSFX.unitExplode);
    return;
  }
  window.setTimeout(() => playSFX(GameSFX.unitAttackPipeSeam), attackDelayMS);
}

function onMove(response: MoveResponse, loadFlag: object) {
  ahMove?.apply(actionHandlers.Move, [response, loadFlag]);
  if (!musicSettings.isPlaying) return;
  // debug("Move", response, loadFlag);

  const unitId = response.unit.units_id;
  movementResponseMap.set(unitId, response);
  const movementDist = response.path.length;
  stopMovementSound(unitId, false);

  if (movementDist > 1) {
    playMovementSound(unitId);
  }
}

function onCapture(data: CaptureData) {
  ahCapt?.apply(actionHandlers.Capt, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Capt", data);

  // They didn't finish the capture
  const finishedCapture = data.newIncome != null;
  if (!finishedCapture) {
    playSFX(GameSFX.unitCaptureProgress);
    return;
  }
  // The unit is done capping this property
  const myID = getMyID();
  const isSpectator = isPlayerSpectator(myID);

  // Don't use triple equals blindly here because the types are different
  // buildings_team (string) == id (number)
  const isMyCapture = data.buildingInfo.buildings_team === myID.toString() || isSpectator;
  const sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
  playSFX(sfx);
}

function onBuild(data: BuildData) {
  ahBuild?.apply(actionHandlers.Build, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Build", data);

  const myID = getMyID();
  const isMyBuild = data.newUnit.units_players_id == myID;
  const isReplay = isReplayActive();
  if (!isMyBuild || isReplay) playSFX(GameSFX.unitSupply);
}

function onLoad(data: LoadData) {
  ahLoad?.apply(actionHandlers.Load, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Load", data);

  playSFX(GameSFX.unitLoad);
}

function onUnload(data: UnloadData) {
  ahUnload?.apply(actionHandlers.Unload, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Unload", data);

  playSFX(GameSFX.unitUnload);
}

function onSupply(data: SupplyData) {
  ahSupply?.apply(actionHandlers.Supply, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Supply", data);

  // We could play the sfx for each supplied unit in the list
  // but instead we decided to play the supply sound once.
  playSFX(GameSFX.unitSupply);
}

function onRepair(data: RepairData) {
  ahRepair?.apply(actionHandlers.Repair, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Repair", data);

  playSFX(GameSFX.unitSupply);
}

function onHide(data: HideData) {
  ahHide?.apply(actionHandlers.Hide, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Hide", data);
  playSFX(GameSFX.unitHide);

  stopMovementSound(data.unitId);
}

function onUnhide(data: UnhideData) {
  ahUnhide?.apply(actionHandlers.Unhide, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Unhide", data);

  playSFX(GameSFX.unitUnhide);
  stopMovementSound(data.unitId);
}

function onJoin(data: JoinData) {
  ahJoin?.apply(actionHandlers.Join, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Join", data);

  stopMovementSound(data.joinID);
  stopMovementSound(data.joinedUnit.units_id);
}

function onLaunch(data: LaunchData) {
  ahLaunch?.apply(actionHandlers.Launch, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Launch", data);

  playSFX(GameSFX.unitMissileSend);
  window.setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
}

function onNextTurn(data: NextTurnData) {
  ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("NextTurn", data);

  if (data.swapCos) {
    playSFX(GameSFX.tagSwap);
  }

  refreshMusicForNextTurn();
}

function onElimination(data: EliminationData) {
  ahElimination?.apply(actionHandlers.Elimination, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Elimination", data);

  // Play the elimination sound
  refreshMusicForNextTurn();
}

function onGameOver() {
  ahGameOver?.apply(actionHandlers.GameOver, []);
  if (!musicSettings.isPlaying) return;
  // debug("GameOver");

  refreshMusicForNextTurn();
}

function onResign(data: ResignData) {
  ahResign?.apply(actionHandlers.Resign, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Resign", data);

  refreshMusicForNextTurn();
}

function onPower(data: PowerData) {
  ahPower?.apply(actionHandlers.Power, [data]);
  if (!musicSettings.isPlaying) return;
  // debug("Power", data);

  // Remember, these are in title case with spaces like "Colin" or "Von Bolt"
  const coName = data.coName;
  const isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;

  // Stop the power charge SFX if they're playing
  stopSFX(GameSFX.powerCOPAvailable);
  stopSFX(GameSFX.powerSCOPAvailable);

  // Update the theme type
  musicSettings.themeType = isSuperCOPower ? ThemeType.SUPER_CO_POWER : ThemeType.CO_POWER;

  // If random themes are enabled, them randomly decide
  let gameType = musicSettings.gameType;
  if (musicSettings.randomThemesType === RandomThemeType.ALL_THEMES) {
    gameType = musicSettings.currentRandomGameType;
  }
  switch (gameType) {
    case GameType.AW1:
      // Advance Wars 1 will use the same sound for both CO and Super CO power activations
      playSFX(GameSFX.powerActivateAW1COP);
      stopThemeSong(4833);
      return;
  }
  // Colin's gold rush SFX for AW2, DS, and RBC
  if (coName === "Colin" && !isSuperCOPower) {
    window.setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
  }
}

function onConnectionError(closeMsg: string) {
  closeMsg = closeMsg.toLowerCase();
  if (closeMsg.includes("connected to another game")) stopThemeSong();
}
