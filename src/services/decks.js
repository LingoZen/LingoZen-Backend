var DeckDao = require('../daos/decks');
var SentenceDao = require('../daos/sentences');
var CommentDao = require('../daos/comments');

/**
 * Deck Service (Middleware)
 *
 */
module.exports = class DeckService {
    static creatableProperties = [
        'idUser',
        'title',
        'description'
    ];
    static propertiesRequiredToCreate = [
        'idUser',
        'title',
    ];
    static updatableProperties = [
        'title',
        'description'
    ];
    static propertiesRequiredToUpdate = [];

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            //get all decks
            DeckDao.getAll(limit, skip).then((decks) => {
                resolve(decks);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static getById(id, limit, skip) {
        return new Promise((resolve, reject) => {
            //get deck
            DeckDao.getById(id, limit, skip).then((deck) => {
                resolve(deck);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static getAllCommentsForDeck(id, limit, skip) {
        return new Promise((resolve, reject) => {
            //get deck
            CommentDao.getByDeckId(id, limit, skip).then((comment) => {
                resolve(comment);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static getAllSentencesInDeck(id, limit, skip) {
        return new Promise((resolve, reject) => {
            //get deck
            SentenceDao.getByDeckId(id, limit, skip).then((sentence) => {
                resolve(sentence);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static create(deck) {
        return new Promise((resolve, reject) => {
            var whiteListedDeck = this.createObjectFromWhiteList(deck, this.creatableProperties);
            var missingProperty;
            this.propertiesRequiredToCreate.some((property) => {
                if (!whiteListedDeck[property]) {
                    return missingProperty = property;
                }
            });

            if (missingProperty) {
                return reject(new Error('Missing Property ' + missingProperty));
            }

            return DeckDao.create(whiteListedDeck).then((decks)=> {
                resolve(decks);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static update(id, newDeck, userId) {
        return new Promise((resolve, reject) => {
            // get deck
            DeckDao.getById(id).then((deck) => {
                if (!deck) {
                    return reject(new Error('Deck not found'));
                }

                //check if deck belongs to user
                if (deck.idUser !== userId) {
                    return reject(new Error('User updating is not user that created the deck'));
                }

                var whiteListedDeck = this.createObjectFromWhiteList(newDeck, this.updatableProperties);
                var missingProperty;
                this.propertiesRequiredToUpdate.some((property) => {
                    if (!whiteListedDeck[property]) {
                        return missingProperty = property;
                    }
                });

                if (missingProperty) {
                    return reject(new Error('Missing Property ' + missingProperty));
                }

                if (!Object.keys(whiteListedDeck).length) {
                    return reject(new Error("Updating with a empty object"));
                }

                //update property
                return DeckDao.update(id, whiteListedDeck);
            }).then((decks) => {
                resolve(decks);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static remove(id, userId) {
        return new Promise((resolve, reject) => {
            //get deck
            DeckDao.getById(id).then((deck) => {
                if (!deck) {
                    return reject(new Error('deck not found'));
                }

                //check if deck belongs to user
                if (deck.idUser !== userId) {
                    return reject(Error('User deleting is not user that created'));
                }

                //remove deck
                return DeckDao.remove(id);
            }).then((deck) => {
                resolve(deck);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static createObjectFromWhiteList(object, whiteList) {
        var whiteListedObject = {};
        for (var property in object) {
            if (object.hasOwnProperty(property) && whiteList.indexOf(property) > -1) {
                whiteListedObject[property] = object[property];
            }
        }

        return whiteListedObject;
    }
};