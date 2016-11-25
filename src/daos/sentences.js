let BaseDao = require('../daos/base');
let CommentDao = require('../daos/comments');
let Bodybuilder = require('bodybuilder');
let async = require('async');

module.exports = class SentenceDao {
    static search(word) {
        return new Promise((resolve, reject) => {
            let sentences = {};
            let query = new Bodybuilder()
                .query('match', 'text', word)
                .build('v2');

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
            let translationOfQuery = new Bodybuilder()
                .query('match', 'translationOf', id)
                .build('v2');

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

                        translations = responses.hits.hits.map((translations)=> {
                            return translations._source;
                        }).filter((a) => {
                            return a;
                        });

                        cb();
                    });
                },
                function getCommentsForSentences(cb) {
                    CommentDao.getBySentenceId(id).then((comments)=> {
                        sentence.comments = comments;
                        cb();
                    }).catch((err)=> {
                        cb(err);
                    });
                },
                function getCommentsForTranslations(cb) {
                    async.each(translations, (translation) => {
                        CommentDao.getBySentenceId((translation.id)).then((comments)=> {
                            translation.comments = comments;
                            translationsWithComments.push(JSON.parse(JSON.stringify(translation)));
                            cb();
                        }).catch((err)=> {
                            cb(err);
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

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Sentence LIMIT ? OFFSET ?';
            let queryOptions = [
                //limit
                limit,
                //offset
                skip
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err)
                }

                return resolve(results);
            });
        });
    }

    static getByDeckId(id) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Sentence WHERE idDeck = ?';
            let queryOptions = [
                //idSentence
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err)
                }

                return resolve(results);
            });
        });
    }

    static create(sentence) {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Sentence SET ?';
            let queryOptions = sentence;

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err);
                }

                return SentenceDao.getById(results.insertId).then(newSentence=>resolve(newSentence)).catch(err => reject(err));
            });
        });
    }

    static update(id, newSentence) {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Sentence SET ? WHERE idSentence = ?';
            let queryOptions = [
                // sentence
                newSentence,
                // idSentence
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                if (err) {
                    return reject(err);
                }

                return SentenceDao.getById(id).then(updatedSentence=>resolve(updatedSentence)).catch(err => reject(err));
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            SentenceDao.getById(id).then((sentenceToBeDeleted) => {
                let query = 'DELETE FROM Sentence WHERE idSentence = ?';
                let queryOptions = [
                    //idSentence
                    id
                ];

                return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(sentenceToBeDeleted);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
