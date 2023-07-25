'use strict';
module.exports = (sequelize, DataTypes) => {
    const Academic_semester = sequelize.define('Academic_semester', {
        id_academic_calendar: {allowNull: false, type: DataTypes.INTEGER},
        id_semester: {allowNull: false, type: DataTypes.INTEGER},
        denomination: {allowNull: false, type: DataTypes.STRING(100)},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
        actual: {allowNull: true, type: DataTypes.BOOLEAN, defaultValue: false},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName:"Academic_semester",
        schema: 'general'
    });
    Academic_semester.associate = function (models) {
        // associations can be defined here
        Academic_semester.belongsTo(models.Semester, {
            foreignKey: 'id_semester',
            targetKey: 'id',
            as: 'Semester',
            onDelete: 'CASCADE',
        });
        Academic_semester.belongsTo(models.Academic_calendar, {
            foreignKey: 'id_academic_calendar',
            targetKey: 'id',
            as: 'AC',
            onDelete: 'CASCADE',
        });
        Academic_semester.belongsTo(models.Academic_calendar, {
            foreignKey: 'id_academic_calendar',
            targetKey: 'id',
            as: 'Academic_calendar',
            onDelete: 'CASCADE',
        });
        Academic_semester.belongsTo(models.Academic_calendar, {
            foreignKey: 'id_academic_calendar',
            targetKey: 'id',
            as: 'A_c',
            onDelete: 'CASCADE',
        });
        Academic_semester.hasMany(models.Semester_activity, {
            foreignKey: 'id_academic_semester',
            as: 'Semester_activity'
        });
        Academic_semester.hasOne(models.Semester_activity, {
            foreignKey: 'id_academic_semester',
            as: 'SemesterO'
        });
        Academic_semester.hasMany(models.Semester_activity, {
            foreignKey: 'id_academic_semester',
            as: 'S_a'
        });

    };
    return Academic_semester;
};
