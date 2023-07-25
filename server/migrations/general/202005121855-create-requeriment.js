'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Requeriment', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_academic_degree: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Academic_degree',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_academic_degree'
                }
            },
            id_concept: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Concept',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_concept'
                }
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            type_entry: {
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
        await queryInterface.dropTable('Requeriment', {schema: 'general'});
    }
};
