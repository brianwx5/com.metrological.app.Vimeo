import VimeoMain from "./VimeoMain.js";
import VimeoPlayer from "./player/VimeoPlayer.js";
import VimeoApi from "../lib/api/VimeoApi.js";

export default class App extends ux.App {

    static _template() {
        return {
            Player: {type: VimeoPlayer, alpha: 0, signals: {playerStop: true}},
            Main: { type: VimeoMain}
        };
    }

    _construct() {
        this._api = new VimeoApi();
    }

    $getApi() {
        return this._api;
    }

    _init() {
        this._setState("Main");
    }

    $play({item, items}) {
        const player = this.tag('Player');
        const playlist = {item: item.getMediaplayerItem(), items: items.map(item => item.getMediaplayerItem())};
        if (player.play(playlist)) {
            this._setState("Playing");
        }
    }

    static _states() {
        return [
            class Main extends this {
                $enter() {
                    this.tag("Main").setSmooth('alpha', 1);
                }
                $exit() {
                    this.tag("Main").setSmooth('alpha', 0);
                }
                _getFocused() {
                    return this.tag("Main");
                }
            },
            class Playing extends this {
                $enter() {
                    this.tag("Player").setSmooth('alpha', 1);
                }
                $exit() {
                    this.tag("Player").setSmooth('alpha', 0);
                }
                _handleBack() {
                    this.playerStop();
                }
                playerStop() {
                    // Last item has been fully played.
                    this._setState("Main");
                }
                _getFocused() {
                    return this.tag("Player");
                }
            }
        ];
    }

    static secondsToTime(sec) {
        const hours = Math.floor(sec / 3600);
        sec %= 3600;
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${App.paddZero(hours)}:${App.paddZero(minutes)}:${App.paddZero(seconds)}`;
    }

    static paddZero(v) {
        if (v < 10) return `0${v}`;
        return v;
    }

    static cropImage({url, w, h}) {
        return ux.Ui.getImage(url, {width: w, height: h, type: 'crop'});
    }

}

App.COLORS = {
    BACKGROUND: 0xff282e32
};