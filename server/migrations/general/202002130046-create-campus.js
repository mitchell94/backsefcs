    'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Campus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_district: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'District',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_district'
                }
            },
            code: {
                allowNull: true,
                type: Sequelize.STRING(255)
            },
            denomination: {
                allowNull: false,
                type: Sequelize.STRING(255)
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM('Matrix', 'Subsidiary')
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
        await queryInterface.dropTable('Campus', {schema: 'general'});
    }
};
