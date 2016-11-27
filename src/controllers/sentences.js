let RequestParameters = require('../util/request-parameters').RequestParameters;
let SentenceService = require('../services/sentences');

/**
 * Sentence Controller (Middleware)
 *
 * Takes requests from sentence routes (/sentences/), checks the request values, and calls the appropriate service layer functions.
 * Additional security (those not put in the routes) are also done here
 */
module.exports = class SentenceController {
    static search(req, res, next) {
        let request = new RequestParameters(req);

        SentenceService.search(request.search || '*').then((sentences) => {
            res.send(sentences);
        }).catch((err) => {
            next(err);
        });
    }

    static getById(req, res, next) {
        let request = new RequestParameters(req);

        SentenceService.getById(request.id).then((sentence) => {
            return res.send(sentence);
        }).catch((err) => {
            return next(err);
        });
    }

    static addTranslation(req, res, next) {
        let request = new RequestParameters(req);
        request.body.idUser = request.idUser;
        request.body.translationOf = request.id;

        SentenceService.create(request.body).then((sentence) => {
            return res.send(sentence);
        }).catch((err) => {
            return next(err);
        });
    }

    static create(req, res, next) {
        let request = new RequestParameters(req);
        request.body.idUser = request.idUser;

        SentenceService.create(request.body).then((sentence) => {
            return res.send(sentence);
        }).catch((err) => {
            return next(err);
        });
    }
};
