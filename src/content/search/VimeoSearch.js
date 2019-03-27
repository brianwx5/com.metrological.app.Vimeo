import VimeoGrid from "../../grid/VimeoGrid.js";
import VimeoKeyboard from "./VimeoKeyboard.js";

export default class VimeoSearch extends lng.Component {
    static _template() {
        return {
            Top: {
                w: w=>w, h: 150, color: 0xff1A2022, rect: true,
                Label: {color: 0xffffffff, mountX: 1, x: (w => w - 50), y: 50, text: {text: 'Search', fontSize: 60}}
            },
            Query: {
                type: VimeoQuery, x: 50, y: 200, signals: {search: true}
            },
            Results: {
                type: VimeoGrid, title: '', y: 250, x: -23
            },
            Keyboard: {
                x: 50, y: 350, type: VimeoKeyboard, signals: {keypress: true, upExit: true}
            }
        };
    }

    _init() {
        this._results = this.tag('Results');
        this._setState("Keyboard");
    }

    _moveKeyboard() {
        this.tag('Keyboard').setSmooth('y', 750);
    }

    static _states() {
        return [
            class Query extends this {
                _handleDown() {
                    this._setState("Results");
                }
                _getFocused() {
                    return this.tag('Query');
                }
            },
            class Results extends this {
                _handleUp() {
                    this._setState("Query");
                }
                _handleDown() {
                    this._setState("Keyboard");
                }
                _getFocused() {
                    return this.tag('Results');
                }
            },
            class Keyboard extends this {
                keypress({key}) {
                    this.tag('Query').update(key);
                }
                search({query}) {
                    if (!query) {
                        if (!this._search) {
                            this._search = [
                                'cat', 'tomato', 'cats', 'funny', 'waldo', 'hello world'
                            ];
                        }
                        query = this._search[Math.floor(Math.random() * this._search.length)];
                    }
                    const api = this.fireAncestors('$getApi');
                    api.search(query).then((items) => {
                        this.fire('searchReady', {items});
                    });
                }
                searchReady({items}) {
                    this._results.items = items;
                    this._moveKeyboard();
                }
                upExit() {
                    this._setState("Results");
                }
                _getFocused() {
                    return this.tag('Keyboard');
                }
            }
        ];
    }

}

class VimeoQuery extends lng.Component {
    static _template() {
        return {
            Query: {
                y: 4, text: {text: '', fontSize: 50}
            },
            Line: {
                rect: true, y: 90, h: 2, w: 1600, color: 0xff484A4E
            },
            Delete: {
                x: 1550, y: 20,
                texture: lng.Tools.getRoundRect(50, 50, 5, 0, 0x00000000, true, 0xff0D1314),
                Label: {
                    x: 17, y: 7,
                    text: {
                        text: 'X', fontSize: 30
                    }
                }
            }
        };
    }

    update(char) {
        switch (char) {
            case 'space':
                this._query += ' ';
                break;
            case 'clear':
                this._query = '';
                break;
            case 'search':
                this.signal('search', {query: this._query});
                break;
            case '<':
                this._query = this._query.slice(0, -1);
                break;
            default:
                this._query += char;
                break;
        }
        this.tag('Query').text.text = this._query;
    }

    get query() {
        return this._query;
    }

    _init() {
        this._query = '';
    }

    _focus() {
        this.tag('Delete').patch({
            smooth: {scale: 1.3}
        });
    }

    _unfocus() {
        this.tag('Delete').patch({
            smooth: {scale: 1}
        });
    }

    _handleEnter() {
        this.update('clear');
    }

}
