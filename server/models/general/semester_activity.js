'use strict';
module.exports = (sequelize, DataTypes) => {
    const Semester_activity = sequelize.define('Semester_activity', {
        id_academic_semester: {allowNull: false, type: DataTypes.INTEGER},
        id_activity: {allowNull: true, type: DataTypes.INTEGER},
        id_program: {allowNull: true, type: DataTypes.INTEGER},
        date_start: {allowNull: true, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        actual: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        finish: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        raw: true,
        tableName: "Semester_activity",
        schema: 'general'
    });
    Semester_activity.associate = function (models) {
        // associations can be defined here
        Semester_activity.belongsTo(models.Activity, {
            foreignKey: 'id_activity',
            targetKey: 'id',
            as: 'Activity',
            onDelete: 'CASCADE'
        });
        Semester_activity.belongsTo(models.Academic_semester, {
            foreignKey: 'id_academic_semester',
            targetKey: 'id',
            as: 'AS',
            onDelete: 'CASCADE'
        });
        Semester_activity.hasMany(models.Registration, {
            foreignKey: 'id_semester',
            as: 'Registration'
        });


    };
    return Semester_activity;
};
