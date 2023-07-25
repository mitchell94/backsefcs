'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return  queryInterface.createSchema('programs');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('programs');
    }
};
