var BaseDao = require('../daos/base');

module.exports = class DeckDao {
    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT * FROM Deck LIMIT ? OFFSET ?';
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
            var query = 'SELECT * FROM Deck WHERE idDeck = ?';
            var queryOptions = [
                //idDeck
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err)
                }

                return resolve(results[0]);
            });
        });
    }

    static create(deck) {
        return new Promise((resolve, reject) => {
            var query = 'INSERT INTO Deck SET ?';
            var queryOptions = deck;

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err);
                }

                return DeckDao.getById(results.insertId).then(newDeck=>resolve(newDeck)).catch(err => reject(err));
            });
        });
    }

    static update(id, newDeck) {
        return new Promise((resolve, reject) => {
            var query = 'UPDATE Deck SET ? WHERE idDeck = ?';
            var queryOptions = [
                // deck
                newDeck,
                // idDeck
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                if (err) {
                    return reject(err);
                }

                return DeckDao.getById(id).then(updatedDeck=>resolve(updatedDeck)).catch(err => reject(err));
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            DeckDao.getById(id).then((deckToBeDeleted) => {
                var query = 'DELETE FROM Deck WHERE idDeck = ?';
                var queryOptions = [
                    //idDeck
                    id
                ];

                return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(deckToBeDeleted);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
