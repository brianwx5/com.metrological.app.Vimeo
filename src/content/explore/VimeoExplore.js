import App from "../../App.js";
import VimeoGrid from "../../grid/VimeoGrid.js";

export default class VimeoExplore extends lng.Component {
    static _template() {
        return {
            Wrapper: {
                y: 170,
                Channels: {}
            },
            Top: {
                w: w => w, h: 150, color: 0xff1A2022, rect: true,
                Label: {color: 0xffffffff, mountX: 1, x: (w => w - 50), y: 50, text: {text: 'Explore', fontSize: 60}}
            },
            Loader: {
                x: w => w / 2,
                mountX: 0.5,
                y: 500,
                h: 42,
                w: 42,
                src: App.getPath('images/loader.png'),
                transitions: {alpha: {duration: 0.4, delay: 0.1}}
            }
        };
    }

    get channels() {
        return this.tag('Channels').children;
    }

    _init() {
        this._loading = this.tag('Loader').animation({
            duration: 1, repeat: -1, actions: [
                {p: 'rotation', v: {0: 0, 1: Math.PI * 2}}
            ]
        });
        this._setState("Loading");
    }

    _firstActive() {
        this._loading.start();
        this.fireAncestors('$getApi').getChannels().then((data) => {
            this.items = data;
            this.fire('ready');
        }).catch(err => {
            console.error(err);
        });
    }

    select({idx}) {
        this._idx = idx;
        this._selected = this.channels[idx];
        this.tag('Channels').patch({
            smooth: {y: idx * -440}
        });
    }

    _handleUp() {
        if (this._idx > 0) {
            this.select({idx: this._idx - 1});
        }
    }

    _handleDown() {
        if (this._idx < this.channels.length - 1) {
            this.select({idx: this._idx + 1});
        }
    }

    _getFocused() {
        return this._selected;
    }

    set items(v) {
        this._items = v;
        let children = v.map((channel, idx) => {
            return {
                type: VimeoGrid, items: channel.items, title: channel.category, x: 0, y: idx * 450
            };
        });

        this.patch({
            Wrapper: {
                Channels: {
                    children
                }
            }
        });
    }

    static _states() {
        return [
            class Loading extends this {
                ready() {
                    this._loading.stop();
                    this.tag('Loader').setSmooth('alpha', 0);
                    this.select({idx: 0});
                    this._setState("");
                }
            }
        ];
    }

}