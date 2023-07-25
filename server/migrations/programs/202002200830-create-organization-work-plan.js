'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Organization_work_plan', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_work_plan: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Work_plan',
                        schema: 'programs'
                    },
                    key: 'id',
                    as: 'id_work_plan'
                }
            },
            id_person: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            charge: {
                allowNull: true,
                type: Sequelize.STRING
            },
            observation: {
                allowNull: true,
                type: Sequelize.TEXT
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

        return queryInterface.dropTable('Organization_work_plan', {schema: 'programs'});
    }
};
