let CommentDao = require('../daos/comments');

/**
 * Comment Service (Middleware)
 *
 */
module.exports = class CommentService {
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
    static propertiesRequiredToUpdate = [
    ];

    static getAll(limit, skip) {
        return new Promise((resolve, reject) => {
            //get all comments
            CommentDao.getAll(limit, skip).then((comments) => {
                resolve(comments);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static getById(id, limit, skip) {
        return new Promise((resolve, reject) => {
            //get comment
            CommentDao.getById(id, limit, skip).then((comment) => {
                resolve(comment);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static create(comment) {
        return new Promise((resolve, reject) => {
            let whiteListedComment = this.createObjectFromWhiteList(comment, this.creatableProperties);
            let missingProperty;
            this.propertiesRequiredToCreate.some((property) => {
                if(!whiteListedComment[property]){
                    return missingProperty = property;
                }
            });

            if(missingProperty){
                return reject(new Error('Missing Property '+ missingProperty));
            }

            return CommentDao.create(whiteListedComment).then((comments)=> {
                resolve(comments);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static update(id, newComment, userId) {
        return new Promise((resolve, reject) => {
            // get comment
            CommentDao.getById(id).then((comment) => {
                if (!comment) {
                    return reject(new Error('Comment not found'));
                }

                //check if comment belongs to user
                if (comment.user !== userId) {
                    return reject(new Error('User updating is not user that created the comment'));
                }

                let whiteListedComment = this.createObjectFromWhiteList(newComment, this.updatableProperties);
                let missingProperty;
                this.propertiesRequiredToUpdate.some((property) => {
                    if(!whiteListedComment[property]){
                        return missingProperty = property;
                    }
                });

                if(missingProperty){
                    return reject(new Error('Missing Property '+ missingProperty));
                }

                if(!Object.keys(whiteListedComment).length){
                    return reject(new Error("Updating with a empty object"));
                }

                //update property
                return CommentDao.update(id, whiteListedComment);
            }).then((comments) => {
                resolve(comments);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static remove(id, userId) {
        return new Promise((resolve, reject) => {
            //get comment
            CommentDao.getById(id).then((comment) => {
                if (!comment) {
                    return reject(new Error('comment not found'));
                }

                //check if comment belongs to user
                if (comment.user !== userId) {
                    return reject(Error('User deleting is not user that created'));
                }

                //remove comment
                return CommentDao.remove(id);
            }).then((comment) => {
                resolve(comment);
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
