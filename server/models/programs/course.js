'use strict';
module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        id_ciclo: {allowNull: false, type: DataTypes.INTEGER},
        code: {allowNull: true, type: DataTypes.STRING(15)},
        denomination: {allowNull: false, type: DataTypes.TEXT},
        abbreviation: {allowNull: true, type: DataTypes.STRING(20)},
        area: {allowNull: true, type: DataTypes.STRING(100)},
        order: {allowNull: true, type: DataTypes.SMALLINT},
        credits: {allowNull: false, type: DataTypes.SMALLINT},
        practical_hours: {allowNull: false, type: DataTypes.SMALLINT},
        hours: {allowNull: false, type: DataTypes.SMALLINT},
        requirements: {allowNull: true, type: DataTypes.TEXT},
        opening: {allowNull: true, type: DataTypes.JSONB},
        type: {allowNull: false, type: DataTypes.ENUM('Obligatorio', 'Electivo')},
        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Course",
        schema: 'programs'
    });
    Course.associate = function (models) {

        Course.belongsTo(models.Ciclo, {
            foreignKey: 'id_ciclo',
            targetKey: 'id',
            as: 'Ciclo',
            onDelete: 'CASCADE',
        });

        Course.hasMany(models.Registration_course, {
            foreignKey: 'id_course',
            as: 'Registration_courses',
        });

        Course.hasOne(models.Registration_course, {
            foreignKey: 'id_course',
            as: 'R_c',
        });

        Course.hasOne(models.Schedule, {
            foreignKey: 'id_course',
            as: 'Schedule',
        });
    };
    return Course;
};
