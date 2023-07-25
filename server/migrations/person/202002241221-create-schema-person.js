'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return  queryInterface.createSchema('person');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('person');
    }
};
