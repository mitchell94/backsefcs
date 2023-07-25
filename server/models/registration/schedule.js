'use strict';
module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {

        id_course: {allowNull: false, type: DataTypes.INTEGER},
        id_process: {allowNull: false, type: DataTypes.INTEGER},
        id_program: {allowNull: false, type: DataTypes.INTEGER},
        group_class: {allowNull: false, type: DataTypes.STRING},
        type_registration: {allowNull: false, type: DataTypes.STRING},
        start_date: {allowNull: true, type: DataTypes.STRING(30)},
        end_date: {allowNull: true, type: DataTypes.STRING(30)},
        end_date_acta: {allowNull: true, type: DataTypes.STRING(30)},

        state: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        underscored: true,
        tableName: "Schedule",
        schema: 'registration'
    });
    Schedule.associate = function (models) {
        // associations can be defined here
        Schedule.belongsTo(models.Academic_semester, {
            foreignKey: 'id_process',
            targetKey: 'id',
            as: 'Academic_semester',
            onDelete: 'CASCADE'
        });
        Schedule.belongsTo(models.Programs, {
            foreignKey: 'id_program',
            targetKey: 'id',
            as: 'Program',
            onDelete: 'CASCADE'
        });

        Schedule.hasOne(models.Acta_book, {
            foreignKey: 'id_schedule',
            as: 'Acta_book'
        });
        Schedule.hasMany(models.Acta_book, {
            foreignKey: 'id_schedule',
            as: 'Acta_books'
        });

        Schedule.belongsTo(models.Course, {
            foreignKey: 'id_course',
            targetKey: 'id',
            as: 'Course',
            onDelete: 'CASCADE'
        });

        Schedule.hasMany(models.Registration_course, {
            foreignKey: 'id_schedule',
            as: 'Registration_courses'
        });

        Schedule.hasMany(models.Teacher, {
            foreignKey: 'id_schedule',
            as: 'Teachers',
        });
        Schedule.hasOne(models.Teacher, {
            foreignKey: 'id_schedule',
            as: 'Teacher',
        });
    };
    return Schedule;
};
