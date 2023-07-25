'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Registration_course', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_registration: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Registration',
                        schema: 'registration'
                    },
                    key: 'id',
                    as: 'id_registration'
                }
            },
            id_schedule: {
                allowNull: true,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Schedule',
                        schema: 'registration'
                    },
                    key: 'id',
                    as: 'id_schedule'
                }
            },
            id_course: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            type_course: {
                allowNull: false,
                type: Sequelize.STRING
            },
            note: {
                allowNull: true,
                type: Sequelize.SMALLINT,
                defaultValue: 0
            },

            state: {
                allowNull: false,
                type: Sequelize.ENUM('Aprobado', 'Desaprobado', 'Retirado', 'Cursando', 'Sin nota'),
                defaultValue: 'Cursando'
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
            schema: 'registration'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Registration_course', {schema: 'registration'});
    }
};
