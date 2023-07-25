'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Egress_comission', {
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

            amount: {
                allowNull: true,
                type: Sequelize.NUMERIC(7, 2)
            },
            charge: {
                allowNull: true,
                type: Sequelize.STRING
            },
            number_month: {
                allowNull: true,
                type: Sequelize.SMALLINT
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

        return queryInterface.dropTable('Egress_comission', {schema: 'programs'});
    }
};
