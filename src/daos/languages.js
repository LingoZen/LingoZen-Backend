let BaseDao = require('../daos/base');

module.exports = class LanguageDao {
    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Language LIMIT ? OFFSET ?';
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

    static getById(id) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Language WHERE idLanguage = ?';
            let queryOptions = [
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
            let query = 'INSERT INTO Language SET ?';
            let queryOptions = language;

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
            let query = 'UPDATE Language SET ? WHERE idLanguage = ?';
            let queryOptions = [
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
                let query = 'DELETE FROM Language WHERE idLanguage = ?';
                let queryOptions = [
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
