'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity_type = sequelize.define('Activity_type', {
        denomination: {allowNull: false, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Activity_type",
        schema: 'general'
    });
    Activity_type.associate = function (models) {
        // associations can be defined here
        Activity_type.hasMany(models.Activity, {
            foreignKey: 'id_activity_type',
            as: 'Activity',
        });
    };
    return Activity_type;
};
