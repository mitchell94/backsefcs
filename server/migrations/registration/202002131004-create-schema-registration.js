'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return  queryInterface.createSchema('registration');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('registration');
    }
};
