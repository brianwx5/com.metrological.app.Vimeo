import App from "../App.js";
import VimeoLogin from "../login/VimeoLogin.js";
import VimeoMenuItem from "./VimeoMenuItem.js";

export default class VimeoMenu extends lng.Component {
    static _template() {
        return {
            alpha: 1, x: -150, zIndex: 99,
            transitions: {x: {duration: 0.6, delay: 0}},
            Shadow: {
                colorLeft: 0xff000000, colorRight: 0x00000000, w: 200, h: 1080, rect: true
            },
            Wrapper: {
                w: 150, h: 1080, color: VimeoMenu.COLORS.BACKGROUND, rect: true,
                transitions: {},
                Gradient: {
                    src: App.getPath('images/vimeo-line.png'), x: 150
                },
                FocusIndicator: {
                    alpha: 0, x: -1200, y: 120,
                    transitions: {x: {duration: 0.7, delay: 0.8}},
                    Shadow: {
                        color: 0xff000000, alpha: 0.5, texture: lng.Tools.getShadowRect(460, 100, 7, 5),
                    },
                    Focus: {
                        alpha: 1, texture: lng.Tools.getRoundRect(460, 100, 7, 0, 0x00000000, true, 0xfff1f1f1)
                    }
                },
                Items: {}
            },
            Login: {
                type: VimeoLogin, x: 70, y: 70, alpha: 0
            }
        };
    }

    _toggle(t) {
        this.patch({
            Shadow: {
                transitions: {w: {duration: 0.5, delay: t ? 0 : 0.5}},
                smooth: {w: t ? 1170 : 200}
            },
            Wrapper: {
                transitions: {w: {duration: 0.5, delay: t ? 0 : 0.5}},
                smooth: {w: t ? 490 : 150},
                Gradient: {
                    transitions: {x: {duration: 0.5, delay: t ? 0 : 0.5}, w: {duration: 0.5, delay: t ? 0 : 0.5}},
                    smooth: {x: t ? 490 : 150, w: t ? 10 : 5}
                },
                FocusIndicator: {
                    smooth: {
                        x: t ? [50, {duration: 0.2, delay: 0.6}] : [-1200, {duration: 0.5, delay: 0.2}],
                        alpha: 1,
                        y: t ? this._activeidx * 120 + 130 : this._midx * 120 + 130
                    }
                }
            }
        });
        this.tag('Items').childList.get().forEach(el => {
            el[t ? 'expand' : 'collapse']()
        });
    }

    get list() {
        return this.tag('Items').childList.get();
    }

    get active() {
        return this.list[this._midx];
    }

    get previousActive() {
        return this.list[this._activeidx];
    }

    _repositionFocus() {
        this.patch({
            Wrapper: {
                FocusIndicator: {smooth: {y: this._midx * 120 + 130}}
            }
        });
    }

    _init() {
        this.tag('Items').children = [
            {l: 'feed', secure: false},
            {l: 'explore', secure: false},
            {l: 'search', secure: false},
            {l: 'library', secure: true},
            {l: 'profile', secure: true}
        ].map((el, idx, arr) => {
            return {
                type: VimeoMenuItem,
                active: idx === 0,
                section: el.l,
                secure: el.secure,
                y: idx * 90 + 93,
                listindex: [idx, arr.length - idx]
            };
        });

        this._midx = 0;
        this._activeidx = 0;

        this.tag('FocusIndicator').transition('x').on('finish', () => {
            if (this.tag('FocusIndicator').x === 50) {
                this.fire('ready');
            }
        });

        this._login = false;

        this._setState("Collapsed");
    }

    reveal() {
        this.patch({
            smooth: {x: 0}
        });
    }

    _focus() {
        this._toggle(true);
    }

    _unfocus() {
        this._toggle(false);
        this._setState("Collapsed");
    }

    static _states() {
        return [
            class Expanded extends this {
                $enter() {
                    this._midx = this._activeidx || 0;
                }
                _handleUp() {
                    if (this._midx === 0) {
                        this._midx = this.list.length - 1;
                    } else {
                        this._midx--;
                    }
                    this._repositionFocus();
                }
                _handleDown() {
                    if (this._midx === this.list.length - 1) {
                        this._midx = 0;
                    } else {
                        this._midx++;
                    }
                    this._repositionFocus();
                }
                _handleEnter() {
                    this._activeidx = this._midx;
                    if (!this._login && this.active.secure) {
                        this._setState("Login");
                    } else {
                        this._activeidx = this._midx;
                        this.signal('select', {view: this.active.section});
                    }
                }
                _getFocused() {
                    return this.active;
                }
            },
            class Collapsed extends this {
                ready() {
                    this._setState("Expanded");
                }
            },
            class Login extends this {
                $enter() {
                    this.patch({
                        Wrapper: {
                            smooth: {w: 520},
                            Gradient: {smooth: {x: 520}},
                            FocusIndicator: {smooth: {alpha: 0}},
                            Items: {smooth: {alpha: 0}}
                        },
                        Login: {
                            smooth: {alpha: 1}
                        }
                    });
                }
                $exit() {
                    this.patch({
                        Wrapper: {
                            smooth: {w: 490},
                            Gradient: {smooth: {x: 490}},
                            FocusIndicator: {smooth: {alpha: 1}},
                            Items: {smooth: {alpha: 1}}
                        },
                        Login: {
                            smooth: {alpha: 0}
                        }
                    });
                }
                _handleRight() {
                    this._setState("Expanded");
                }
                _handleBack() {
                    this._setState("Expanded");
                }
            }
        ]
    }

}

VimeoMenu.COLORS = {
    BACKGROUND: 0xff37434a
};