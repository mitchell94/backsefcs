'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('User_role', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_user: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'User',
                        schema: 'security'
                    },
                    key: 'id',
                    as: 'id_user'
                }
            },
            id_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            id_role: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Role',
                        schema: 'security'
                    },
                    key: 'id',
                    as: 'id_role'
                }
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
            schema: 'security'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('User_role', {schema: 'security'});
    }
};
