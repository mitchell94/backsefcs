'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "User", schema: "security"},
            [
                {
                    "id": "5daa0884-be54-4359-9d93-af326967822c",
                    "id_person": null,
                    "user": "trever",
                    "pass": "$2a$11$zXMup1NXdQnvtSKrZLNiMOoV5rwhr/7yV32hYidmSXoM.MYZHzQo2",
                    "god": "t",
                    "state": "t",
                    "created_at": "2020-05-31T10:30:54.198Z",
                    "updated_at": "2020-05-31T10:30:54.198Z",
                    "deleted_at": null
                },
                // {
                //     "id": "8f37f17b-06e8-4ffd-be0b-bde2eac30186",
                //     "id_person": 1,
                //     "user": "75084857",
                //     "pass": "$2a$11$nm.bwydByjcrz2M9sivsQOUaLHSdAXW0/trJ/.VLHn.GqJmMx5rWS",
                //     "god": false,
                //     "state": true,
                //     "created_at": "2020-10-13T07:39:25.920Z",
                //     "updated_at": "2020-10-13T07:39:25.920Z",
                //     "deleted_at": null
                // }

            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'User', schema: 'security'}, null, {});
    },


};
