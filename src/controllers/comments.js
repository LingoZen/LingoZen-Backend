var RequestParameters = require('../util/request-parameters').RequestParameters;
var CommentService = require('../services/comments');

/**
 * Comment Controller (Middleware)
 *
 * Takes requests from comment routes (/comments/), checks the request values, and calls the appropriate service layer functions.
 * Additional security (those not put in the routes) are also done here
 */
module.exports = class CommentController {
    static getAll(req, res, next) {
        let request = new RequestParameters(req);

        CommentService.getAll(request.limit, request.skip).then((comments) => {
            res.send(comments);
        }).catch((err) => {
            next(err);
        });
    }

    static getById(req, res, next) {
        let request = new RequestParameters(req);

        CommentService.getById(request.id, request.limit, request.skip).then((comment) => {
            return res.send(comment);
        }).catch((err) => {
            return next(err);
        });
    }

    static create(req, res, next) {
        let request = new RequestParameters(req);

        CommentService.create(request.body).then((comment) => {
            return res.send(comment);
        }).catch((err) => {
            return next(err);
        });
    }

    static update(req, res, next) {
        let request = new RequestParameters(req);

        CommentService.update(request.id, request.body, request.user.id).then((comment) => {
            return res.send(comment);
        }).catch((err) => {
            return next(err);
        });
    }

    static remove(req, res, next) {
        let request = new RequestParameters(req);

        CommentService.remove(request.id, request.user.id).then((comment) => {
            return res.send(comment);
        }).catch((err) => {
            return next(err);
        });
    }
};
