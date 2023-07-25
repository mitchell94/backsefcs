'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Registration', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_semester: {
                allowNull: false,
                type: Sequelize.INTEGER
            },

            id_student: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_program: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_organic_unit: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            type: {
                allowNull: true,//REGULAR (R), DIRIGIDO (D),DESAPROBADO (D), APLAZADO (A)// CONVALIDADO(C)
                type: Sequelize.STRING
            },
            number_registration: {
                allowNull: true,
                type: Sequelize.STRING
            },
            observation: {
                allowNull: true,
                type: Sequelize.STRING
            },

            state: {
                allowNull: false,
                type: Sequelize.ENUM('Registrado', 'Retirado', 'Pagado', 'Pendiente', 'No Matrículado', 'Desertado', 'Abandonado'),
                defaultValue: 'Registrado'
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
            schema: 'registration'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Registration', {schema: 'registration'});
    }
};
