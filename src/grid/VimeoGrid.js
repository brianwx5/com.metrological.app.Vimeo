import VimeoGridItem from "./VimeoGridItem.js";

export default class VimeoGrid extends lng.Component {
    static _template() {
        return {
            Title: {
                y: 30, x: 100, text: {text: '', fontSize: 45}, alpha: 0.3
            },
            List: {
                type: lng.components.ListComponent,
                w: 1920,
                h: 390,
                y: 120,
                itemSize: 440,
                scrollTransition: {duration: 0.2},
                invertDirection: false,
                roll: true,
                viewportScrollOffset: 0.5,
                itemScrollOffset: 0.5,
                rollMin: 90,
                rollMax: 90
            }
        };
    }

    set title(v) {
        this.tag('Title').text.text = v;
    }

    hasResults() {
        return this.tag('List').items.length;
    }

    get items() {
        return this._items;
    }

    get active() {
        return this.tag('List').getElement(this.index);
    }

    get index() {
        return this.tag('List').realIndex;
    }

    set items(v) {
        this._items = v.filter((item) => {
            return item.streams.length;
        }).map((el) => {
            return {type: VimeoGridItem, item: el};
        });

        this.tag('List').items = this._items;
    }

    set storeFocus(v) {
        this._storeFocus = v;
    }

    _handleLeft() {
        if (this.index === 0) {
            return false;
        }

        this.tag('List').setPrevious();
    }

    _focus() {
        this.patch({
            Title: {smooth: {alpha: 1}}
        });
        this.tag('List').setIndex(0);
    }

    _unfocus() {
        if (!this._storeFocus) {
            this.tag('List').setIndex(0);
        }
        this.patch({
            Title: {smooth: {alpha: 0.3}}
        });
    }

    _handleRight() {
        this.tag('List').setNext();
    }

    _handleEnter() {
        if (this.active) {
            this.fireAncestors('$play', {
                items: this.tag('List').items.map(item => item.item),
                item: this.active.item
            }, true);
        }
    }

    _getFocused() {
        return this.active;
    }
}