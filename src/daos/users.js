var BaseDao = require('../daos/base');
var pSalt = "trumpWon;HOW!?;fuckYouMeAndEveryoneElseAround;FuckThisShitIGiveUp";
var bcrypt = require('bcrypt-nodejs');

module.exports = class UserDao {
    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT * FROM User LIMIT ? OFFSET ?';
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
            var query = 'SELECT * FROM User WHERE idUser = ?';
            var queryOptions = [
                //idUser
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

    static getByUsernameAndPassword(username, password) {
        return new Promise((resolve, reject) => {
            password += pSalt;
            var query = 'SELECT * FROM User WHERE `username` = ?';
            var queryOptions = [
                //username
                username
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err, results) {
                if (err) {
                    return reject(err)
                }

                if (results && results[0]) {
                    return bcrypt.compare(password, results[0].password, (err, res) => {
                        if (err) {
                            return reject(err);
                        }

                        if (res) {
                            return resolve(results[0]);
                        }

                        return reject(new Error('PASSFAIL'));
                    });
                }
                return reject(new Error("no username found"));
            });
        });
    }

    static create(user) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err);

                user.password += pSalt;
                bcrypt.hash(user.password, salt, null, (err, hashPassword) => {
                    user.password = hashPassword;

                    var query = 'INSERT INTO User SET ?';
                    var queryOptions = user;

                    return BaseDao.dbConnection.query(query, queryOptions, (err, results) => {
                        if (err) {
                            return reject(err);
                        }

                        return UserDao.getById(results.insertId).then(newUser=>resolve(newUser)).catch(err => reject(err));
                    });
                });
            });
        });
    }

    static update(id, newUser) {
        return new Promise((resolve, reject) => {
            var query = 'UPDATE User SET ? WHERE idUser = ?';
            var queryOptions = [
                // user
                newUser,
                // idUser
                id
            ];

            return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                if (err) {
                    return reject(err);
                }

                return UserDao.getById(id).then(updatedUser=>resolve(updatedUser)).catch(err => reject(err));
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            UserDao.getById(id).then((userToBeDeleted) => {
                var query = 'DELETE FROM User WHERE idUser = ?';
                var queryOptions = [
                    //idUser
                    id
                ];

                return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(userToBeDeleted);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
};
