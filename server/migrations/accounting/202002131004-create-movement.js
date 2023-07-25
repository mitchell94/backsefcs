'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Movement', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
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
            id_user: {
                allowNull: true,
                type: Sequelize.UUID
            },
            denomination: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            voucher_code: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            voucher_amount: {
                allowNull: true,
                type: Sequelize.NUMERIC(7, 2)
            },
            voucher_date: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            voucher_url: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            observation: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM('Caja Tesorería', 'Deposíto', 'Transferencia')
            },
            state: {
                allowNull: false,
                type: Sequelize.ENUM('Aceptado', 'Regularizado', 'Observado', 'Registrado', 'Anulado'),

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
            schema: 'accounting'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Movement', {schema: 'accounting'});
    }
};
