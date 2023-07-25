'use strict';
const data = require('../data/general/System_configuration.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "System_configuration", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'System_configuration', schema: 'general'}, null, {});
    },


};
