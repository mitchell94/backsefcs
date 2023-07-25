'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Activity', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_activity_type: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Activity_type',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_activity_type'
                }
            },
            denomination: {
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
            schema: 'general'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Activity', {schema: 'general'});
    }
};
