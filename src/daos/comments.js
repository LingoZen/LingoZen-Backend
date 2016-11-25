let BaseDao = require('../daos/base');

module.exports = class CommentDao {
    static getBySentenceId(id){
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Comment WHERE idSentence = ?';
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

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Comment LIMIT ? OFFSET ?';
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
            let query = 'SELECT * FROM Comment WHERE idComment = ?';
            let queryOptions = [
                //idComment
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

    static getByDeckId(id) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Comment WHERE idDeck = ?';
            let queryOptions = [
                //idComment
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

    static create(comment) {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO Comment SET ?';
            let queryOptions = comment;

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err);
                }

                return CommentDao.getById(results.insertId).then(newComment=>resolve(newComment)).catch(err => reject(err));
            });
        });
    }

    static update(id, newComment) {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE Comment SET ? WHERE idComment = ?';
            let queryOptions = [
                // comment
                newComment,
                // idComment
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                if (err) {
                    return reject(err);
                }

                return CommentDao.getById(id).then(updatedComment=>resolve(updatedComment)).catch(err => reject(err));
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            CommentDao.getById(id).then((commentToBeDeleted) => {
                let query = 'DELETE FROM Comment WHERE idComment = ?';
                let queryOptions = [
                    //idComment
                    id
                ];

                return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(commentToBeDeleted);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
