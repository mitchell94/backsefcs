'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Role", schema: "security"},
            [
                {
                    "id": 1,
                    "denomination": "Administrador",
                    "type": "Administrativo",
                    "state": true,
                    "created_at": "2020-05-03T20:43:06.000Z",
                    "updated_at": "2020-05-15T23:16:22.522Z",
                    "deleted_at": null
                },
                {
                    "id": 2,
                    "denomination": "Estudiante",
                    "type": "Estudiante",
                    "state": true,
                    "created_at": "2020-05-03T20:43:06.000Z",
                    "updated_at": "2020-05-15T23:16:22.720Z",
                    "deleted_at": null
                },
                {
                    "id": 3,
                    "denomination": "Docente",
                    "type": "Docente",
                    "state": true,
                    "created_at": "2020-05-03T20:43:06.000Z",
                    "updated_at": "2020-05-15T23:16:23.052Z",
                    "deleted_at": null
                },
                {
                    "id": 4,
                    "denomination": "Contabilidad",
                    "type": "Administrativo",
                    "state": true,
                    "created_at": "2020-05-12T16:57:05.000Z",
                    "updated_at": "2020-05-15T23:16:23.232Z",
                    "deleted_at": null
                },
                {
                    "id": 5,
                    "denomination": "Inscripciones",
                    "type": "Administrativo",
                    "state": true,
                    "created_at": "2020-05-12T16:57:05.000Z",
                    "updated_at": "2020-05-15T23:16:22.326Z",
                    "deleted_at": null
                },
                {
                    "id": 6,
                    "denomination": "Pagos",
                    "type": "Administrativo",
                    "state": true,
                    "created_at": "2020-05-31T10:30:54.198Z",
                    "updated_at": "2020-05-31T10:30:54.198Z",
                    "deleted_at": null
                }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Role', schema: 'security'}, null, {});
    },


};
