'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Program_document', {
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
            id_document: {
                allowNull: true,
                type: Sequelize.INTEGER
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

        return queryInterface.dropTable('Program_document', {schema: 'programs'});
    }
};
