'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Ciclo", schema: "programs"},
            [
                {
                    "id": 1,
                    "id_plan": 1,
                    "ciclo": "I",
                    "period": "1",
                    "state": true,
                    "created_at": "2020-09-12T00:24:34.506Z",
                    "updated_at": "2020-09-12T00:24:34.506Z",
                    "deleted_at": null,

                },
                {
                    "id": 2,
                    "id_plan": 1,
                    "ciclo": "II",
                    "period": "1",
                    "state": true,
                    "created_at": "2020-09-12T00:24:34.512Z",
                    "updated_at": "2020-09-12T00:24:34.512Z",
                    "deleted_at": null,

                },
                {
                    "id": 3,
                    "id_plan": 1,
                    "ciclo": "III",
                    "period": "2",
                    "state": true,
                    "created_at": "2020-09-12T00:24:34.515Z",
                    "updated_at": "2020-09-12T00:24:34.515Z",
                    "deleted_at": null,

                },
                {
                    "id": 4,
                    "id_plan": 1,
                    "ciclo": "IV",
                    "period": "2",
                    "state": true,
                    "created_at": "2020-09-12T00:24:34.519Z",
                    "updated_at": "2020-09-12T00:24:34.519Z",
                    "deleted_at": null,

                }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Ciclo', schema: 'programs'}, null, {});
    },


};
