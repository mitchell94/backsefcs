'use strict';
const data = require('../data/general/Organic_unit.json');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Organic_unit", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Organic_unit', schema: 'general'}, null, {});
    },


};
