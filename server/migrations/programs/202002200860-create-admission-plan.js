'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Admission_plan', {
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

            date_start: {
                allowNull: false,
                type: Sequelize.STRING(30)
            },
            date_end: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },

            type_process: {
                allowNull: false,
                type: Sequelize.ENUM('Regular'),
                defaultValue: 'Regular'
            },
            date_class: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            duration: {
                allowNull: true,
                type: Sequelize.SMALLINT
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

        return queryInterface.dropTable('Admission_plan', {schema: 'programs'});
    }
};
