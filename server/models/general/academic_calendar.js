'use strict';
module.exports = (sequelize, DataTypes) => {
    const Academic_calendar = sequelize.define('Academic_calendar', {

        denomination: {allowNull: false, type: DataTypes.STRING(100)},
        date_start: {allowNull: true, type: DataTypes.STRING(30)},
        date_end: {allowNull: true, type: DataTypes.STRING(30)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Academic_calendar",
        schema: 'general'
    });
    Academic_calendar.associate = function (models) {
      // associations can be defined here
        Academic_calendar.hasOne(models.Academic_semester, {
            foreignKey: 'id_academic_calendar',
            as: 'Academic_semester'
        });

        Academic_calendar.hasMany(models.Academic_semester, {
            foreignKey: 'id_academic_calendar',
            as: 'Academic_semesters'
        });
    };
    return Academic_calendar;
};
