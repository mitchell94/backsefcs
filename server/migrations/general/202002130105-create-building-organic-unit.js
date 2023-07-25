'use strict';
module.exports = {
    up:async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Building_organic_unit', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Organic_unit',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_organic_unit'
                }
            },
            id_building: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Building',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_building'
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
            schema: 'general'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Building_organic_unit', {schema: 'general'});
    }
};
