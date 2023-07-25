'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Building', {
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
                        tableName: 'Building',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_parent'
                }
            },
            id_campus: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Campus',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_campus'
                }
            },
            id_type_building: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Type_building',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_type_building'
                }
            },
            denomination: {
                allowNull: false,
                type: Sequelize.STRING(255)
            },
            abbreviation: {
                allowNull: false,
                type: Sequelize.STRING(255)
            },
            hierarchy: {
                allowNull: false,
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('Building', {schema: 'general'});
    }
};
