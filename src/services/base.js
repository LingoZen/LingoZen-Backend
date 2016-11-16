/**
 * Base Service Interface (...sort of - see BaseController ocmment for why this ia and isnt a interface)
 *
 * Defines the functions that a service must implement. These functions are very common and used in most all (if not all) controllers
 */
module.exports = class BaseService {
    getAll() {
        throw new Error(`Unimplemented function getAll() called in BaseService`);
    }

    getById() {
        throw new Error(`Unimplemented function getById() called in BaseService`);
    }

    create() {
        throw new Error(`Unimplemented function create() called in BaseService`);
    }

    update() {
        throw new Error(`Unimplemented function update() called in BaseService`);
    }

    remove() {
        throw new Error(`Unimplemented function delete() called in BaseService`);
    }
};
