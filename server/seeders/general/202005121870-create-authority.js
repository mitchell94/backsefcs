'use strict';
const data = require('../data/general/Authority.json');
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Authority", schema: "general"},
            data.RECORDS
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Authority', schema: 'general'}, null, {});
    },


};
