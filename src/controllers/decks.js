let RequestParameters = require('../util/request-parameters').RequestParameters;
let DeckService = require('../services/decks');

/**
 * Deck Controller (Middleware)
 *
 * Takes requests from deck routes (/decks/), checks the request values, and calls the appropriate service layer functions.
 * Additional security (those not put in the routes) are also done here
 */
module.exports = class DeckController {
    static getAll(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.getAll(request.limit, request.skip).then((decks) => {
            res.send(decks);
        }).catch((err) => {
            next(err);
        });
    }

    static getById(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.getById(request.id, request.limit, request.skip).then((deck) => {
            return res.send(deck);
        }).catch((err) => {
            return next(err);
        });
    }

    static getAllSentencesInDeck(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.getAllSentencesInDeck(request.id, request.limit, request.skip).then((deck) => {
            return res.send(deck);
        }).catch((err) => {
            return next(err);
        });
    }

    static getAllCommentsForDeck(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.getAllCommentsForDeck(request.id, request.limit, request.skip).then((deck) => {
            return res.send(deck);
        }).catch((err) => {
            return next(err);
        });
    }

    static create(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.create(request.body).then((deck) => {
            return res.send(deck);
        }).catch((err) => {
            return next(err);
        });
    }

    static update(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.update(request.id, request.body, request.user.id).then((deck) => {
            return res.send(deck);
        }).catch((err) => {
            return next(err);
        });
    }

    static remove(req, res, next) {
        let request = new RequestParameters(req);

        DeckService.remove(request.id, request.user.id).then((deck) => {
            return res.send(deck);
        }).catch((err) => {
            return next(err);
        });
    }
};
