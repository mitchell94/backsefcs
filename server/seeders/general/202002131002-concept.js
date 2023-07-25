'use strict';
const data = require('../data/general/Concept.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Concept", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Concept', schema: 'general'}, null, {});
    },


};
