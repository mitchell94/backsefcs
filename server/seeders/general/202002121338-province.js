'use strict';
const data = require('../data/general/Province.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Province", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Province', schema: 'general'}, null, {});
    },


};
