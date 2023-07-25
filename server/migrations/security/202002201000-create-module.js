'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Module', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_parent: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Module',
                        schema: 'security'
                    },
                    key: 'id',
                    as: 'id_parent'
                }
            },
            module_name: {
                allowNull: true,
                type: Sequelize.STRING(120)
            },
            type: {
                allowNull: true,
                type: Sequelize.ENUM('noItem', 'item', 'group', 'collapse')
            },
            classes: {
                allowNull: true,
                type: Sequelize.STRING(120)
            },
            icon: {
                allowNull: true,
                type: Sequelize.STRING(50)
            },
            url: {
                allowNull: true,
                type: Sequelize.STRING(120)
            },
            code: {
                allowNull: true,
                type: Sequelize.STRING(10)
            },
            order: {
                allowNull: false,
                type: Sequelize.SMALLINT
            },
            denomination: {
                allowNull: false,
                type: Sequelize.STRING(120)
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
        await queryInterface.dropTable('Module', {schema: 'security'});
    }
};
