var BaseDao = require('../daos/base');

module.exports = class SentenceDao {
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

    static getById(id) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT * FROM Sentence WHERE idSentence = ?';
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
