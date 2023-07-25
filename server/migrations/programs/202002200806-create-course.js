'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Course', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            id_ciclo: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Ciclo',
                        schema: 'programs'
                    },
                    key: 'id',
                    as: 'id_ciclo'
                }
            },
            requirements: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            code: {
                allowNull: true,
                type: Sequelize.STRING(15)
            },
            denomination: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            abbreviation: {
                allowNull: true,
                type: Sequelize.STRING(20)
            },
            area: {
                allowNull: true,
                type: Sequelize.STRING(100)
            },
            order: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            opening: {
                allowNull: true,
                type: Sequelize.JSONB
            },

            credits: {
                allowNull: false,
                type: Sequelize.SMALLINT
            },
            practical_hours: {
                allowNull: false,
                type: Sequelize.SMALLINT
            },
            hours: {
                allowNull: false,
                type: Sequelize.SMALLINT
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM('Obligatorio', 'Electivo')
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
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Course', {schema: 'programs'});
    }
};
