let UserDao = require('../daos/users');
let jwt = require('jsonwebtoken');
let jwtSig = "aDK8GpfJcpE62ECazxs44q8hxoX2o79VHb66J7c9MKEkW7ZTE8lHHvXOK7MS";

/**
 * User Service (Middleware)
 */
module.exports = class UserService {
    static creatableProperties = [
        'username',
        'password',
        'email'
    ];
    static propertiesRequiredToCreate = [
        'username',
        'password',
        'email'
    ];
    static updatableProperties = [
        'username',
        'password',
        'email'
    ];
    static propertiesRequiredToUpdate = [];

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            //get all users
            UserDao.getAll(limit, skip).then((users) => {
                resolve(users);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            //get user
            UserDao.getById(id).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static login(username, password) {
        return new Promise((resolve, reject) => {
            UserDao.getByUsernameAndPassword(username, password).then((user) => {
                if (user) {
                    user.jwt = jwt.sign(user, jwtSig);
                    return resolve({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        jwt: user.jwt
                    });
                }

                return reject(new Error('No user founds'));
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static create(user) {
        return new Promise((resolve, reject) => {
            let whiteListedUser = this.createObjectFromWhiteList(user, this.creatableProperties);
            let missingProperty;
            this.propertiesRequiredToCreate.some((property) => {
                if (!whiteListedUser[property]) {
                    return missingProperty = property;
                }
            });

            if (missingProperty) {
                return reject(new Error('Missing Property ' + missingProperty));
            }

            return UserDao.create(whiteListedUser).then((user) => {
                user.jwt = jwt.sign(user, jwtSig);
                return resolve({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    jwt: user.jwt
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static update(userId, newUser, idOfUserRequestingTheUpdate) {
        return new Promise((resolve, reject) => {
            if (idOfUserRequestingTheUpdate !== userId) {
                return reject("You cannot update someone else's user profile");
            }

            // get user
            UserDao.getById(userId).then((user) => {
                if (!user) {
                    return reject(new Error('User not found'));
                }

                let whiteListedUser = this.createObjectFromWhiteList(newUser, this.updatableProperties);
                let missingProperty;
                this.propertiesRequiredToUpdate.some((property) => {
                    if (!whiteListedUser[property]) {
                        return missingProperty = property;
                    }
                });

                if (missingProperty) {
                    return reject(new Error('Missing Property ' + missingProperty));
                }

                if (!Object.keys(whiteListedUser).length) {
                    return reject(new Error("Updating with a empty object"));
                }

                if (whiteListedUser.password && whiteListedUser.password === '') {
                    delete whiteListedUser.password;
                }

                //update property
                return UserDao.update(userId, whiteListedUser);
            }).then((users) => {
                resolve(users);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static remove(id, userId) {
        return new Promise((resolve, reject) => {
            //get user
            UserDao.getById(id).then((user) => {
                if (!user) {
                    return reject(new Error('user not found'));
                }

                //remove user
                return UserDao.remove(id);
            }).then((user) => {
                resolve(user);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static createObjectFromWhiteList(object, whiteList) {
        let whiteListedObject = {};
        for (let property in object) {
            if (object.hasOwnProperty(property) && whiteList.indexOf(property) > -1) {
                whiteListedObject[property] = object[property];
            }
        }

        return whiteListedObject;
    }
};
