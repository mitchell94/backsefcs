'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Plan", schema: "programs"},

            [
                {
                    "id": 1,
                    "id_program": 1,
                    "code": "EM0V7",
                    "description": "Plan 2020",
                    "credit_required": 23,
                    "credit_elective": 23,
                    "valid": true,
                    "state": true,
                    "created_at": "2020-09-12T00:52:47.441Z",
                    "updated_at": "2020-09-12T01:01:46.036Z",
                    "deleted_at": null
                }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Plan', schema: 'programs'}, null, {});
    },


};
