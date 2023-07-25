'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return  queryInterface.createSchema('general');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('general');
    }
};
