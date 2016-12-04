let SentenceDao = require('../daos/sentences');

/**
 * Sentence Service (Middleware)
 */
module.exports = class SentenceService {
    static creatableProperties = [
        'user',
        'sentence',
        'description'
    ];
    static propertiesRequiredToCreate = [
        'user',
        'sentence',
        'description'
    ];
    static updatableProperties = [
        'description'
    ];
    static propertiesRequiredToUpdate = [];

    static search(word) {
        return new Promise((resolve, reject) => {
            if (!word) {
                return reject('Search query not specified');
            }

            //get all sentences
            SentenceDao.search(word).then((sentences) => {
                resolve(sentences);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            //get sentence
            SentenceDao.getById(id).then((sentence) => {
                resolve(sentence);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static create(sentence) {
        return new Promise((resolve, reject) => {
            if (!sentence.text) {
                return reject('sentence.text is undefined');
            }

            if (!sentence.language) {
                return reject('sentence.language isnt defined')
            }

            sentence.addedDate = new Date();
            sentence.lastModifiedDate = new Date();

            SentenceDao.create(sentence).then(sentenceObjectWithJustId => {
                this.getById(sentenceObjectWithJustId.id).then(sentenceObjectWithEverything => resolve(sentenceObjectWithEverything));
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
