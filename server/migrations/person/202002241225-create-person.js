'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Person', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_identification_document: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 1
            },

            id_civil_status: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_ubigeo_birth: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_ubigeo_resident: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_nationality: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 85
            },
            // id_type_document_number: {
            //     allowNull: true,
            //     type: Sequelize.INTEGER
            // },
            photo: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            code: {
                allowNull: true,
                type: Sequelize.STRING(10)
            },
            document_number: {
                allowNull: false,
                type: Sequelize.STRING(15)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(60)
            },
            paternal: {
                allowNull: true,
                type: Sequelize.STRING(60)
            },
            maternal: {
                allowNull: true,
                type: Sequelize.STRING(60)
            },
            gender: {
                allowNull: true,
                type: Sequelize.ENUM('Masculino', 'Femenino')
            },
            birth_date: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            phone: {
                allowNull: true,
                type: Sequelize.STRING(12)
            },
            cell_phone: {
                allowNull: true,
                type: Sequelize.STRING(12)
            },
            address: {
                allowNull: true,
                type: Sequelize.STRING(150)
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING(150)
            },
            student_state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            teacher_state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            administrative_state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },

            just_last_name: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        }, {
            schema: 'person'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Person', {schema: 'person'});
    }
};
