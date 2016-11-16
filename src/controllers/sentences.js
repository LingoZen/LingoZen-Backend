/**
 * Sentence Controller (Middleware)
 *
 * Takes requests from sentence routes (/sentence/), checks the request values, and calls the appropriate service layer functions.
 * Additional security (those not put in the routes) are also done here
 */
module.exports = class SentenceController {
    getAll(req, res, next) {
        var request = new RequestParameters(req);

        return next(`function is not yet implemented`);
    }

    getById(req, res, next) {
        var request = new RequestParameters(req);

        return next(`function is not yet implemented`);
    }

    getAllCommentsForSentence(req, res, next) {
        var request = new RequestParameters(req);

        return next(`function is not yet implemented`);
    }

    create(req, res, next) {
        var request = new RequestParameters(req);

        return next(`function is not yet implemented`);
    }

    update(req, res, next) {
        var request = new RequestParameters(req);

        return next(`function is not yet implemented`);
    }

    remove(req, res, next) {
        var request = new RequestParameters(req);

        return next(`function is not yet implemented`);
    }
};
