'use strict';
module.exports = (sequelize, DataTypes) => {
    const Registration_course = sequelize.define('Registration_course', {

        id_course: {allowNull: false, type: DataTypes.INTEGER},
        id_registration: {allowNull: false, type: DataTypes.INTEGER},
        id_schedule: {allowNull: true, type: DataTypes.INTEGER},
        type_course: {allowNull: false, type: DataTypes.STRING},//R = REGULAR // D=DIRIGIDO // C=CONVALIDADO
        note: {allowNull: true, type: DataTypes.SMALLINT, defaultValue: 0},
        state: {
            allowNull: false,
            type: DataTypes.ENUM('Aprobado', 'Desaprobado', 'Retirado', 'Cursando', 'Sin nota'),
            defaultValue: 'Cursando'
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Registration_course",
        schema: 'registration'
    });
    Registration_course.associate = function (models) {
        // associations can be defined here
        Registration_course.belongsTo(models.Course, {
            foreignKey: 'id_course',
            targetKey: 'id',
            as: 'Course',
            onDelete: 'CASCADE'
        });
        Registration_course.belongsTo(models.Schedule, {
            foreignKey: 'id_schedule',
            targetKey: 'id',
            as: 'Schedule',
            onDelete: 'CASCADE'
        });
        Registration_course.belongsTo(models.Registration, {
            foreignKey: 'id_registration',
            targetKey: 'id',
            as: 'Registration',
            onDelete: 'CASCADE'
        });
    };
    return Registration_course;
};
