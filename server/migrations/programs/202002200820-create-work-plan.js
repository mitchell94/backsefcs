'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Work_plan', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_program: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Programs',
                        schema: 'programs'
                    },
                    key: 'id',
                    as: 'id_program'
                }
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
            id_process: {
                allowNull: false,
                type: Sequelize.INTEGER,

            },
            description: {
                allowNull: false,
                type: Sequelize.STRING(200)
            },
            number_student: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            days: {
                allowNull: false,
                type: Sequelize.JSONB
            },
            date_start: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            date_end: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            start_time: {
                allowNull: false,
                type: Sequelize.STRING(100)
            },
            end_time: {
                allowNull: false,
                type: Sequelize.STRING(100)
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

        return queryInterface.dropTable('Work_plan', {schema: 'programs'});
    }
};
