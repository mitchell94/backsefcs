'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // await queryInterface.bulkInsert(
        //     {tableName: "User_role", schema: "security"},
        //     [
        //         {
        //             "id": 1,
        //             "id_user": "8f37f17b-06e8-4ffd-be0b-bde2eac30186",
        //             "id_organic_unit": 36,
        //             "id_role": 1,
        //             "state": "t",
        //             "created_at": "2020-05-31T10:30:54.198Z",
        //             "updated_at": "2020-05-31T10:30:54.198Z",
        //             "deleted_at": null
        //         },
        //
        //
        //     ]
        // )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'User_role', schema: 'security'}, null, {});
    },


};
