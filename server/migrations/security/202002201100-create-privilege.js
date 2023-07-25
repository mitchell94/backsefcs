'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Privilege', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_role: {
                allowNull: false,
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
            id_module: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Module',
                        schema: 'security'
                    },
                    key: 'id',
                    as: 'id_module'
                }
            },
            permit: {
                allowNull: false,
                type: Sequelize.ENUM('0','1','2','3')
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
        await queryInterface.dropTable('Privilege', {schema: 'security'});
    }
};
