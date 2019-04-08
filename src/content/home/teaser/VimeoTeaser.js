import App from "../../../App.js";

export default class VimeoTeaser extends lng.Component {
    static _template() {
        return {
            rect: true, color: 0xff000000, w: 1770, x: 0, h: 590,
            Clipper: {
                clipping: true, w: 1550, h: 590, x: 370,
                Image: {
                    alpha: 0.0001, transitions: {alpha: {duration: 3, delay: 0}, scale: {duration: 30, delay: 0.1}}
                }
            },
            Gradient: {
                x: 370, colorLeft: 0xff000000, colorRight: 0x00000000, w: 1000, h: 590, rect: true
            },
            Seal: {
                x: 40, y: 50, src: App.getPath('images/vimeo-staff-pick.png'), scale: 0.7, alpha: 0, rotation: -0.3,
                transitions: {
                    scale: {duration: 0.4, delay: 2},
                    alpha: {duration: 0.4, delay: 2},
                    rotation: {duration: 0.4, delay: 2}
                }
            },
            Title: {
                y: 240, x: 90, text: {fontSize: 56, maxLines: 2, wordWrapWidth: 690, lineHeight: 80},
                transitions: {alpha: {duration: 1.5, delay: 0.5}}
            },
            User: {
                y: 290, x: 90, color: 0xffA3A4A5, text: {fontSize: 30, maxLines: 1, wordWrapWidth: 690, lineHeight: 40},
                transitions: {alpha: {duration: 1.5, delay: 0.7}}
            },
            Watch: {
                texture: lng.Tools.getRoundRect(150, 50, 5, 0, 0x00000000, true, 0xffffffff), y: 390, x: 90, alpha: 0,
                transitions: {alpha: {duration: 1.5, delay: 0.9}},
                Icon: {
                    y: 15, x: 19, src: App.getPath('images/watch-icon.png'), w: 19, h: 20
                },
                Label: {
                    x: 52, y: 10, color: 0xff000000, text: {text: 'Watch', fontSize: 25}
                }
            },
            Overlay: {
                rect: true, color: 0xff282E32, w: 1920, x: 0, h: 590,
                transitions: {h: {duration: 0.6, delay: 0.3}, y: {duration: 0.6, delay: 0.3}}
            },
            Progress: {
                x: 0, y: 585, h: 5, w: 0, rect: true, color: 0x80ffffff, alpha: 0,
                transitions: {w: {duration: 30, timingFunction: 'linear'}, alpha: {duration: 1, delay: 2}}
            }
        };
    }


    pause() {
        this.tag('Progress').transition('w').pause();
        this.tag('Image').transition('scale').pause();
        this._pause = true;
    }

    play() {
        this.tag('Progress').transition('w').play();
        this.tag('Image').transition('scale').play();
        this._pause = false;
    }
    
    _init() {
        this._currentProgress = 0;
        this._progressDuration = 30;
        this._loadedTextures = [];

        this.tag('Title').on('txLoaded', () => {
            this._loadedTextures.push('title');
            this._position();
        });

        this.tag('User').on('txLoaded', () => {
            this._loadedTextures.push('user');
            this._position();
        });

        this._setState("Inactive");
    }

    _inactive() {
        this.pause();
    }

    _active() {
        this.play();
    }

    _detach() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }

    _focus() {
        this.patch({
            Watch: {
                smooth: {color: 0xffFADA24, scale: 1.2}
            }
        });
        this.pause();
    }

    _unfocus() {
        this.patch({
            Watch: {
                smooth: {color: 0xffffffff, scale: 1}
            }
        });
        this.play();
    }

    _handleEnter() {
        this.fireAncestors('play', {item: this._current, items: this._items});
    }

    loading() {
        this._setState("Loading");
    }

    running() {
        this._setState("Running");
    }

    static _states() {
        return [
            class Inactive extends this {
                loaded() {
                    this.patch({
                        Clipper: {Image: {scale: 1, smooth: {alpha: 1, scale: 1.3}}},
                        Seal: {smooth: {alpha: 1, scale: 0.9, rotation: 0}},
                        Overlay: {smooth: {h: 1, y: 591}},
                        Watch: {smooth: {alpha: 1}},
                        Progress: {smooth: {alpha: 1, w: 1770}}
                    });

                    if (this._interval) {
                        clearInterval(this._interval);
                    }
                    this._interval = setInterval(() => {
                        this._progress();
                    }, 1000);

                    this.tag('Image').transition('alpha').on('finish', () => {
                        if (this.tag('Image').alpha < 1) {
                            this.fire('imageFaded');
                        }
                    });
                }
            },
            class Loading extends this {
                $enter() {
                    clearInterval(this._interval);
                    this.patch({
                        Clipper: {Image: {smooth: {alpha: 0.00001}}},
                        Title: {smooth: {alpha: 0}},
                        User: {smooth: {alpha: 0}},
                        Watch: {smooth: {alpha: 0}},
                        Progress: {smooth: {w: [0, {duration: 0.1, delay: 0}]}}
                    });
                    this._currentProgress = 0;
                }
                imageFaded() {
                    this._update();
                }
                $exit() {
                    if (this._interval) {
                        clearInterval(this._interval);
                    }
                    this._interval = setInterval(() => {
                        this._progress();
                    }, 1000);
                }
                loaded() {
                    this.patch({
                        Clipper: {Image: {scale: 1, smooth: {alpha: 1, scale: [1.3, {duration: 30, delay: 0}]}}},
                        Title: {smooth: {alpha: 1}},
                        User: {smooth: {alpha: 1}},
                        Watch: {smooth: {alpha: 1}},
                        Progress: {smooth: {w: [1770, {duration: 30, delay: 0, timingFunction: 'linear'}]}}
                    });
                    this.fire('running');
                }
            },
            class Running extends this {
            }
        ];
    }

    set items(v) {
        this._items = v;
        this._currentSet = this._items.slice();
        this._update();
    }

    _position() {
        if (this._loadedTextures.indexOf('user') !== -1 && this._loadedTextures.indexOf('title') !== -1) {
            let yUser = this.tag('Title').renderHeight + this.tag('Title').y - 15;
            this.patch({
                User: {y: yUser},
                Watch: {y: yUser + 70}
            });
            this._loadedTextures = [];
        }
    }

    _progress() {
        if (this._pause) {
            return;
        }
        if (this._currentProgress === this._progressDuration) {
            this.fire('loading');
            return;
        }
        this._currentProgress += 1;
    }

    _update() {
        if (!this._currentSet.length) {
            this._currentSet = this._items.slice();
        }

        let item = this._currentSet.splice(VimeoTeaser.random(this._currentSet), 1)[0];

        this._current = item;

        this.patch({
            Clipper: {Image: {texture: App.cropImage({url: item.largest, w: 1400, h: 590})}},
            Title: {text: {text: item.title}},
            User: {text: {text: item.username}}
        });

        this.tag('Title').loadTexture();
        this.tag('User').loadTexture();

        this.tag('Image').on('txLoaded', () => {
            this.fire('loaded');
        });

        this.tag('Image').on('txError', () => {
            this.signal('error');
        });
    }

    static random(items) {
        let len = items;
        if (Array.isArray(items)) {
            len = items.length;
        }

        return Math.floor(Math.random() * len);
    }


}