/**
 * Libs
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");
var mysql = require('mysql');
var elasticsearch = require('elasticsearch');

/**
 * Routes
 */
var commentRoutes = require('./routes/comments');
var deckRoutes = require('./routes/decks');
var languageRoutes = require('./routes/languages');
var sentenceRoutes = require('./routes/sentences');
var userRoutes = require('./routes/users');

/**
 * Error Handler
 */
var ErrorHandlerController = require("./controllers/error-handler");
var errorHandlerController = new ErrorHandlerController();

/**
 * App Initialization
 */
var app = express();

/**
 * DAO Initialization
 */
var BaseDao = require('./daos/base');

/**
 * Start MySql Db
 */
var dbConnectionSettings;
switch (app.get('env')) {
    case 'production':
        dbConnectionSettings = {
            host: 'lzdbinst.chwoxmanchdt.us-east-1.rds.amazonaws.com',
            port: 3306,
            user: 'lzMaster',
            password: 'fuckmylife',
            database: 'LingoZen'
        };
        break;
    case 'development':
    default:
        dbConnectionSettings = {
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'LingoZen'
        };
        break;
}

BaseDao.dbConnection = mysql.createConnection(dbConnectionSettings);
BaseDao.dbConnection.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.info("Connected to MySQL DB Successfully");
    }
});

/**
 * Start ES
 */
var esConnectionSettings;
switch (app.get('env')) {
    case 'production':
        esConnectionSettings = {
            host: 'search-lz-es-asjzii5ehwnhh3fmzpihgvcdrq.us-east-1.es.amazonaws.com:9200'
        };
        break;
    case 'development':
    default:
        esConnectionSettings = {
            host: 'localhost:9200'
        };
        break;
}

BaseDao.esClient = new elasticsearch.Client(esConnectionSettings);
BaseDao.esClient.ping((err) => {
    if (err) {
        console.error(err);
    } else {
        console.info("Connected to ES Successfully");
    }
});

/**
 * Pre-Routes
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

/**
 * Main Routes
 */
app.use('/comments', commentRoutes);
app.use('/decks', deckRoutes);
app.use('/languages', languageRoutes);
app.use('/sentences', sentenceRoutes);
app.use('/users', userRoutes);

/**
 * Error Routes
 */
app.use(errorHandlerController.notFound);
app.use(errorHandlerController.default(app.get('env')));

/**
 * Export for starting in server
 */
module.exports = app;
