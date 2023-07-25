'use strict';
module.exports = (sequelize, DataTypes) => {
    const Project_round = sequelize.define('Project_round', {
        id_project: {allowNull: false, type: DataTypes.INTEGER},
        id_person: {allowNull: false, type: DataTypes.INTEGER},

        type: {allowNull: true, type: DataTypes.STRING},
        round: {
            allowNull: true,
            type: DataTypes.SMALLINT
        },
        observation_file: {allowNull: true, type: DataTypes.STRING},
        observation_date: {allowNull: true, type: DataTypes.STRING},
        response_file: {allowNull: true, type: DataTypes.STRING},
        response_date: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.STRING},
        state_upload: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Project_round",
        schema: 'programs'
    });
    Project_round.associate = function (models) {

    };


    return Project_round;
};
