<!-- <script lang="ts">
import { getCurrentPageType, PageType } from "../../shared/awbw_page";
import { getCurrentDocument } from "../iframe";

import Vue from "vue";
// import BootstrapVue from "bootstrap-vue";
// Vue.use(BootstrapVue);

export default Vue.extend({
  name: "MusicPlayer",
  data() {
    return {};
  },
  methods: {
    initialize() {
      this.add_to_awbw();
    },
    add_to_awbw() {
      const menu = get_awbw_menu();
      if (menu) menu.appendChild(this.$el);
    },
  },
  mounted() {
    this.add_to_awbw();
  },
});

function get_awbw_menu() {
  const doc = getCurrentDocument();

  switch (getCurrentPageType()) {
    case PageType.Maintenance:
      return doc.querySelector("#main");
    case PageType.MapEditor:
      return doc.querySelector("#replay-misc-controls");
    case PageType.MovePlanner:
      return doc.querySelector("#map-controls-container");
    case PageType.ActiveGame:
      return doc.querySelector("#game-map-menu")?.parentNode;
    // case PageType.LiveQueue:
    // case PageType.MainPage:
    default:
      return doc.querySelector("#nav-options");
  }
}
</script>

<!-- <template>
  <div
    class="game-tools-btn"
    id="music_player_parent"
    style="width: 34px; height: 30px; border: none; background-color: rgba(0, 0, 0, 0)"
  >
    <span class="game-tools-btn-text small_text" id="music_player_hover" style="display: none"></span>
    <div class="game-tools-bg" id="music_player_background" style="">
      <a class="norm2"><img src="https://josegperez.com/img/music-player-icon.png" id="music_player_button-image" /></a>
    </div>
    <div class="cls-settings-menu" id="music_player_settings" style="z-index: 30; display: none">
      <div class="cls-horizontal-box">
        <div class="cls-settings-menu-box" id="music_player_settings-left" style="display: flex">
          <div class="cls-vertical-box cls-group-box">
            <label>Music Volume: 17%</label
            ><input
              id="music_player-music-volume"
              type="range"
              min="0"
              max="1"
              step="0.005"
              title="Adjust the volume of the CO theme music, power activations, and power themes."
            />
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>SFX Volume: 66%</label
            ><input
              id="music_player-sfx-volume"
              type="range"
              min="0"
              max="1"
              step="0.005"
              title="Adjust the volume of the unit movement, tag swap, captures, and other unit sounds."
            />
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>UI Volume: 70%</label
            ><input
              id="music_player-ui-volume"
              type="range"
              min="0"
              max="1"
              step="0.005"
              title="Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units."
            />
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>Soundtrack</label>
            <div id="music_player-soundtrack" class="cls-horizontal-box">
              <div
                class="cls-vertical-box"
                title="Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!"
              >
                <label><input type="radio" name="Soundtrack" />AW1</label>
              </div>
              <div class="cls-vertical-box" title="Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.">
                <label><input type="radio" name="Soundtrack" />AW2</label>
              </div>
              <div
                class="cls-vertical-box"
                title="Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!"
              >
                <label><input type="radio" name="Soundtrack" />RBC</label>
              </div>
              <div
                class="cls-vertical-box"
                title="Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though."
              >
                <label><input type="radio" name="Soundtrack" />DS</label>
              </div>
            </div>
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>Random Themes</label>
            <div id="music_player-random-themes" class="cls-horizontal-box">
              <div class="cls-vertical-box" title="Play the music depending on who the current CO is.">
                <label><input type="radio" name="Random Themes" />Off</label>
              </div>
              <div class="cls-vertical-box" title="Play random music every turn from all soundtracks.">
                <label><input type="radio" name="Random Themes" />All Soundtracks</label>
              </div>
              <div class="cls-vertical-box" title="Play random music every turn from the current soundtrack.">
                <label><input type="radio" name="Random Themes" />Current Soundtrack</label>
              </div>
              <div class="cls-vertical-box" title="Changes the current theme to a new random one.">
                <button type="button" name="Random Themes" disabled="false">Shuffle</button>
              </div>
            </div>
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>Sound Effect (SFX) Options</label>
            <div id="music_player-sound-effect-(sfx)-options" class="cls-vertical-box">
              <div
                class="cls-horizontal-box"
                title="Play sound effects on other pages like 'Your Games', 'Profile', or during maintenance."
              >
                <label
                  ><input type="checkbox" name="Sound Effect (SFX) Options" />Play Sound Effects Outside Of Game
                  Pages</label
                >
              </div>
              <div
                class="cls-horizontal-box"
                title="Play a sound effect when a unit makes progress capturing a property."
              >
                <label><input type="checkbox" name="Sound Effect (SFX) Options" />Capture Progress SFX</label>
              </div>
              <div class="cls-horizontal-box" title="Play a sound effect when a pipe seam is attacked.">
                <label><input type="checkbox" name="Sound Effect (SFX) Options" />Pipe Seam Attack SFX</label>
              </div>
            </div>
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>Music Options</label>
            <div id="music_player-music-options" class="cls-vertical-box">
              <div
                class="cls-horizontal-box"
                title="Autoplay music on other pages like 'Your Games', 'Profile', or during maintenance."
              >
                <label><input type="checkbox" name="Music Options" />Autoplay Music Outside Of Game Pages</label>
              </div>
              <div
                class="cls-horizontal-box"
                title="Seamlessly loop the music when playing in mirror matches. If enabled, the music will not restart when the turn changes when both players are using the same CO."
              >
                <label><input type="checkbox" name="Music Options" />Seamless Loops In Mirror Matches</label>
              </div>
              <div
                class="cls-horizontal-box"
                title="Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously."
              >
                <label><input type="checkbox" name="Music Options" />Restart Themes Every Turn</label>
              </div>
              <div
                class="cls-horizontal-box"
                title="Loop random songs until a turn change happens. If disabled, when a random song ends a new random song will be chosen immediately even if the turn hasn't changed yet."
              >
                <label><input type="checkbox" name="Music Options" />Loop Random Songs Until Turn Changes</label>
              </div>
              <div
                class="cls-horizontal-box"
                title="Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start."
              >
                <label><input type="checkbox" name="Music Options" />Alternate Themes</label>
              </div>
            </div>
          </div>
          <div class="cls-vertical-box cls-group-box" style="display: flex">
            <label>Alternate Themes Start On Day: 30</label
            ><input
              id="music_player-alternate-themes-start-on-day"
              type="range"
              min="0"
              max="30"
              step="1"
              title="After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?"
            />
          </div>
        </div>
        <div class="cls-settings-menu-box" id="music_player_settings-center" style="display: none"></div>
        <div class="cls-settings-menu-box" id="music_player_settings-right" style="display: flex">
          <div class="cls-vertical-box cls-group-box">
            <label>Override Themes</label>
            <div id="music_player-override-themes" class="cls-horizontal-box">
              <a
                class="game-tools-btn"
                href="javascript:void(0)"
                title="Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes."
                id="music_player_co-selector"
                ><img
                  class="co_caret"
                  src="https://awbw.amarriner.com/terrain/co_down_caret.gif"
                  style="z-index: 300" /><img
                  class="co_portrait"
                  src="https://awbw.amarriner.com/terrain/ani/aw2andy.png?v=1"
                  id="music_player_co-portrait"
              /></a>
              <div class="cls-vertical-box" title="Only play songs from AW1">
                <label><input type="radio" name="Override Themes" />AW1</label>
              </div>
              <div class="cls-vertical-box" title="Only play songs from AW2">
                <label><input type="radio" name="Override Themes" />AW2</label>
              </div>
              <div class="cls-vertical-box" title="Only play songs from RBC">
                <label><input type="radio" name="Override Themes" />RBC</label>
              </div>
              <div class="cls-vertical-box" title="Only play songs from DS">
                <label><input type="radio" name="Override Themes" />DS</label>
              </div>
              <div
                class="cls-vertical-box"
                title="Add an override for a specific CO to exclude their themes when playing random themes."
              >
                <label><input type="radio" name="Override Themes" />Exclude Random</label>
              </div>
              <div
                class="cls-vertical-box"
                title="Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes."
              >
                <button type="button" name="Override Themes">Add</button>
              </div>
            </div>
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>Current Overrides (Click to Remove)</label>
            <div id="music_player-current-overrides-(click-to-remove)" class="cls-horizontal-box">
              <table class="cls-settings-table" title="Removes the override for this specific CO.">
                <tbody>
                  <tr>
                    <td>
                      <div class="cls-vertical-box">
                        <img class="co_portrait" src="https://awbw.amarriner.com/terrain/followlist.gif" /><label
                          >No overrides set yet...</label
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="cls-vertical-box cls-group-box">
            <label>Themes Excluded From Randomizer (Click to Remove)</label>
            <div id="music_player-themes-excluded-from-randomizer-(click-to-remove)" class="cls-horizontal-box">
              <table class="cls-settings-table" title="Removes the override for this specific CO.">
                <tbody>
                  <tr>
                    <td>
                      <div class="cls-vertical-box">
                        <img class="co_portrait" src="https://awbw.amarriner.com/terrain/followlist.gif" /><label
                          >No themes excluded yet...</label
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <label id="music_player_version">Version: 5.2.0 (DeveloperJose Edition)</label>
    </div>
  </div>
</template> -->
-->
