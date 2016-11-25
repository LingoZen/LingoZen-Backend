module.exports = class ErrorHandlerController {
    // development error handler
    // will print stacktrace
    developmentErrorHandler(err, req, res, next) {
        console.error(err);
        res.status(err.status || 500).json({error: err.message});
    }

    // production error handler
    // no stacktraces leaked to user
    productionErrorHandler(err, req, res, next) {
        console.error(err);
        res.sendStatus(err.status || 500);
    }

    default(environment) {
        switch (environment) {
            case 'development':
                return this.developmentErrorHandler;
            default:
                return this.productionErrorHandler;
        }
    }

    // catch 404 and forward to error handler
    notFound(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
};
