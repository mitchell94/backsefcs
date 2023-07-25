'use strict';
const data = require('../data/general/Organic_unit_charge.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Organic_unit_charge", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Organic_unit_charge', schema: 'general'}, null, {});
    },


};
