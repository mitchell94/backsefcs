'use strict';
const data = require('../data/general/Building_organic_unit.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Building_organic_unit", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Building_organic_unit', schema: 'general'}, null, {});
    },


};
