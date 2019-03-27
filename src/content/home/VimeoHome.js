import VimeoTeaser from "./teaser/VimeoTeaser.js";
import VimeoGrid from "../../grid/VimeoGrid.js";

export default class VimeoHome extends lng.Component {

    static _template() {
        return {
            Teaser: {type: VimeoTeaser},
            StaffPicks: {
                w: w => w, type: VimeoGrid, title: 'STAFF PICKS', storeFocus: true, y: 1080, x: -10,
                transitions: {y: {duration: 0.4, delay: 0.7}}
            }
        }
    }

    _init() {
        this._setState("Loading");
    }

    static _states() {
        return [
            class Loading extends this {
                $enter() {
                    this._load();
                }
                $exit() {
                    this.fireAncestors('$hideInitialLoader');
                }
                _load() {
                    const api = this.fireAncestors('$getApi');
                    api.getStaffpicks().then((data) => {
                        this._loaded(data);
                    }).catch(err => console.error(err));
                }
                _loaded(data) {
                    this.tag('Teaser').items = data;
                    this.tag('StaffPicks').items = data;
                    this._setState("StaffPicks");
                }
            },
            class Teaser extends this {
                _handleDown() {
                    this._setState("StaffPicks");
                }
                _getFocused() {
                    return this.tag('Teaser');
                }
            },
            class StaffPicks extends this {
                $enter() {
                    this.tag('Teaser').patch({
                        smooth: {y: 0}
                    });
                    this.tag('StaffPicks').patch({
                        smooth: {y: 600}
                    });
                }
                _handleUp() {
                    this._setState("Teaser");
                }
                _getFocused() {
                    return this.tag('StaffPicks');
                }
            }
        ];
    }

}