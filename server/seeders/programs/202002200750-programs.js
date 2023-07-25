'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Programs", schema: "programs"},
            [
                {
                    "id": 1,
                    "id_unit_organic_origin": 28,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 3,
                    "code": "SA4343",
                    "denomination": "Maestría en Ciencias de la Educación con Mención en Tutoría y Orientación Educativa ",
                    "description": "La maestríaS Maestría en Ciencias de la Educación con Mención en Tutoría y Orientación Educativa  Maestría en Ciencias de la Educación con Mención en Tutoría y Orientación Educativa  Maestría en Ciencias de la Educación con Mención en Tutoría y Orientación Educativa  Maestría en Ciencias de la Educación con Mención en Tutoría y Orientación Educativa  Maestría en Ciencias de la Educación con Mención en Tutoría y Orientación Educativa ",
                    "online": "t",
                    "state": "t",
                    "created_at": "25/8/2020 15:02:53-05:05",
                    "updated_at": "1/10/2020 02:26:52.614-05:05",
                    "deleted_at": null
                },
                {
                    "id": 2,
                    "id_unit_organic_origin": 72,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 2,
                    "code": "DA3423",
                    "denomination": "Maestría en Ciencias Económicas con mención en Gestión Empresarial",
                    "description": "algo aqui",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 01:56:32.126-05:05",
                    "updated_at": "1/10/2020 02:04:54.364-05:05",
                    "deleted_at": null
                },
                {
                    "id": 3,
                    "id_unit_organic_origin": 31,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 3,
                    "code": "F443WW",
                    "denomination": "Maestría en Salud Publica",
                    "description": "asdfasd",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 01:58:48.419-05:05",
                    "updated_at": "1/10/2020 02:09:12.989-05:05",
                    "deleted_at": null
                },
                {
                    "id": 4,
                    "id_unit_organic_origin": 35,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 2,
                    "code": "3C4FQ3",
                    "denomination": "Mestría en tutoria y orientacion vocacional",
                    "description": "fsdfdsasdf",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:18:27.46-05:05",
                    "updated_at": "1/10/2020 02:18:27.46-05:05",
                    "deleted_at": null
                },
                {
                    "id": 5,
                    "id_unit_organic_origin": 28,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 2,
                    "code": "W34Q34",
                    "denomination": "Mestría Ciencias con mención en Gestion Ambiental",
                    "description": "sdfsdf",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:25:45.956-05:05",
                    "updated_at": "1/10/2020 02:25:59.526-05:05",
                    "deleted_at": null
                },

                {
                    "id": 6,
                    "id_unit_organic_origin": 28,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 4,
                    "code": "W4C343",
                    "denomination": "Doctorado en producción vegetal y ecosistemas Agroforestales",
                    "description": "dsddd",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:27:45.444-05:05",
                    "updated_at": "1/10/2020 02:27:45.444-05:05",
                    "deleted_at": null
                },
                {
                    "id": 7,
                    "id_unit_organic_origin": 28,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 4,
                    "code": "F434W",
                    "denomination": "Doctorado en Gestión Universitaria",
                    "description": "dfgsdfgsd",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:28:05.919-05:05",
                    "updated_at": "1/10/2020 02:28:05.919-05:05",
                    "deleted_at": null
                },
                {
                    "id": 8,
                    "id_unit_organic_origin": 28,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 3,
                    "code": "34Q34Q",
                    "denomination": "Doctorado en ciencias ambinetales",
                    "description": "sdfsdf",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:28:41.169-05:05",
                    "updated_at": "1/10/2020 02:28:41.169-05:05",
                    "deleted_at": null
                },
                {
                    "id": 9,
                    "id_unit_organic_origin": 29,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 4,
                    "code": "4F2342",
                    "denomination": "Doctorado en gestión empresarial",
                    "description": "asdf",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:29:10.507-05:05",
                    "updated_at": "1/10/2020 02:29:10.507-05:05",
                    "deleted_at": null
                },
                {
                    "id": 10,
                    "id_unit_organic_origin": 35,
                    "id_unit_organic_register": 155,
                    "id_academic_degree": 4,
                    "code": "D34Q32",
                    "denomination": "Doctorado en ciencias de la educación",
                    "description": "asdfsdf",
                    "online": "f",
                    "state": "t",
                    "created_at": "1/10/2020 02:29:47.751-05:05",
                    "updated_at": "1/10/2020 02:29:47.751-05:05",
                    "deleted_at": null
                }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Programs', schema: 'programs'}, null, {});
    },


};
