'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Project_round', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_project: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Project',
                        schema: 'programs'
                    },
                    key: 'id',
                    as: 'id_project'
                }
            },



            id_person: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            type: {
                allowNull: false,
                type: Sequelize.STRING
            },

            round: {
                allowNull: true,
                type: Sequelize.SMALLINT
            },
            observation_file: {
                allowNull: true,
                type: Sequelize.STRING
            },
            observation_date: {
                allowNull: true,
                type: Sequelize.STRING
            },

            response_file: {
                allowNull: true,
                type: Sequelize.STRING
            },

            response_date: {
                allowNull: false,
                type: Sequelize.STRING,

            },
            state_upload: {
                allowNull: false,
                type: Sequelize.STRING,

            }, state: {
                allowNull: false,
                type: Sequelize.STRING,

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

        return queryInterface.dropTable('Project_round', {schema: 'programs'});
    }
};
