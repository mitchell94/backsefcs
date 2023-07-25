'use strict';
const data = require('../data/general/Activity.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Activity", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Activity', schema: 'general'}, null, {});
    },


};
