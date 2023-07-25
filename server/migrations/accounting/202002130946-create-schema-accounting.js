'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return  queryInterface.createSchema('accounting');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('accounting');
    }
};
