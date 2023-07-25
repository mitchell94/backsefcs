'use strict';
const data = require('../data/general/Unit_measure.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Unit_measure", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Unit_measure', schema: 'general'}, null, {});
    },


};
