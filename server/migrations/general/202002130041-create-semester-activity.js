'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Semester_activity', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_academic_semester: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Academic_semester',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_academic_semester'
                }
            },
            id_activity: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Activity',
                        schema: 'general'
                    },
                    key: 'id',
                    as: 'id_activity'
                }
            },
            id_program: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            date_start: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            date_end: {
                allowNull: true,
                type: Sequelize.STRING(30)
            },
            actual: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            finish: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('Semester_activity', {schema: 'general'});
    }
};
