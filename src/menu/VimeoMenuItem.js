import App from "../App.js";

export default class VimeoMenuItem extends lng.Component {

    static _template() {
        return {
            x: 60,
            ActiveRect: {
                transitions: {alpha: {duration: 0.2, delay: 0.2}},
                alpha: 0, texture: lng.Tools.getRoundRect(430, 100, 7, 0, 0x00000000, true, 0xff282E32)
            },
            Icon: {x: 20, w: 49, h: 49, y: 25, color: 0xfff1f1f1},
            Label: {
                x: 100, color: 0xfff1f1f1, y: 23, alpha: 0, text: {text: 'label'}
            }
        };
    }

    set section(v) {
        this._section = v;
        this.patch({
            Icon: {
                src: App.getPath(`images/${v}.png`),
                scale: 0.8
            },
            Label: {text: v.toUpperCase()}
        });
    }

    get section() {
        return this._section;
    }

    get secure() {
        return this._secure;
    }

    set secure(v) {
        this._secure = v;
    }

    set listindex(v) {
        this._listindex = v[0];
        this.patch({
            transitions: {y: {duration: 0.6, delay: v[1] * 0.1 + 0.05}},
            Icon: {
                transitions: {scale: {duration: 0.1, delay: v[1] * 0.1 + 0.05}}
            },
            Label: {
                transitions: {alpha: {duration: 0.2, delay: v[1] * 0.1 + 0.05}}
            }
        });
    }

    set active(v) {
        this._isActive = v;
    }

    _toggle(t) {
        this.patch({
            smooth: {y: t ? this._listindex * 120 + 133 : this._listindex * 90 + 93},
            Icon: {smooth: {scale: t ? 1 : 0.8}},
            Label: {smooth: {alpha: t ? 1 : 0}},
            ActiveRect: {smooth: {alpha: 0}}
        });
    }

    _init() {
        this._setState("Collapsed");
    }

    _focus() {
        this.patch({
            Label: {smooth: {color: 0xff0D1314}},
            Icon: {smooth: {color: 0xff0D1314}},
            ActiveRect: {alpha: 0}
        });
    }

    _unfocus() {
        this.patch({
            Label: {smooth: {color: 0xfff1f1f1}},
            Icon: {smooth: {color: 0xfff1f1f1}}
        });
    }

    collapse() {
    }

    expand() {
    }

    static _states() {
        return [
            class Expanded extends this {
                $enter() {
                    this._toggle(true);
                }
                collapse() {
                    this._setState("Collapsed");
                }
                _unfocus() {
                    super._unfocus();
                    this.patch({
                        ActiveRect: {smooth: {alpha: this._isActive ? 1 : 0}}
                    });
                }
            },
            class Collapsed extends this {
                $enter() {
                    this._toggle(false);
                }
                expand() {
                    this._setState("Expanded");
                }
            }
        ];
    }


}