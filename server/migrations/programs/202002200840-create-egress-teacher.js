'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Egress_teacher', {
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
            id_concept: {
                allowNull: false,
                type: Sequelize.INTEGER,

            },
            id_person: {
                allowNull: false,
                type: Sequelize.INTEGER,

            },
            id_course: {
                allowNull: false,
                type: Sequelize.INTEGER,

            },
            cant: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },

            price_hour: {
                allowNull: true,
                type: Sequelize.NUMERIC(7, 2)
            },
            observation: {
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
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('Egress_teacher', {schema: 'programs'});
    }
};
