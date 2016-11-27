let RequestParameters = require('../util/request-parameters').RequestParameters;
let UserService = require('../services/users');

/**
 * User Controller (Middleware)
 *
 * Takes requests from user routes (/users/), checks the request values, and calls the appropriate service layer functions.
 * Additional security (those not put in the routes) are also done here
 */
module.exports = class UserController {
    static getAll(req, res, next) {
        let request = new RequestParameters(req);

        UserService.getAll(request.limit, request.skip).then((users) => {
            res.send(users);
        }).catch((err) => {
            next(err);
        });
    }

    static getById(req, res, next) {
        let request = new RequestParameters(req);

        UserService.getById(request.id).then((user) => {
            return res.send(user);
        }).catch((err) => {
            return next(err);
        });
    }

    static create(req, res, next) {
        let request = new RequestParameters(req);

        UserService.create(request.body).then((user) => {
            return res.send(user);
        }).catch((err) => {
            return next(err);
        });
    }

    static login(req, res, next) {
        let request = new RequestParameters(req);

        UserService.login(request.body.username, request.body.password).then((user) => {
            return res.send(user);
        }).catch((err) => {
            return next(err);
        });
    }

    static update(req, res, next) {
        let request = new RequestParameters(req);

        UserService.update(request.id, request.body, request.idUser).then((user) => {
            return res.send(user);
        }).catch((err) => {
            return next(err);
        });
    }

    static updateJwtUser(req, res, next) {
        let request = new RequestParameters(req);

        UserService.update(request.idUser, request.body, request.idUser).then((user) => {
            return res.send(user);
        }).catch((err) => {
            return next(err);
        });
    }

    static remove(req, res, next) {
        let request = new RequestParameters(req);

        UserService.remove(request.id, request.user.id).then((user) => {
            return res.send(user);
        }).catch((err) => {
            return next(err);
        });
    }
};
