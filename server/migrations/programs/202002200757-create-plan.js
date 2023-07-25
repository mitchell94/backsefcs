'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Plan', {
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
          
            code: {
                allowNull: false,
                type: Sequelize.STRING(6),
            },
            description: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            credit_required: {
                allowNull: false,
                type: Sequelize.SMALLINT
            },
            credit_elective: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            mesh: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            valid: {
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
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {
        // return queryInterface.dropTable('Mention', {schema: 'programs'});
        return queryInterface.dropTable('Plan', {schema: 'programs'});
    }
};
