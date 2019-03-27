export default class VimeoMediaItem {
    constructor(obj) {
        this.$ = obj;
    }

    get title() {
        return this.$.name;
    }

    get pictures() {
        return this.$.pictures.sort((a, b) => b.width - a.width);
    }

    getMediaplayerItem() {
        return {title: this.title, stream: {link: this.filterStreams()[0].link}}
    }

    /**
     * Get a picture that matches a certain width or height
     * @param w
     * @param h
     * @returns {*}
     */
    getPicture({w = null, h = null}) {
        let pictures = this.pictures;

        if (!pictures.length) {
            return false;
        }
        if (!w && !h) {
            return pictures[0];
        } else {
            const val = w ? w : h;
            const match = pictures.filter(p => p[w ? 'width' : 'height'] === val);

            if (match.length) {
                return match[0];
            } else {
                return pictures[0];
            }
        }
    }

    get largest() {
        return this.pictures[0].link;
    }

    get smallest() {
        const p = this.pictures;
        return p[p.length - 1].link;
    }

    get streams() {
        return this.$.download || [];
    }

    /**
     * get an array of streams by quality
     * @param quality {(source|hd|sd)}
     */
    filterStreams(quality = 'sd') {
        return this.streams.filter(stream => stream.quality === quality);
    }

    get description() {
        return this.$.description;
    }

    get duration() {
        return this.$.duration;
    }

    get date() {
        return this.$.created_time;
    }

    get language() {
        return this.$.language;
    }

    get user() {
        return this.$.user;
    }

    get username() {
        return this.user.name;
    }
}