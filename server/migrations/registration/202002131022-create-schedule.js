'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Schedule', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            id_course: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_process: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_program: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            group_class: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            type_registration: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            start_date: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            end_date: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            end_date_acta: {
                allowNull: true,
                type: Sequelize.STRING(30)
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
            schema: 'registration'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Schedule', {schema: 'registration'});
    }
};
