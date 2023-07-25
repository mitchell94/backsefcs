'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Acta_book', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_course: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_schedule: {
                allowNull: false,
                type: Sequelize.INTEGER

            },
            id_program: {
                allowNull: false,
                type: Sequelize.INTEGER

            },
            id_admission_plan: {
                allowNull: true,
                type: Sequelize.INTEGER

            },
            id_process: {
                allowNull: false,
                type: Sequelize.INTEGER

            },
            id_teacher: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            correlative: {
                allowNull: true,
                type: Sequelize.STRING
            },
            type: {
                allowNull: true,
                type: Sequelize.STRING
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
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('Acta_book', {schema: 'programs'});
    }
};
