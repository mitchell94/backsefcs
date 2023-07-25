'use strict';
const data = require('../data/general/Academic_calendar.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Academic_calendar", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Academic_calendar', schema: 'general'}, null, {});
    },


};
