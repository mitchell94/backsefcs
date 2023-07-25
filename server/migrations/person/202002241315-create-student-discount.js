'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Student_discount', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_student: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Student',
                        schema: 'person'
                    },
                    key: 'id',
                    as: 'id_student'
                }
            },
            id_discount: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            id_document: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            amount: {
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
            schema: 'person'
        });
    },
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('Student_discount', {schema: 'person'});
    }
};
