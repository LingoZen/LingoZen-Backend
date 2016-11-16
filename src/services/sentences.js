var SentenceDao = require('../daos/sentences');

/**
 * Sentence Service (Middleware)
 *
 */
module.exports = class SentenceService {
    static creatableProperties = [
        'idUser',
        'idSentence',
        'description'
    ];
    static propertiesRequiredToCreate = [
        'idUser',
        'idSentence',
        'description'
    ];
    static updatableProperties = [
        'description'
    ];
    static propertiesRequiredToUpdate = [
    ];

    static search(word) {
        return new Promise((resolve, reject) => {
            //get all sentences
            SentenceDao.search(word).then((sentences) => {
                resolve(sentences);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            //get sentence
            SentenceDao.getById(id).then((sentence) => {
                resolve(sentence);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static create(sentence) {
        return new Promise((resolve, reject) => {
            var whiteListedSentence = this.createObjectFromWhiteList(sentence, this.creatableProperties);
            var missingProperty;
            this.propertiesRequiredToCreate.some((property) => {
                if(!whiteListedSentence[property]){
                    return missingProperty = property;
                }
            });

            if(missingProperty){
                return reject(new Error('Missing Property '+ missingProperty));
            }

            return SentenceDao.create(whiteListedSentence).then((sentences)=> {
                resolve(sentences);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static update(id, newSentence, userId) {
        return new Promise((resolve, reject) => {
            // get sentence
            SentenceDao.getById(id).then((sentence) => {
                if (!sentence) {
                    return reject(new Error('Sentence not found'));
                }

                //check if sentence belongs to user
                if (sentence.idUser !== userId) {
                    return reject(new Error('User updating is not user that created the sentence'));
                }

                var whiteListedSentence = this.createObjectFromWhiteList(newSentence, this.updatableProperties);
                var missingProperty;
                this.propertiesRequiredToUpdate.some((property) => {
                    if(!whiteListedSentence[property]){
                        return missingProperty = property;
                    }
                });

                if(missingProperty){
                    return reject(new Error('Missing Property '+ missingProperty));
                }

                if(!Object.keys(whiteListedSentence).length){
                    return reject(new Error("Updating with a empty object"));
                }

                //update property
                return SentenceDao.update(id, whiteListedSentence);
            }).then((sentences) => {
                resolve(sentences);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    static remove(id, userId) {
        return new Promise((resolve, reject) => {
            //get sentence
            SentenceDao.getById(id).then((sentence) => {
                if (!sentence) {
                    return reject(new Error('sentence not found'));
                }

                //check if sentence belongs to user
                if (sentence.idUser !== userId) {
                    return reject(Error('User deleting is not user that created'));
                }

                //remove sentence
                return SentenceDao.remove(id);
            }).then((sentence) => {
                resolve(sentence);
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
