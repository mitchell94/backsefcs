'use strict';
module.exports = (sequelize, DataTypes) => {
    const System_configuration = sequelize.define('System_configuration', {
        description: {allowNull: true, type: DataTypes.STRING},
        abbreviation: {allowNull: true, type: DataTypes.STRING},
        description_document: {allowNull: true, type: DataTypes.STRING},
        logo: {allowNull: true, type: DataTypes.STRING},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "System_configuration",
        schema: 'general'
    });
    System_configuration.associate = function (models) {
        // associations can be defined here
    };
    return System_configuration;
};
