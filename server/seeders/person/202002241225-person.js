'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Person", schema: "person"},
            [
                // {
                //     "id": 1,
                //     "id_civil_status": null,
                //     "id_ubigeo_birth": null,
                //     "id_ubigeo_resident": null,
                //     "photo": null,
                //     "email": "jm.18.da@gmail.com",
                //     "document_number": "75084857",
                //     "name": "José Manuel",
                //     "paternal": "Diaz",
                //     "maternal": "Ayala",
                //     "gender": null,
                //     "birth_date": null,
                //     "phone": null,
                //     "cell_phone": null,
                //     "address": null,
                //     "student_state": false,
                //     "teacher_state": false,
                //     "administrative_state": false,
                //     "state": true,
                //     "created_at": "2020-10-13T07:39:25.909Z",
                //     "updated_at": "2020-10-13T07:39:25.909Z",
                //     "deleted_at": null
                // }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Person', schema: 'person'}, null, {});
    },


};
