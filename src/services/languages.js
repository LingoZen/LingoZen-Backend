let LanguageDao = require('../daos/languages');

/**
 * Language Service (Middleware)
 *
 */
module.exports = class LanguageService {
    static creatableProperties = [
        'name',
        'englishName'
    ];
    static propertiesRequiredToCreate = [
        'name',
        'englishName'
    ];
    static updatableProperties = [
        'name',
        'englishName'
    ];
    static propertiesRequiredToUpdate = [
    ];

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            //get all languages
            LanguageDao.getAll(limit, skip).then((languages) => {
                resolve(languages);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static getById(id, limit, skip) {
        return new Promise((resolve, reject) => {
            //get language
            LanguageDao.getById(id, limit, skip).then((language) => {
                resolve(language);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static create(language) {
        return new Promise((resolve, reject) => {
            let whiteListedLanguage = this.createObjectFromWhiteList(language, this.creatableProperties);
            let missingProperty;
            this.propertiesRequiredToCreate.some((property) => {
                if(!whiteListedLanguage[property]){
                    return missingProperty = property;
                }
            });

            if(missingProperty){
                return reject(new Error('Missing Property '+ missingProperty));
            }

            return LanguageDao.create(whiteListedLanguage).then((languages)=> {
                resolve(languages);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static update(id, newLanguage, userId) {
        return new Promise((resolve, reject) => {
            // get language
            LanguageDao.getById(id).then((language) => {
                if (!language) {
                    return reject(new Error('Language not found'));
                }

                let whiteListedLanguage = this.createObjectFromWhiteList(newLanguage, this.updatableProperties);
                let missingProperty;
                this.propertiesRequiredToUpdate.some((property) => {
                    if(!whiteListedLanguage[property]){
                        return missingProperty = property;
                    }
                });

                if(missingProperty){
                    return reject(new Error('Missing Property '+ missingProperty));
                }

                if(!Object.keys(whiteListedLanguage).length){
                    return reject(new Error("Updating with a empty object"));
                }

                //update property
                return LanguageDao.update(id, whiteListedLanguage);
            }).then((languages) => {
                resolve(languages);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static remove(id, userId) {
        return new Promise((resolve, reject) => {
            //get language
            LanguageDao.getById(id).then((language) => {
                if (!language) {
                    return reject(new Error('language not found'));
                }

                //remove language
                return LanguageDao.remove(id);
            }).then((language) => {
                resolve(language);
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
