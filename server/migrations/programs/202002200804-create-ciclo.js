'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Ciclo', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_plan: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Plan',
                        schema: 'programs'
                    },
                    key: 'id',
                    as: 'id_plan'
                }
            },
            period: {
                allowNull: false,
                type: Sequelize.STRING(2),
            },
            ciclo: {
                allowNull: false,
                type: Sequelize.ENUM("I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"),
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
        return queryInterface.dropTable('Semester_mention', {schema: 'programs'});
    }
};
