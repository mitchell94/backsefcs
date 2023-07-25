'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Department', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_country: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Country',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_country'
                }
            },
            description: {
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
        await queryInterface.dropTable('Department');
    }
};