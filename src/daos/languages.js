var BaseDao = require('../daos/base');

module.exports = class LanguageDao {
    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT * FROM Language LIMIT ? OFFSET ?';
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
            var query = 'SELECT * FROM Language WHERE idLanguage = ?';
            var queryOptions = [
                //idLanguage
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

    static create(language) {
        return new Promise((resolve, reject) => {
            var query = 'INSERT INTO Language SET ?';
            var queryOptions = language;

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err);
                }

                return LanguageDao.getById(results.insertId).then(newLanguage=>resolve(newLanguage)).catch(err => reject(err));
            });
        });
    }

    static update(id, newLanguage) {
        return new Promise((resolve, reject) => {
            var query = 'UPDATE Language SET ? WHERE idLanguage = ?';
            var queryOptions = [
                // language
                newLanguage,
                // idLanguage
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                if (err) {
                    return reject(err);
                }

                return LanguageDao.getById(id).then(updatedLanguage=>resolve(updatedLanguage)).catch(err => reject(err));
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            LanguageDao.getById(id).then((languageToBeDeleted) => {
                var query = 'DELETE FROM Language WHERE idLanguage = ?';
                var queryOptions = [
                    //idLanguage
                    id
                ];

                return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(languageToBeDeleted);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
