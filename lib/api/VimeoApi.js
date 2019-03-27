import VimeoMediaItem from "./VimeoMediaItem.js";

export default class VimeoApi {
    constructor() {

        this._keys = {
            key: 'aabe22c4e1a4038c0fc233bd6a0aa973',
            secret: '5d9d5e20fc83a9ac',
            token: '043c069649b914767c9cfe4db8cc6d63'
        };

        this._endpoints = {
            base: 'https://api.vimeo.com',
            staff: 'https://api.vimeo.com/channels/staffpicks/videos?filter=content_rating&filter_content_rating=safe&per_page=20&page=1',
            channels: 'https://api.vimeo.com/channels?per_page=10&sort=followers&direction=desc',
            search: 'https://api.vimeo.com/videos'
        };
    }

    _getHeaders() {
        return {
            headers: new Headers({Authorization: `bearer ${this._keys.token}`})
        };
    }

    _send(url) {
        return fetch(url, this._getHeaders()).then(r => r.json());
    }

    getStaffpicks() {
        return this._send(this._endpoints.staff).then(({data = [], paging}) => {
            if (!data.length) {
                return Promise.reject('Get staffpicks returned no data');
            }
            return Promise.resolve(
                data.map(video => new VimeoMediaItem(video))
            );
        });
    }

    getChannels() {
        return this._getChannelsPromises().then((data) => {
            let filtered = data.filter(channel => channel.total > 5);
            let channels = filtered.map((channel) => {
                return {
                    category: channel.category,
                    items: channel.data.splice(0, 15).map((item) => {
                        return new VimeoMediaItem(item);
                    })
                };
            });
            return Promise.resolve(channels);
        });
    }

    _getChannelsPromises() {
        return this._send(this._endpoints.channels).then((data = []) => {
            let promises = [];
            data.data.forEach((channel) => {
                promises.push(this._getVideosForChannel(channel));
            });
            return Promise.all(promises);
        });
    }

    _getVideosForChannel(channel) {
        return this._send(`${this._endpoints.base}${channel.uri}/videos`).then((data) => {
            data.category = channel.name;
            return Promise.resolve(data);
        });
    }

    search(query) {
        return this._send(`${this._endpoints.search}/?query=${query}&direction=desc&sort=likes`).then((data) => {
            if (!data.data.length) {
                return Promise.resolve([]);
            }
            let results = data.data.map((item) => {
                return new VimeoMediaItem(item);
            });
            return Promise.resolve(results);
        });
    }

    send() {
        // fix
    }
}