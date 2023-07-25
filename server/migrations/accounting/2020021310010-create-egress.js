'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Egress', {
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
            id_admission_plan: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_concept: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_teacher: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_administrative: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_material: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_course: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            document_one: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            order_number: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            type: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            type_teacher: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            init_date: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            end_date: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            amount: {
                allowNull: false,
                type: Sequelize.NUMERIC(7, 2)
            },
            state_egress: {
                allowNull: true,
                type: Sequelize.STRING(10)
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
        await queryInterface.dropTable('Egress', {schema: 'accounting'});
    }
};
