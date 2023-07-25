'use strict';
const data = require('../data/general/Campus.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Campus", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Campus', schema: 'general'}, null, {});
    },


};
