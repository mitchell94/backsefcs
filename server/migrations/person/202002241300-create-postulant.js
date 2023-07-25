'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Postulant', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_program: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_plan: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_admission_plan: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_cost_admission_plan: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_process: {///hacer referencia a id_academic_semester
                allowNull: false,
                type: Sequelize.INTEGER
            },
            code: {
                allowNull: true,
                type: Sequelize.STRING(10)
            },
            code_cost: {
                allowNull: true,
                type: Sequelize.STRING(10)
            },
            document_number: {
                allowNull: false,
                type: Sequelize.STRING(15)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(255)
            },
            phone: {
                allowNull: true,
                type: Sequelize.STRING(12)
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING(150)
            },
            send_mail: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            voucher_code: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            voucher_amount: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            voucher_date: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            voucher_url: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            voucher_state: {
                allowNull: false,
                type: Sequelize.ENUM('Pendiente', 'Registrado', 'Aceptado', 'Anulado', 'Observado'),
                defaultValue: 'Pendiente'
            },
            observation: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            online: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
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
        await queryInterface.dropTable('Postulant', {schema: 'person'});
    }
};
