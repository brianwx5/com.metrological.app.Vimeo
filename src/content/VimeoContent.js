import VimeoSearch from "./search/VimeoSearch.js";
import VimeoExplore from "./explore/VimeoExplore.js";
import VimeoHome from "./home/VimeoHome.js";

export default class VimeoContent extends lng.Component {

    static _template() {
        return {
            Home: {
                w: w => w, type: VimeoHome, alpha: 0
            },
            Search: {
                w: w => w, type: VimeoSearch, alpha: 0
            },
            Explore: {
                w: w => w, type: VimeoExplore, alpha: 0
            }
        };
    }


    _setup() {
        this._views = {
            Home: [this.tag('Home')],
            Explore: [this.tag('Explore')],
            Search: [this.tag('Search')]
        };

        this._mapping = {
            feed: "Home",
            explore: "Explore",
            search: "Search"
        };
    }

    _init() {
        this._setState("Home");
    }

    play(args) {
        this.fireAncestors('$play', args);
    }

    select(view) {
        if (this._mapping.hasOwnProperty(view)) {
            this._setState(this._mapping[view]);
        }
    }

    static _states() {
        return [
            class Home extends this {
                $enter() {
                    this.tag("Home").setSmooth('alpha', 1);
                }
                $exit() {
                    this.tag("Home").setSmooth('alpha', 0);
                }
                _getFocused() {
                    return this.tag('Home');
                }
            },
            class Explore extends this {
                $enter() {
                    this.tag("Explore").setSmooth('alpha', 1);
                }
                $exit() {
                    this.tag("Explore").setSmooth('alpha', 0);
                }
                _getFocused() {
                    return this.tag('Explore');
                }
            },
            class Search extends this {
                $enter() {
                    this.tag("Search").setSmooth('alpha', 1);
                }
                $exit() {
                    this.tag("Search").setSmooth('alpha', 0);
                }
                _getFocused() {
                    return this.tag('Search');
                }
            }
        ];
    }


}
