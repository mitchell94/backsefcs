'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Organic_unit', {
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
                        tableName: 'Organic_unit',
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
            id_type_organic_unit: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Type_organic_unit',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_type_organic_unit'
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
            code_local: {
                allowNull: true,
                type: Sequelize.STRING(10),
            },
            code_faculty_unit: {
                allowNull: true,
                type: Sequelize.STRING(10),
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
        await queryInterface.dropTable('Organic_unit', {schema: 'general'});
    }
};
