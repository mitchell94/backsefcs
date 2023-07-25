'use strict';
const data = require('../data/general/Academic_semester.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Academic_semester", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Academic_semester', schema: 'general'}, null, {});
    },


};
