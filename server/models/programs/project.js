'use strict';
module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
        id_student: {allowNull: false, type: DataTypes.INTEGER},
        id_adviser: {allowNull: false, type: DataTypes.INTEGER},
        id_president: {allowNull: true, type: DataTypes.INTEGER},
        id_secretary: {allowNull: true, type: DataTypes.INTEGER},
        id_vocal: {allowNull: true, type: DataTypes.INTEGER},
        id_organic_unit: {allowNull: true, type: DataTypes.INTEGER},
        id_program: {allowNull: false, type: DataTypes.INTEGER},


        project_name: {allowNull: false, type: DataTypes.STRING},
        project_file: {allowNull: false, type: DataTypes.STRING},


        // resolution_project: {allowNull: false, type: DataTypes.STRING},
        // resolution_project_date: {allowNull: false, type: DataTypes.STRING},
        // resolution_project_file: {allowNull: false, type: DataTypes.STRING},


        resolution_jury: {allowNull: true, type: DataTypes.STRING},
        resolution_jury_date: {allowNull: true, type: DataTypes.STRING},
        resolution_jury_file: {allowNull: true, type: DataTypes.STRING},

        observation: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.STRING},
        // state_upload: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Project",
        schema: 'programs'
    });
    Project.associate = function (models) {
        Project.belongsTo(models.Student, {
            foreignKey: 'id_student',
            targetKey: 'id',
            as: 'Student',

        });
        Project.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',

        });
        Project.hasOne(models.Project_round, {
            foreignKey: 'id_project',
            as: 'Project_round',
        });
        Project.hasMany(models.Project_round, {
            foreignKey: 'id_project',
            as: 'Project_rounds',
        });
        Project.belongsTo(models.Person, {
            foreignKey: 'id_adviser',
            targetKey: 'id',
            as: 'Adviser',

        });
        Project.belongsTo(models.Person, {
            foreignKey: 'id_president',
            targetKey: 'id',
            as: 'President',

        });

        Project.belongsTo(models.Person, {
            foreignKey: 'id_secretary',
            targetKey: 'id',
            as: 'Secretary',

        });
        Project.belongsTo(models.Person, {
            foreignKey: 'id_vocal',
            targetKey: 'id',
            as: 'Vocal',

        });


    };


    return Project;
};
