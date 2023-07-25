'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Document_book', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_concept: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_academic_calendar: {
                allowNull: false,
                type: Sequelize.INTEGER

            },
            id_payment: {
                allowNull: false,
                type: Sequelize.INTEGER

            },
            id_program: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            id_student: {
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
            observation: {
                allowNull: true,
                type: Sequelize.STRING
            },
            file: {
                allowNull: true,
                type: Sequelize.STRING
            },
            state_upload: {
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
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('Document_book', {schema: 'programs'});
    }
};
