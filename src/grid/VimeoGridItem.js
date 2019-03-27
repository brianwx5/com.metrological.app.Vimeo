import App from "../App.js";

export default class VimeoGridItem extends lng.Component {
    static _template() {
        return {
            w: 400, h: 325, rect: true, color: 0xff0D1314, alpha: 0.6,
            Image: {},
            Border: {
                alpha: 0, w: 400, h: 216,
                Time: {
                    rect: true, color: 0xffFADB23, w: 100, h: 40, x: 300, y: 280, transitions: {y: {duration: 0.3}},
                    Label: {
                        x: 10, y: 10, color: 0xff000000, text: {text: '00:00:00', fontSize: 19}
                    }
                },
                Border: {type: lng.components.BorderComponent, borderWidth: 5, colorBorder: 0xffFADA24, w: 400 - 4, h: 216 - 4, x: 2, y: 2}
            },
            Title: {
                x: 20, y: 230, text: {text: '', fontSize: 40, wordWrapWidth: 360, maxLines: 1}
            },
            User: {
                x: 20,
                y: 284,
                color: 0xffA3A4A5,
                text: {text: 'Username', fontSize: 25, wordWrapWidth: 360, maxLines: 1}
            }
        };

    }

    set item(v) {
        this._item = v;

        this.patch({
            Image: {
                src: App.cropImage({url: v.getPicture({w: 640}).link, w: 400, h: 215})
            },
            Border: {
                Time: {
                    Label: {text: {text: App.secondsToTime(v.duration)}}
                }
            },
            Title: {
                text: {text: v.title}
            },
            User: {
                text: {text: v.username}
            }
        });
    }

    get item() {
        return this._item;
    }

    _focus() {
        this.patch({
            smooth: {scale: 1.1, alpha: 1},
            Border: {
                smooth: {alpha: 1},
                Time: {smooth: {y: 174}}
            }
        });
    }

    _unfocus() {
        this.patch({
            smooth: {scale: 1, alpha: 0.6},
            Border: {
                smooth: {alpha: 0},
                Time: {smooth: {y: 270}}
            }
        });
    }
}