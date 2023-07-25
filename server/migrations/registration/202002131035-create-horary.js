'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Horary', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_schedule: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_teacher: {
                allowNull: true,
                type: Sequelize.INTEGER
            },

            type_course: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            days: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            ambient: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            start_time: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            end_time: {
                allowNull: false,
                type: Sequelize.STRING(100)
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
        await queryInterface.dropTable('Horary', {schema: 'registration'});
    }
};
