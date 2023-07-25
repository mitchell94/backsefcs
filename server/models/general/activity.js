'use strict';
module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        id_activity_type: {allowNull: true, type: DataTypes.INTEGER},
        denomination: {allowNull: false, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Activity",
        schema: 'general'
    });
    Activity.associate = function (models) {
        // associations can be defined here 
        Activity.belongsTo(models.Activity_type, {
            foreignKey: 'id_activity_type',
            targetKey: 'id',
            as: 'Activity_type',
            onDelete: 'CASCADE'
        });
        Activity.belongsTo(models.Activity_type, {
            foreignKey: 'id_activity_type',
            targetKey: 'id',
            as: 'A_t',
            onDelete: 'CASCADE'
        });

        Activity.hasMany(models.Semester_activity, {
            foreignKey: 'id_activity',
            as: 'Semester_activity',
        });
    };
    return Activity;
};
