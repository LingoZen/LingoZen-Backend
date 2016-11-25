let RequestParameters = require('../util/request-parameters').RequestParameters;
let LanguageService = require('../services/languages');

/**
 * Language Controller (Middleware)
 *
 * Takes requests from language routes (/languages/), checks the request values, and calls the appropriate service layer functions.
 * Additional security (those not put in the routes) are also done here
 */
module.exports = class LanguageController {
    static getAll(req, res, next) {
        let request = new RequestParameters(req);

        LanguageService.getAll(request.limit, request.skip).then((languages) => {
            res.send(languages);
        }).catch((err) => {
            next(err);
        });
    }

    static getById(req, res, next) {
        let request = new RequestParameters(req);

        LanguageService.getById(request.id, request.limit, request.skip).then((language) => {
            return res.send(language);
        }).catch((err) => {
            return next(err);
        });
    }

    static create(req, res, next) {
        let request = new RequestParameters(req);

        LanguageService.create(request.body).then((language) => {
            return res.send(language);
        }).catch((err) => {
            return next(err);
        });
    }

    static update(req, res, next) {
        let request = new RequestParameters(req);

        LanguageService.update(request.id, request.body, request.user.id).then((language) => {
            return res.send(language);
        }).catch((err) => {
            return next(err);
        });
    }

    static remove(req, res, next) {
        let request = new RequestParameters(req);

        LanguageService.remove(request.id, request.user.id).then((language) => {
            return res.send(language);
        }).catch((err) => {
            return next(err);
        });
    }
};
