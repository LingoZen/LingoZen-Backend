/**
 * Libs
 */
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require("cors");
let mysql = require('mysql');
let elasticsearch = require('elasticsearch');

/**
 * Routes
 */
let commentRoutes = require('./routes/comments');
let deckRoutes = require('./routes/decks');
let languageRoutes = require('./routes/languages');
let sentenceRoutes = require('./routes/sentences');
let userRoutes = require('./routes/users');

/**
 * Error Handler
 */
let ErrorHandlerController = require("./controllers/error-handler");
let errorHandlerController = new ErrorHandlerController();

/**
 * App Initialization
 */
let app = express();

/**
 * DAO Initialization
 */
let BaseDao = require('./daos/base');

/**
 * Start MySql Db
 */
let dbConnectionSettings;
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
let esConnectionSettings;
switch (app.get('env')) {
    case 'production':
        esConnectionSettings = {
            host: 'search-lz-es-asjzii5ehwnhh3fmzpihgvcdrq.us-east-1.es.amazonaws.com'
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
