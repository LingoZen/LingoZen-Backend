let BaseDao = require('../daos/base');
let pSalt = "IYxzTM5UFNkBi3WUfpasT5by1rmcRB1FuVVHIh76XWX1XgxE8XeyRkLvTyHQ";
let bcrypt = require('bcrypt-nodejs');

module.exports = class UserDao {
    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM User LIMIT ? OFFSET ?';
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
            let query = 'SELECT * FROM User WHERE id = ?';
            let queryOptions = [
                //user
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
            let query = 'SELECT * FROM User WHERE `username` = ?';
            let queryOptions = [
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
            this.encryptPassword(user.password).then(function (hashPassword) {
                user.password = hashPassword;

                let query = 'INSERT INTO User SET ?';

                return BaseDao.dbConnection.query(query, user, (err, results) => {
                    if (err) {
                        return reject(err);
                    }

                    return UserDao.getById(results.insertId).then(newUser => resolve(newUser)).catch(err => reject(err));
                });
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    static update(id, newUser) {
        return new Promise((resolve, reject) => {
            this.encryptPassword(newUser.password).then(function (hashPassword) {
                if (newUser.password) {
                    newUser.password = hashPassword;
                }

                let query = 'UPDATE User SET ? WHERE id = ?';
                let queryOptions = [
                    // user
                    newUser,
                    // user
                    id
                ];

                return BaseDao.dbConnection.query(query, queryOptions, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    return UserDao.getById(id).then(updatedUser => resolve(updatedUser)).catch(err => reject(err));
                });
            }).catch(function (err) {
                return reject(err);
            });
        });
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            UserDao.getById(id).then((userToBeDeleted) => {
                let query = 'DELETE FROM User WHERE id = ?';
                let queryOptions = [
                    //user
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

    static encryptPassword(plaintext) {
        return new Promise((resolve, reject) => {
            if (!plaintext) {
                resolve(plaintext);
            }

            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return reject(err);
                }

                plaintext += pSalt;
                bcrypt.hash(plaintext, salt, null, (err, hashPassword) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(hashPassword);
                });
            });
        });
    }
};
