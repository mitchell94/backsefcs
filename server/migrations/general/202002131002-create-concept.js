'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Concept', {
            id: {
                allowNull: true,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_category_concept: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Category_concept',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_category_concept'
                }
            },
            percent: {
                allowNull: true,
                type: Sequelize.NUMERIC(7, 2)
            },
            order: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            denomination: {
                allowNull: true,
                type: Sequelize.STRING
            },

            type: {
                allowNull: false,
                type: Sequelize.ENUM('Ingreso', 'Egreso')
            },
            state: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            generate: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('Concept', {schema: 'general'});
    }
};
