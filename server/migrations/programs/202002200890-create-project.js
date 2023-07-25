'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Project', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_student: {allowNull: false, type: Sequelize.INTEGER},
            id_adviser: {allowNull: false, type: Sequelize.INTEGER},
            id_president: {allowNull: true, type: Sequelize.INTEGER},
            id_secretary: {allowNull: true, type: Sequelize.INTEGER},
            id_vocal: {allowNull: true, type: Sequelize.INTEGER},
            id_organic_unit: {allowNull: false, type: Sequelize.INTEGER},
            id_program: {allowNull: false, type: Sequelize.INTEGER},

            project_name: {allowNull: false, type: Sequelize.STRING},
            project_file: {allowNull: false, type: Sequelize.STRING},


            // resolution_project: {allowNull: false, type: Sequelize.STRING},
            // resolution_project_file: {allowNull: false, type: Sequelize.STRING},
            // resolution_project_date: {allowNull: false, type: Sequelize.STRING},


            resolution_jury: {allowNull: true, type: Sequelize.STRING},
            resolution_jury_file: {allowNull: true, type: Sequelize.STRING},
            resolution_jury_date: {allowNull: true, type: Sequelize.STRING},


            observation: {allowNull: true, type: Sequelize.STRING},
            state: {allowNull: false, type: Sequelize.STRING, defaultValue: true},
            created_at: {allowNull: false, type: Sequelize.DATE},
            updated_at: {allowNull: false, type: Sequelize.DATE},
            deleted_at: {allowNull: true, type: Sequelize.DATE}
        }, {
            schema: 'programs'
        });
    },
    down: (queryInterface, Sequelize) => {

        return queryInterface.dropTable('Project', {schema: 'programs'});
    }
};
