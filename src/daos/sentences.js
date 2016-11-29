let BaseDao = require('../daos/base');
let CommentDao = require('../daos/comments');
let async = require('async');
let uuid = require('node-uuid');

module.exports = class SentenceDao {
    static search(word) {
        return new Promise((resolve, reject) => {
            let sentences = {};
            let query = JSON.stringify({
                query: {
                    query_string: {
                        default_field: 'text',
                        query: word,
                        analyze_wildcard: true
                    }
                }
            });

            BaseDao.esClient.search({
                index: '_all',
                body: query
            }, function (error, response) {
                if (error) {
                    return reject(error);
                }

                let hits = response.hits && response.hits.hits;
                if (hits && hits.length) {
                    hits.forEach((hit) => {
                        if (!sentences[hit._source.language]) {
                            sentences[hit._source.language] = [];
                        }

                        sentences[hit._source.language].push(hit._source);
                    });
                }

                return resolve(sentences);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            let translationOfQuery = JSON.stringify({
                query: {
                    match: {
                        translationOf: id
                    }
                }
            });

            let sentence = {};
            let translations = [];
            let translationsWithComments = [];
            let index = 'lingozen-' + id.split('_')[0];

            async.series([
                function getSentenceFromEs(cb) {
                    BaseDao.esClient.get({
                        index: index,
                        type: 'sentence',
                        id: id
                    }, (error, response) => {
                        if (error) {
                            return cb(error);
                        }

                        sentence = response._source;
                        cb();
                    });
                },
                function getTranslations(cb) {
                    BaseDao.esClient.search({
                        index: '_all',
                        type: 'sentence',
                        body: translationOfQuery
                    }, (err, responses) => {
                        if (err) {
                            return cb(err);
                        }

                        translations = responses.hits.hits.map((translations) => {
                            return translations._source;
                        }).filter((a) => {
                            return a;
                        });

                        cb();
                    });
                },
                function getCommentsForSentences(cb) {
                    CommentDao.getBySentenceId(id).then((comments) => {
                        sentence.comments = comments;
                        cb();
                    }).catch((err) => {
                        cb(err);
                    });
                },
                function getCommentsForTranslations(cb) {
                    async.each(translations, (translation, iteratorCb) => {
                        CommentDao.getBySentenceId((translation.id)).then((comments) => {
                            translation.comments = comments;
                            translationsWithComments.push(JSON.parse(JSON.stringify(translation)));
                            iteratorCb();
                        }).catch((err) => {
                            iteratorCb(err);
                        });
                    }, (comments, err) => {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                }
            ], function (err) {
                if (err) {
                    return reject(err);
                }

                sentence.translations = translationsWithComments;

                return resolve(sentence);
            });
        });
    }

    static getByDeckId(id) {
        return new Promise((resolve, reject) => {
            reject('NOT DONE');
        });
    }

    static create(sentence) {
        return new Promise((resolve, reject) => {
            if(!sentence.language){
                return reject('sentence.language not defined');
            }

            let index = 'lingozen-' + sentence.language;
            let id = `${sentence.language}_${uuid.v4()}`;
            BaseDao.esClient.create({
                index: index,
                type: 'sentence',
                id: id,
                body: sentence
            }, (error, response) => {
                if (error) {
                    return reject(error);
                }

                resolve(response._source);
            });
        });
    }

    static update(id, newSentence) {
        return new Promise((resolve, reject) => {
            reject('NOT DONE');
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            reject('NOT DONE');
        });
    }
};
