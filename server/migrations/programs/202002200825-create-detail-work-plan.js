'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Detail_work_plan', {
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
            foundation: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            objective: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            legal_base: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            organization: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            request: {
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

        return queryInterface.dropTable('Detail_work_plan', {schema: 'programs'});
    }
};
