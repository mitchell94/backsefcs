'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Entity', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_person: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Person',
                        schema: 'person'
                    },
                    key: 'id',
                    as: 'id_person'
                }
            },
            id_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER,
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
            schema: 'person'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Entity', {schema: 'person'});
    }
};
