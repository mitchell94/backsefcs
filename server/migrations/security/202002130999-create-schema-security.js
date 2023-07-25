'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createSchema('security');
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropSchema('security');
    }
};
