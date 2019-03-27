import App from "./App.js";
import VimeoContent from "./content/VimeoContent.js";
import VimeoMenu from "./menu/VimeoMenu.js";

export default class VimeoMain extends lng.Component {

    static _template() {
        return {
            Menu: {
                type: VimeoMenu, signals: {select: true}
            },
            Content: {
                x: 150, w: 1770,
                type: VimeoContent
            },
            Loader: {
                src: App.getPath('images/vimeo-loading.png'), x: 739, y: 467, w: 442, h: 146
            }
        };
    }

    _setup() {
        this._loader = this.tag("Loader").animation({
            duration: 2, repeat: -1, stopMethod: 'immediate', actions: [
                {p: 'y', rv: 450, v: {0: 450, 0.5: 440, 1: 450}}
            ]
        });

        this._loader.on('stop', () => {
            this.tag('Loader').setSmooth('alpha', 0);
        });
    }

    _init() {
        this._setState("Loading");
    }

    static _states() {
        return [
            class Loading extends this {
                $enter() {
                    this._loader.start();
                }
                $exit() {
                    this._loader.stop();
                    this.tag("Menu").reveal();
                }
                $hideInitialLoader() {
                    this._setState("Content");
                }
            },
            class Content extends this {
                _getFocused() {
                    return this.tag('Content');
                }
                _handleLeft() {
                    this._setState("Menu");
                }
            },
            class Menu extends this {
                _handleRight() {
                    this._setState("Content");
                }
                select({view}) {
                    this.tag("Content").select(view);
                    this._setState("Content", view);
                }
                _getFocused() {
                    return this.tag('Menu');
                }
            }
        ];
    }

    _setFocusSettings(settings) {
        settings.clearColor = App.COLORS.BACKGROUND;
    }

}
