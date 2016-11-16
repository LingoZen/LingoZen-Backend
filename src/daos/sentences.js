var BaseDao = require('../daos/base');
var Bodybuilder = require('bodybuilder');
var async = require('async');

module.exports = class SentenceDao {
    static search(word) {
        return new Promise((resolve, reject) => {
            return BaseDao.esClient.cat.indices({
                h: 'index'
            }, function (err, response) {
                if (err) {
                    return reject(err);
                }

                var indices = response.split('\n').filter((index)=> {
                    return index && index.length
                });


                var sentences = {};
                async.each(indices, function (index, cb) {
                    var query = new Bodybuilder()
                        .query('match', 'text', word)
                        .build('v2');

                    BaseDao.esClient.search({
                        index: index,
                        body: query
                    }, function (error, response) {
                        if (error) {
                            return cb(error);
                        }

                        var hits = response.hits && response.hits.hits;
                        if (hits && hits.length) {
                            sentences[index.split('-')[1]] = hits;
                        }

                        cb();
                    });
                }, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(sentences);
                });
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            //first we need to get tje sentence from the id.
            var languagePrefix = id.split("_")[0];

            return BaseDao.esClient.indices.exists({
                index: 'lingozen-' + languagePrefix
            }, function (err, response) {
                if (err) {
                    return reject(err);
                }

                if (!response) {
                    return reject(new Error(`Language ${languagePrefix} doesn't exist`));
                }

                BaseDao.esClient.get({
                    index: 'lingozen-' + languagePrefix,
                    type: 'sentence',
                    id: id
                }, function (error, response) {
                    if (error) {
                        return reject(error);
                    }

                    console.log('the response was ', response._source);

                    resolve(response._source);
                });
            });
        });
    }

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT * FROM Sentence LIMIT ? OFFSET ?';
            var queryOptions = [
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
            var query = 'SELECT * FROM Sentence WHERE idDeck = ?';
            var queryOptions = [
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
            var query = 'INSERT INTO Sentence SET ?';
            var queryOptions = sentence;

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
            var query = 'UPDATE Sentence SET ? WHERE idSentence = ?';
            var queryOptions = [
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
                var query = 'DELETE FROM Sentence WHERE idSentence = ?';
                var queryOptions = [
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
