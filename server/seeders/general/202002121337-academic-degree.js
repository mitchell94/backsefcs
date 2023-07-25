'use strict';
const data = require('../data/general/Academic_degree.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Academic_degree", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Academic_degree', schema: 'general'}, null, {});
    },


};
