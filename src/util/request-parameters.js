let jwt = require('jsonwebtoken');

/**
 * Request Parameters
 *
 * takes the request parameters
 */
export class RequestParameters {
    _defaultLanguages = [];
    _defaultLimit = 10;
    _defaultPage = 1;
    _defaultParams = {};
    _defaultQuery = {};

    constructor(request) {
        //params
        this._params = request.params || this._defaultParams;
        this._id = this._params.id;

        //query
        this._query = request.query || this._defaultQuery;
        this._search = this._query.search;
        this._languages = this._query.languages || this._defaultLanguages;
        this._language = this._query.language;
        this._limit = parseInt(this._query.limit) || this._defaultLimit;
        this._page = parseInt(this._query.page) || this._defaultPage;
        this._setSkip();

        //body
        this._body = request.body || {};

        if (request.headers.authorization && request.headers.authorization.indexOf('Bearer ') > -1) {
            let idUser = jwt.decode(request.headers.authorization.split('Bearer ')[1]).idUser;
            if (idUser) {
                this.idUser = idUser;
            }
        }
    }

    get user() {
        return this._user;
    }

    get body() {
        return this._body;
    }

    get params() {
        return this._params;
    }

    get id() {
        return this._id;
    }

    get query() {
        return this._query;
    }

    get search() {
        return this._search;
    }

    get languages() {
        return this._languages;
    }

    get language() {
        return this._language;
    }

    get limit() {
        return this._limit;
    }

    get page() {
        return this._page;
    }

    get skip() {
        return this._skip;
    }

    set user(user) {
        if (!user) {
            return this._user = {};
        }

        if (typeof user === 'object') {
            return this._user = user;
        }

        return this._user = null;
    }

    set body(body) {
        if (!body) {
            return this._body = {};
        }

        if (typeof body === 'object') {
            return this._body = body;
        }

        return this._body = null;
    }

    set params(params) {
        if (!params) {
            return this._params = this._defaultParams;
        }

        if (typeof params === 'object') {
            return this._params = params;
        }

        return this._params = null;
    }

    set id(id) {
        if (!id) {
            return this._id = null;
        }


        if (typeof id === 'object') {
            return this._id = null;
        }

        return this._id = id;
    }

    set query(query) {
        if (!query) {
            return this._query = null;
        }

        if (typeof query === 'object') {
            return this._query = query;
        }

        return this._query = null;
    }

    set search(search) {
        if (!search) {
            return this._search = null;
        }

        if (typeof search === 'object') {
            return this._search = null;
        }

        return this._search = search;
    }

    set languages(languages) {
        if (!languages) {
            return this._languages = [];
        }

        if (Array.isArray(languages)) {
            return this._languages = languages;
        }

        //todo: this might be incorrect syntax
        let languagesAsArray = new Array(languages);

        if (languagesAsArray && Array.isArray(languagesAsArray)) {
            return this._languages = languagesAsArray;
        }

        return this._languages = [];
    }

    set language(language) {
        if (!language) {
            return this._language = null;
        }

        if (Array.isArray(language)) {
            return this._language = language[0];
        }

        return this._language = null;
    }

    set limit(limit) {
        if (typeof limit === 'object' || typeof limit === 'undefined') { //Null is type of object
            this._limit = this._defaultLimit;
            this._setSkip();
            return this._limit;
        }

        try {
            this._limit = parseInt(limit, 10);
        } catch (couldNotConvertToNumber) {
            this._limit = this._defaultLimit
        }

        this._setSkip();
        return this._limit;
    }

    set page(page) {
        if (typeof page === 'object' || typeof page === 'undefined') { //Null is type of object
            this._page = this._defaultPage;
            this._setSkip();
            return this._page;
        }

        try {
            this._page = parseInt(page, 10);
        } catch (couldNotConvertToNumber) {
            this._page = this._defaultPage
        }

        this._setSkip();
        return this._page;
    }

    _setSkip() {
        this._skip = (this.page - 1) * this.limit;
    }
}
