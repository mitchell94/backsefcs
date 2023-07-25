'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Payment', {
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
            id_registration: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_concept: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_cost_admission: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_semester: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            payment_date: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            order_number: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            denomination: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            amount: {
                allowNull: false,
                type: Sequelize.NUMERIC(7, 2)
            },

            type: {
                allowNull: false,
                type: Sequelize.ENUM('Pagado', 'Aceptado', 'Pendiente', 'Regularizado', 'Registrado', 'Confirmado', 'Anulado', 'Retirado')
            },
            generate: {// (0 no corresponde | 1 si | 1 no)
                allowNull: false,
                type: Sequelize.SMALLINT,
                defaultValue: 0
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
            schema: 'accounting'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Payment', {schema: 'accounting'});
    }
};
