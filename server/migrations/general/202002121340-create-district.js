'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('District', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_province: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Province',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_province'
                }
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING
            },
            code: {
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
            schema: 'general' 
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('District');
    }
};