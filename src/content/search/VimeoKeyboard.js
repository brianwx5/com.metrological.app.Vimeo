export default class VimeoKeyboard extends lng.Component {
    static _template() {
        return {
            Categories: {},
            Keys: {}
        };
    }

    get active() {
        return this.tag('Keys').childList.getAt(
            this._activeidx + (this._row * this._c)
        );
    }

    _init() {
        this._keys = [
            ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', '<'],
            ['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q'],
            ['r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        ];
        this._buildKb();
        this._activeidx = 0;
        this._row = 0;
        this._c = this._keys[0].length;
        this._r = this._keys.length;
    }

    _buildKb() {
        let children = [];
        let x = 0, y = 0;

        this._keys.forEach((r) => {
            r.forEach((k, i) => {
                children.push({ref: `Key-${k}`, type: VimeoKeyboardKey, x: i * 170, y, key: k});
            });
            y += 70;
        });
        children.push(
            {ref: 'SpaceKey', type: VimeoSpaceKey, x: 0, y: y, key: 'space'},
            {ref: 'SearchKey', type: VimeoSearchKey, x: 1020, y: y, key: 'search'}
        );
        this.patch({
            Keys: {children}
        });
    }

    _handleLeft() {
        if (this._activeidx > 0 && this._row < 3) {
            this._activeidx -= 1;
        } else if (this._row === 3 && this._activeidx === 1) {
            this._activeidx = 0;
        } else {
            return false;
        }
    }

    _handleRight() {
        if (this._activeidx < this._c - 1 && this._row < 3) {
            this._activeidx += 1;
        } else if (this._activeidx === 0) {
            this._activeidx = 1;
        }
    }

    _handleUp() {
        if (this._row > 0) {
            this._row -= 1;
        } else {
            this.signal('upExit');
        }
    }

    _handleDown() {
        if (this._row < 3) {
            // if we move to space / search row
            // focus on search
            if (this._row === 2) {
                this._activeidx = 1;
            }
            this._row += 1;
        }
    }

    _handleEnter() {
        this.signal('keypress', {key: this.active.key});
    }

    _getFocused() {
        return this.active;
    }
}

class VimeoKeyboardKey extends lng.Component {
    static _template() {
        return {
            w:160, h:60, alpha: 0.4,
            Background: {texture: lng.Tools.getRoundRect(160, 60, 5, 2, 0xffffffff, true, 0xff0D1314)},
            Key: {mountX: 0.5, color: 0xffffffff, x: 80, y: 4, text: {text: ''}}
        };
    }

    set key(v) {
        this._key = v;
        this.tag('Key').text.text = v;
    }

    get key() {
        return this._key;
    }

    _focus() {
        this.patch({
            smooth: {scale: 1.1, zIndex: 3, alpha: 1}
        });
    }

    _unfocus() {
        this.patch({
            smooth: {scale: 1, zIndex: 1, alpha: 0.4}
        });
    }
}

class VimeoSpaceKey extends VimeoKeyboardKey {
    set key(v) {
        this._key = v;
        this.patch({
            w:1010, h:60,
            Background: {texture: lng.Tools.getRoundRect(1010, 60, 5, 2, 0xffffffff, true, 0xff0D1314)},
            Key: {mountX: 0.5, x: 505, y: 4, text: {text: v}}
        });
    }

    get key() {
        return this._key;
    }
}

class VimeoSearchKey extends VimeoKeyboardKey {
    set key(v) {
        this._key = v;
        this.patch({
            w:500, h:60,
            Background: {texture: lng.Tools.getRoundRect(500, 60, 5, 2, 0xffffffff, true, 0xff0D1314)},
            Key: {mountX: 0.5, x: 250, y: 4, text: {text: v}}
        });
    }

    get key() {
        return this._key;
    }
}
